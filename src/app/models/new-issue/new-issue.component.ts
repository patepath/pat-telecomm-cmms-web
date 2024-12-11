import { Component, AfterViewInit } from '@angular/core';
import { FormsModule, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { APIfileAttach, Category, Department, Equipment, FileAttachInfomation, Group, Issue, IssueType, LoginInfo, Phone, User } from '../../interfaces';
import { IssueService } from '../../services/issue.service';
import { Subject, debounceTime, filter, switchMap } from 'rxjs';
import { PhoneService } from '../../services/phone.service';
import { JobsProcessService } from '../../services/jobs-process.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

declare interface DataTable {
    headerRow: string[];
    footerRow: string[];
    dataRows: string[][];
}

declare let $:any;

@Component({
  selector: 'app-new-issue',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
	ReactiveFormsModule,
  ],
  templateUrl: './new-issue.component.html',
  styleUrl: './new-issue.component.css'
})
export class NewIssueComponent implements AfterViewInit {
	public dataTable!: DataTable;
	public data!: string[][];

	public issue: Issue=<Issue>{}
	public issues: Issue[]=[];
	public issueTypes: IssueType[]=[];
	public dept: Department=<Department>{}
	public depts: Department[]=[];
	public group: Group=<Group>{};
	public groups: Group[]=[];
	public equipment: Equipment=<Equipment>{};
	public equipments: Equipment[]=[];
	public category: Category=<Category>{};
	public categories: Category[]=[];
	public phones: Phone[]=[];
	public phone: Phone=<Phone>{};
	public search: string='';
	public onSearchPhone$ = new Subject<string>();
	public token: string='';

	public selectedFile: File | null = null;
	public files: FileList = <FileList>{};
	public filenames: string[]=[];
	public previews: SafeResourceUrl[]=[];
	
	public apiFileAttach: APIfileAttach=<APIfileAttach>{};
	public fileAttachs: FileAttachInfomation[]=[];
	public isattach: boolean = false;
	
	public issueFrm = new FormGroup({
		id: new FormControl(0),
		issueno: new FormControl(''),
		phone: new FormControl(<Phone>{}, Validators.required),
		tech: new FormControl(<User>{}),
		created: new FormControl(new Date()),
		issuetype: new FormControl(0, Validators.min(1)),
		issuetypeother: new FormControl(''),
		issueby: new FormControl('', Validators.required),
		issuecontactno: new FormControl('', Validators.required),
		issuedescription: new FormControl('', Validators.required),
		issuecause: new FormControl(),
		issuesolution: new FormControl(),
		engineercode: new FormControl(),
		finisheddate: new FormControl(),
		status: new FormControl(0),
		partusages: new FormControl(),
		isattach: new FormControl(false),
		file: new FormControl()
	});

	constructor(
		private readonly _router: Router,
		private readonly _issueServ: IssueService,
		private readonly _phoneServ: PhoneService,
		private readonly _rptServ: JobsProcessService,
		private _sanitizer: DomSanitizer) {

		this.dataTable = {
			headerRow: ['วันที่', 'เวลา', 'เลขที่รับเรื่อง', 'หมายเลข', 'ประเภทงาน', 'ชื่อผู้แจ้ง', 'โทรศัพท์ติดต่อ', 'สถานะ' ],
			footerRow: ['วันที่', 'เวลา', 'เลขที่รับเรื่อง', 'หมายเลข', 'ประเภทงาน', 'ชื่อผู้แจ้ง', 'โทรศัพท์ติดต่อ', 'สถานะ' ],
			dataRows: [],
		};

		this.data = [];
		this.newIssue();

		let storage = localStorage.getItem('info');
		if(storage) {
			let info: LoginInfo = JSON.parse(storage);
			this.token = info.token;
		}

		this._issueServ.getIssueTypes().subscribe(rs => {
			this.issueTypes = rs;
			this.issue.issuetype = 0;
		});

		this.onSearchPhone$
		.pipe(
			filter(val => val.length > 2),
			debounceTime(600),
			switchMap(val =>  { return this._phoneServ.findbynumber(val) })
		)
		.subscribe(val => {
			this.phones=val;

			if(this.phones.length == 1) {
				this.issue.phone = this.phones[0];
			}
		})
	}

	ngAfterViewInit(): void {
		this.initTable();
	}

	initTable() {
		let self = this;

		let table = $('#new-issue-table').DataTable({
			dom: 'frtip',
			buttons: ['copy', 'csv', 'excel', 'print'],
			columnDefs: [
				{ target: [0,1,2,3], width: '8rem', className: 'text-center' },
				{ target: [-1, -2, -3], width: '10rem', className: 'text-center' },
			],
			responsive: true,
			language: {
				search: "_INPUT_",
				searchPlaceholder: "Search records",
			},
			paging: true,
			pageLength: 5,
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
			self.editIssue(table.row(this).index());
		});

		self.searchIssue();
	}

