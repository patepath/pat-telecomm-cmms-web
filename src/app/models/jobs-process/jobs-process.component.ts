import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Issue, IssueType } from '../../interfaces';
import { JobsProcessService } from '../../services/jobs-process.service';
import { ActivatedRoute, Router } from '@angular/router';

declare interface DataTable {
    headerRow: string[];
    footerRow: string[];
    dataRows: string[][];
}

declare let $:any;

@Component({
  selector: 'app-jobs-process',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './jobs-process.component.html',
  styleUrl: './jobs-process.component.css'
})
export class JobsProcessComponent implements AfterViewInit {

  public dataTable!: DataTable;
	public data!: string[][];

  public issueTypes: IssueType[]=[];
  public issue: Issue=<Issue>{}
  public issues: Issue[]=[];
  public today: Date = new Date();
  public start: Date = new Date();
  public frmDate: String;
  public toDate: String;
  public token: string='';
  
  constructor(
    private readonly _rptServ: JobsProcessService,
    private readonly _activeRoute: ActivatedRoute,
    private readonly _router: Router) {
      this.dataTable = {
        headerRow: ['ที่', 'วันที่รับเรื่อง', 'เวลา', 'เลขที่รับเรื่อง', 'เลขหมาย', 'สถานที่', 'ความต้องการ/อาการเสีย', 'เคเบิ้ล', 'หมายเลขติดต่อกลับ' ],
        footerRow: ['ที่', 'วันที่รับเรื่อง', 'เวลา', 'เลขที่รับเรื่อง', 'เลขหมาย', 'สถานที่', 'ความต้องการ/อาการเสีย', 'เคเบิ้ล', 'หมายเลขติดต่อกลับ' ],
        dataRows: [],
      };

      this.data=[];

      this.start.setMonth(this.today.getMonth() - 3);
      this.frmDate = this.start.toISOString().split('T')[0];
      this.toDate = this.today.toISOString().split('T')[0];

      let storage = localStorage.getItem('info');
      if(storage) {
        let info = JSON.parse(storage);
        this.token = info.token;
      }
  }

  ngAfterViewInit(): void {
    this.initTable();
  }

  initTable() {
    let self = this;

    let table = $('#proceeding-issue-table').DataTable({
      dom: 'Bfrtip',
      buttons: ['copy', 'csv', 'excel', {
        extend: 'print',
        title: '',
        messageTop:     function() {
                          return `
                          <div>เรียน อกบช./ชกบช.(งานไฟฟ้า)/หบฟ./ชบฟ.(ชศ.)</div>
                          <div>เรื่อง แจ้งผลการรับแจ้งและผลการตรวจแก้โทรศัพท์หมายเลขที่ขัดข้อง<div>
                          <div style="margin-top: 1em; margin-left: 4em">การตรวจแก้ค้าง ประจำวันที่ ${self.getToday().getDate()}/${self.getToday().getMonth() + 1}/${self.getToday().getFullYear()+543} ดังนี้</div>
                          <p>
                          `
                        },
        messageBottom:  function() {
                          return `
                          <div style="margin-top: 4em; text-align: center">
                            <div>จึงเรียนมาเพื่อโปรดทราบ</div>
                            <div style="margin-top: 3em">.........................................</div>
                            <div>หัวหน้าหมวดชุมสาย</div>
                            <div>.........../.........../...........</div>
                          </div>`
                        }
      }],
      columnDefs: [
        { targets: [0], width: '3rem', className: 'text-center' },
        { targets: [2], width: '6rem', className: 'text-center' },
        { targets: [1,3,4], width: '8rem', className: 'text-center' },
        { targets: [5], width: '18rem' },
        { targets: [-1], width: '10rem', className: 'text-center' },
        { targets: [-2], width: '6rem', className: 'text-center' },
      ],
      responsive: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search records",
      },
      ordering: false,
      paging: true,
      pageLength: 10,
      pagingType: "full_numbers",
    });

    table.on('mouseover', 'tr', function(this: any) {
      //let $tr = $(this).closest('tr');
      $(this).css('cursor', 'pointer');
      $(this).css('font-weight', 'bold');
      $(this).css('cursor', 'pointer');
    });

    table.on('mouseout', 'tr', function(this: any) {
      //let $tr = $(this).closest('tr');
      $(this).css('font-weight', 'normal');
      $(this).css('cursor', 'normal');
    });

    table.on('click', 'td', function(this: any) {
      let $tr = $(this).closest('tr');
      var data = table.row($tr).data();
      self._router.navigate(['admin/edit-issue', self.issues[table.row(this).index()].id]);
    });

    self.search();
  }

  refreshTable() {
    let table = $('#proceeding-issue-table').DataTable();
    table.clear();
    this.data = []

    let phone: string;

    if(this.issues) {
      this.issues.forEach((s,i) => {
        let date = new Date(s.created);
        let hh = '00' + date.getHours();
        let mm = '00' + date.getMinutes();
        let ss = '00' + date.getSeconds();

        this.data.push([
          String(i+1),
          s.created.toString().split('T')[0],
          `${hh.substring(hh.length-2)}:${mm.substring(mm.length-2)}:${ss.substring(ss.length-2)}`,
          s.issueno,
          s.phone.number,
          s.phone.location,
          s.issuedescription,
          s.phone.hc,
          s.issuecontactno
        ]);
      });
    }

    table.rows.add(this.data);
    table.draw();
  }

  getToday() {
    let today = new Date()
    return today;
  }

  search() {
    this._rptServ.findall(this.token).subscribe(rs => {
      this.issues = rs;

      this.refreshTable();
    });
  }
}
