import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Issue, LoginInfo } from '../../interfaces';
import { JobsCompletedService } from '../../services/jobs-completed.service';
import { Router } from '@angular/router';

declare interface DataTable {
    headerRow: string[];
    footerRow: string[];
    dataRows: string[][];
}

declare let $:any;

@Component({
  selector: 'app-jobs-closed',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './jobs-closed.component.html',
  styleUrl: './jobs-closed.component.css'
})
export class JobsClosedComponent implements AfterViewInit {
	public dataTable: DataTable;
	public data: string[][];

	public issue: Issue=<Issue>{}
	public issues: Issue[]=[];
  public today: Date = new Date();
  public start: Date = new Date();
  public frmDate: string;
  public toDate: string
  public info: LoginInfo=<LoginInfo>{};
  public filteredCount: number = 0;

  constructor(
    private readonly _rptServ: JobsCompletedService,
    private readonly _router: Router) {
    this.dataTable = {
      headerRow: ['ที่', 'วันที่รับเรื่อง', 'เวลา', 'วันที่ปิดงาน', 'เวลา', 'เลขที่รับเรื่อง', 'เลขหมาย', 'สถานที่', 'ความต้องการ/อาการเสีย', 'เคเบิ้ล', 'หมายเลขติดต่อกลับ' ],
      footerRow: ['ที่', 'วันที่รับเรื่อง', 'เวลา', 'วันที่ปิดงาน', 'เวลา', 'เลขที่รับเรื่อง', 'เลขหมาย', 'สถานที่', 'ความต้องการ/อาการเสีย', 'เคเบิ้ล', 'หมายเลขติดต่อกลับ' ],
      dataRows: [],
    };

    this.data=[];

    this.start.setMonth(this.today.getMonth() - 3);
    this.frmDate = this.today.toISOString().split('T')[0];
    this.toDate = this.today.toISOString().split('T')[0];

    let storage = localStorage.getItem('info');
    if(storage) {
      this.info = JSON.parse(storage);
    }
  }

  ngAfterViewInit(): void {
    this.initTable();
  }

  initTable() {
    let self = this;

    let table = $('#jobs-completed-table').DataTable({
      dom: 'Bfrtip',
      buttons: ['copy', 'csv', 'excel', { 
        extend: 'print',
        title: '',
        messageTop:     function() {
                          return `
                          <div>เรียน อกบช./ชกบช.(งานไฟฟ้า)/หบฟ./ชบฟ.(ชศ.)</div>
                          <div>เรื่อง แจ้งผลการรับแจ้งและผลการตรวจแก้โทรศัพท์หมายเลขที่ขัดข้อง<div>
                          <div style="margin-top: 1em; margin-left: 4em">การตรวจแก้ดี ประจำวันที่ ${self.getToday().getDate()}/${self.getToday().getMonth() + 1}/${self.getToday().getFullYear()+543} ดังนี้</div>
                          <p>
                          `
                        },
        messageBottom:  function() {
                          return `
                          <div style="margin-top: 4em; text-align: center">
                            <div>จึงเรียนมาเพื่อโปรดทราบ</div>
                            <div style="margin-top: 3em">(.........................................)</div>
                            <div>หัวหน้าหมวดชุมสาย</div>
                            <div>.........../.........../...........</div>
                          </div>`
                        }
      }],
      columnDefs: [
        { targets: [0], width: '3rem', className: 'text-center' },
        { targets: [2,4], width: '6rem', className: 'text-center' },
        { targets: [1,3,5,6], width: '8rem', className: 'text-center' },
        { targets: [7], width: '18rem'},
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
      $(this).css('cursor', 'pointer');
      $(this).css('font-weight', 'bold');
    });

    table.on('mouseout', 'tr', function(this: any) {
      $(this).css('font-weight', 'normal');
    });

    table.on('click', 'td', function(this: any) {
      let $tr = $(this).closest('tr');
      self.issue = self.issues[table.row($tr).index()];
      self._router.navigate(['admin/edit-issue', self.issues[table.row(this).index()].id]);
    });

    table.on('search.dt', function() {
      self.filteredCount = table.rows({ search: 'applied' }).count();
    });

    self.searchbydate();
  }

  refreshTable() {
    let table = $('#jobs-completed-table').DataTable();
    table.clear();
    this.data = []

    let phone: string;

    if(this.issues) {
      this.issues.forEach((s,i) => {
        let date = new Date(s.created);
        let hh = '00' + date.getHours();
        let mm = '00' + date.getMinutes();
        let ss = '00' + date.getSeconds();

        let finish = new Date(s.finisheddate);
        let fhh = '00' + finish.getHours();
        let fmm = '00' + finish.getMinutes();
        let fss = '00' + finish.getSeconds();

        this.data.push([
          String(i+1),
          s.created.toString().split('T')[0],
          `${hh.substring(hh.length-2)}:${mm.substring(mm.length-2)}:${ss.substring(ss.length-2)}`,
          s.finisheddate.toString().split('T')[0],
          `${fhh.substring(fhh.length-2)}:${fmm.substring(fmm.length-2)}:${fss.substring(fss.length-2)}`,
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
    table.rows().invalidate().draw(false);
    let t = $('#jobs-completed-table').DataTable();
    this.filteredCount = t.rows({ search: 'applied' }).count();
  }

  search() {
    this._rptServ.findall(this.info.token).subscribe(rs => {
      this.issues = rs;
      this.refreshTable();
    });  
  }

  changePeriod(period: string) {
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth();
    var date = today.getDate();

    switch(period) {
      case "1":
        if(month < 9) {
          today.setFullYear(year-2);
        } else {
          today.setFullYear(year-1);
        }

        today.setMonth(9);
        today.setDate(1);
        break;

      case "2":
        if(month < 9) {
          today.setFullYear(year-1);
        }

        today.setMonth(9);
        today.setDate(1);
        break;
      
      case "3":
        today.setMonth(month-3);
        today.setDate(1);
        break;

      case "4":
        today.setMonth(month-1);
        today.setDate(1);
        break;

      case "5":
        today.setDate(date-7);
        break;
    }

    this.frmDate = today.toISOString().split('T')[0];
    this.searchbydate();
  }

  searchbydate() {
    let frm = this.frmDate;
    let to = this.toDate;

    this._rptServ.findbydate(this.info.token, frm,  to).subscribe(rs => {
      this.issues = rs;
      this.refreshTable();
    });  
  }

  getToday() {
    let today = new Date()
    return today;
  }

}