	refreshTable() {
		if(this.issues != null) {
			let date: Date;
			let showdate: string;
			let showtime: string;

			let table = $('#new-issue-table').DataTable();
			table.clear();
			this.data = [];

			if(this.issues) {
				this.issues.forEach(s => {
					date = new Date(s.created.toString());
					showdate = date.toISOString().split('T')[0]; 
					showtime = date.toTimeString().split(' ')[0]; 

					this.data.push([
						showdate, 
						showtime,
						s.issueno,
						s.phone.number + '', 
						this.issueTypes[s.issuetype].name,
						s.issueby, 
						s.issuecontactno,
						this.getStatus(s.status)
					]);
				});
			}

			table.rows.add(this.data);
			table.draw();
		}
	}

	getStatus(status: number): string {
		var v: string='';

		switch(status) {
			case 0:
				v='ดำเนินการ';
				break;
			
			case 1:
				v='ปิดงาน'
				break;

			case 2:
				v='รอปิดงาน';
				break;
		}

		return v; 
	}

	searchIssue() {
		this._rptServ.findall(this.token).subscribe(rs => {
			this.issues = rs;
			this.refreshTable();
		});
	}
	
	editIssue(inx: number) {
		this.issue = this.issues[inx];
		document.getElementById('search')?.setAttribute('value', this.issue.phone.number);
		this.phones = [];
		this.phones.push(this.issue.phone);

		this.issueFrm.get('id')?.setValue(this.issue.id);
		this.issueFrm.get('issueno')?.setValue(this.issue.issueno);
		this.issueFrm.get('created')?.setValue(this.issue.created);
		this.issueFrm.get('issuetype')?.setValue(this.issue.issuetype);
		this.issueFrm.get('issuetypeother')?.setValue(this.issue.issuetypeother);
		this.issueFrm.get('phone')?.setValue(this.issue.phone);
		this.issueFrm.get('issueby')?.setValue(this.issue.issueby);
		this.issueFrm.get('issuecontactno')?.setValue(this.issue.issuecontactno);
		this.issueFrm.get('issuedescription')?.setValue(this.issue.issuedescription);
		this.issueFrm.get('issuecause')?.setValue(this.issue.issuecause);
		this.issueFrm.get('issuesolution')?.setValue(this.issue.issuesolution);
		this.issueFrm.get('partusages')?.setValue(this.issue.partusages);
		this.issueFrm.get('engineercode')?.setValue(this.issue.engineercode);
		this.issueFrm.get('tech')?.setValue(this.issue.tech == null ? <User>{} : this.issue.tech);
		this.issueFrm.get('finisheddate')?.setValue(this.issue.finisheddate);
		this.issueFrm.get('status')?.setValue(this.issue.status);

		this._issueServ.checkfileattach(this.issue.issueno).subscribe(r => {
			this.apiFileAttach = r;
			this.fileAttachs = this.apiFileAttach.data;

			this.previews = [];
			this.fileAttachs.forEach(s => {
				this.previews.push(this._sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' +s.b64));
			});
		});
	}

	searchPhone(search: string) {
		this.onSearchPhone$.next(search);
	}

	changeLocation() {
		var search: HTMLInputElement = <HTMLInputElement>document.getElementById('search');
		var phone: Phone = <Phone>this.issueFrm.get('phone')?.value

		search.value = phone == null ? '' : phone.number;	
	}

	newIssue() {
		this.issueFrm.reset();
		this.issueFrm.get('created')?.setValue(new Date());
		this.issueFrm.get('issuetype')?.setValue(0);
		this.issueFrm.get('isattach')?.setValue(false);
		this.issueFrm.get('file')?.setValue(null);
		this.issueFrm.get('status')?.setValue(0);

		this.issue = <Issue>{}
		this.issue.id = 0;
		this.issue.status=0;
		this.phones = [];
		this.files = <FileList>{};
		this.filenames = [];
		this.previews = [];
		this.isattach = false;

		document.getElementById('search')?.setAttribute('value', '');
	}

	upload() {
		if(this.files && this.files.length>0) {
			let i = 1;

			for(const file of this.files) {
				this._issueServ.upload(this.token, String(i), this.issue.issueno, file).subscribe(rs => {});
				i++;
			}
		}
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

	save() {
		if(this.issue.id == 0){
			this.issue.created = new Date();
		}

		this.issue = <Issue> this.issueFrm.value;
		this.issue.issuetype = Number(this.issueFrm.get('issuetype')?.value);
		this.issue.status = Number(this.issueFrm.get('status')?.value);

		this._issueServ.save(this.token, this.issue, this.isattach, false).subscribe(rs => {
			this.issue.issueno = rs.issueno;
			if(this.isattach) {
				this.upload();
			}

			this.newIssue();
			this.searchIssue();
		});
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
}
