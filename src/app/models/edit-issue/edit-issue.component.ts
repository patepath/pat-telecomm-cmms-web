import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { APIfileAttach, FileAttachInfomation, Issue, IssueType, LoginInfo, Part, PartProfile, PartUsage, Phone, User } from '../../interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { IssueService } from '../../services/issue.service';
import { UserService } from '../../services/user.service';
import { PartService } from '../../services/part.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

declare interface DataTable {
    headerRow: string[];
    footerRow: string[];
    dataRows: string[][];
}

declare let $:any;

@Component({
  selector: 'app-edit-issue',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './edit-issue.component.html',
  styleUrl: './edit-issue.component.css'
})
export class EditIssueComponent implements OnInit, AfterViewInit {
	public dataTable: DataTable;
	public data: string[][];
  public issues: Issue[] = [];
  public issue: Issue=<Issue>{};
  public currPhone: Phone=<Phone>{};
  public issueTypes: IssueType[]=[];
  public issueType: IssueType=<IssueType>{};
  public techs: User[]=[];
  public tech: User=<User>{}; 
  public techId?: number;

  public partprofiles: PartProfile[]=[];
  public partprofile: PartProfile=<PartProfile>{};

  public parts: Part[]=[];
  public part: Part=<Part>{};
  public partusages: PartUsage[]=[];
  public partusage: PartUsage=<PartUsage>{};
  public partInx: number = -1;

  public info: LoginInfo=<LoginInfo>{};
  public finishedDate: string='';
	public previews: SafeResourceUrl[]=[];
	public apiFileAttach: APIfileAttach=<APIfileAttach>{};
	public fileAttachs: FileAttachInfomation[]=[];
	public files: FileList = <FileList>{};
	public filenames: string[]=[];
	public isattach: boolean = false;
  public issuetypename: string='';


  constructor(
    private readonly _activeRoute: ActivatedRoute,
    private readonly _router: Router,
    private readonly _issueServ: IssueService,
    private readonly _userServ: UserService,
    private readonly _partServ: PartService,
    private _sanitizer: DomSanitizer
    ) {

    this.dataTable = {
      headerRow: ['ที่', 'รายการอะไหล่ที่ใช้', 'จำนวน', 'หน่วย', 'หมายเหตุ'],
      footerRow: ['ที่', 'รายการอะไหล่ที่ใช้', 'จำนวน', 'หน่วย', 'หมายเหตุ'],
      dataRows: [],
    };

    this.data=[];

    let storage = localStorage.getItem('info');
    if(storage) {
      this.info = JSON.parse(storage);
    }

    this.issue.phone = <Phone>{}
  }

  ngOnInit(): void {
    this._issueServ.getIssueTypes().subscribe(s => this.issueTypes=s);
    this._partServ.findall().subscribe(s => this.parts=s);
    this._partServ.findallpartprofile().subscribe(s => this.partprofiles=s);

    this._activeRoute.params.subscribe(parm => {
      if(parm) {
        this._issueServ.findById(this.info.token, parm['id']).subscribe(rs => {
          this.issue = rs;

          let i = this.issueTypes.find(i => i.value == rs.issuetype);
          if(i) {
            if(rs.issuetype == 0) {
              this.issuetypename = '- ไม่ได้เลือก -' 
            } else {
              this.issuetypename = i.name;
            }
          } else {
            this.issuetypename = '';
          }

          this.partusages = this.issue.partusages;
          this.techId = this.issue.tech == undefined ? 0 : this.issue.tech.id

          this._issueServ.checkfileattach(this.issue.issueno).subscribe(r => {
            this.apiFileAttach = r;
            this.fileAttachs = this.apiFileAttach.data;

            this.previews = [];
            this.fileAttachs.forEach(s => {
              this.previews.push(this._sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' +s.b64));
            });
          });
        });
      }
    });

    this._userServ.gettech(this.info.token).subscribe(rs => {
      this.techs = rs;   
    });

    let today = new Date();
    let year = today.getFullYear();
    let month = '00' + (today.getMonth() + 1);
    month = month.substring(month.length-2);
    let date = '00' + today.getDate()
    date = date.substring(date.length -2);

    this.finishedDate = `${year}-${month}-${date}` 
  }

  ngAfterViewInit(): void {
    this.initTable();
  }

  initTable() {
    let self = this;

    let table = $('#part-usage-table').DataTable({
      dom: 'Bfrtip',
      buttons: [
        {
            text: 'เพิ่มอะไหล่',
            action: function ( e: any, dt: any, node: any, config: any ) {
              self.partusage = <PartUsage>{};
              self.partusage.remark = '';
              self.partInx = -1;
              $('#partModal').modal('show');
            }
        },
      ],
      columnDefs: [
        { targets: [0], width: '3em', className: 'text-center' },
        { targets: [2, 3], width: '10em', className: 'text-center' },
        { targets: [-1], width: '25em', className: 'text-center' },
      ],
      responsive: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search records",
      },
      paging: false,
      pageLength: 15,
      pagingType: "full_numbers",
    });

    table.on('mouseover', 'tr', function(this: any) {
      $(this).css('cursor', 'pointer');
      $(this).css('font-weight', 'bold');
    });

    table.on('mouseout', 'tr', function(this: any) {
      $(this).css('font-weight', 'normal');
    });

    table.on('click', 'td', function(this: any) {
      let $tr = $(this).closest('tr');
      //self.issue = self.issues[table.row($tr).index()];
      self.partInx = table.row($tr).index();
      self.partusage = self.partusages[self.partInx];
      self.part = self.parts[self.partInx];
      $('#partModal').modal('show');
      //self._router.navigate(['admin/edit-issue', self.issues[table.row(this).index()].id]);
    });
  }

  refreshTable() {
    let table = $('#part-usage-table').DataTable();
    table.clear();
    this.data=[];

    this.partusages.forEach((s,i) => {
      this.data.push([
        String(i+1),
        s.name,
        String(s.qty),
        s.unit,
        s.remark
      ]);
    });

    table.rows.add(this.data);
    table.draw();
  }

	onFileSelect(event: any) {
		this.files = (event.target as HTMLInputElement).files!;

		if (this.files && this.files.length > 0) {
			this.previews = [];
			this.filenames = [];
			this.isattach = true;

			for(const file of this.files) {
				const reader = new FileReader();
				reader.readAsDataURL(file);

				reader.onload = (e) => {
					this.previews.push(this._sanitizer.bypassSecurityTrustResourceUrl(String(reader.result)));
				};

				this.filenames.push(file.name);
			}
		}
	}

  changePart() {
    this.partusage.issueid = this.issue.id;
    this.partusage.partid = this.part.id;
    this.partusage.rank = this.partusages.length + 1;
    this.partusage.code = this.part.code;
    this.partusage.name = this.part.name;
    this.partusage.unit = this.part.unit;
  }

  print() {
		const url = this._router.serializeUrl(this._router.createUrlTree(
			['/prn-newissue'], 
			{ 
				queryParams: {
				no: this.issue.phone.number,
				location: this.issue.phone.location,
				type: this.issue.issuetype,
				other: this.issue.issuetypeother
				} 
			}
		));

		window.open(url, '_blank');
  }

  appendpart() {
    if(this.partInx < 0) {
      this.partusages.push(this.partusage);
    } else {
      this.partusages[this.partInx] = this.partusage;
    } 

    this.refreshTable();
    $('#partModal').modal('hide');
  }

  removepart() {
    if(this.partInx > -1) {
      this.partusages.splice(this.partInx, 1);
      this.refreshTable();
      $('#partModal').modal('hide');
    }
  }

	upload() {
		if(this.files && this.files.length>0) {
			let i = 1;

			for(const file of this.files) {
				this._issueServ.upload(this.info.token, String(i), this.issue.issueno, file).subscribe(rs => {});
				i++;
			}
		}
	}

  save() {
    this.issue.partusages = this.partusages;
    this.issue.tech = this.techs.find(val => val.id == this.techId);

    this._issueServ.save(this.info.token, this.issue, false, this.isattach).subscribe(rs => {
			if(this.isattach) {
				this.upload();
			}

      history.back();
    });
  }

  markWait() {
    this.issue.status = 2;
    this.issue.finisheddate = new Date();
    this.issue.tech = this.techs.find(val => val.id == this.techId);

    this._issueServ.save(this.info.token, this.issue, false, true).subscribe(rs => {
      history.back();
    });
  }

  approve() {
    this.issue.status = 1;
    this.issue.partusages = this.partusages;
    this.issue.finisheddate = new Date();
    this.issue.tech = this.techs.find(val => val.id == this.techId);

    this._issueServ.save(this.info.token, this.issue, false, true).subscribe(rs => {
      history.back();
    });
  }

  decline() {
    if(confirm("ต้องการลบงานหรือไม่ ?")) {
      this.issue.status = 99;
      this.issue.finisheddate = new Date();

      this._issueServ.save(this.info.token, this.issue, false, true).subscribe(rs => {
        history.back();
      });
    } 
  }

  cancel() {
    history.back();
  }
}
