import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { LineswapIssue, LoginInfo } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LineswapFinishedService } from '../../services/lineswap-finished.service';

declare interface DataTable {
    headerRow: string[];
    footerRow: string[];
    dataRows: string[][];
}

declare let $:any;
@Component({
  selector: 'app-lineswap-finished',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lineswap-finished.component.html',
  styleUrl: './lineswap-finished.component.css'
})
export class LineswapFinishedComponent implements AfterViewInit {
	public dataTable: DataTable;
	public data: string[][];

	public issue: LineswapIssue=<LineswapIssue>{}
	public issues: LineswapIssue[]=[];

  public today: Date = new Date();
  public start: Date = new Date();
  public frmDate: string;
  public toDate: string
  public info: LoginInfo=<LoginInfo>{}

  constructor(
    private readonly _rptServ: LineswapFinishedService,
    private readonly _router: Router) {
    this.dataTable = {
			headerRow: ['วันที่', 'เวลา', 'เลขที่รับเรื่อง', 'เลขหมาย', 'ประเภทงาน', 'รายละเอียดงาน', 'หมายเหตุ' ],
			footerRow: ['วันที่', 'เวลา', 'เลขที่รับเรื่อง', 'เลขหมาย', 'ประเภทงาน', 'รายละเอียดงาน', 'หมายเหตุ' ],
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
    this.searchbydate();
  }

  initTable() {
    let self = this;

    let table = $('#lineswap-finished-table').DataTable({
      dom: 'Bfrtlp',
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
        { targets: [0,1,2,3], width: '9rem', className: 'text-center' },
        { targets: [-1], width: '12rem', className: 'text-center' },
      ],
      responsive: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search records",
      },
      ordering: true,
      paging: true,
      pageLength: 10,
      pagingType: "full_numbers",
      lengthMenu: [5, 10, 15, 20],
    });

    table.on('mouseover', 'tr', function(this: any) {
      $(this).css('cursor', 'pointer');
      $(this).css('font-weight', 'bold');
    });

    table.on('mouseout', 'tr', function(this: any) {
      $(this).css('font-weight', 'normal');
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

    this._rptServ.findByDate(this.info.token, frm,  to).subscribe(rs => {
      this.issues = rs;
      this.refreshTable();
    });  
  }

  refreshTable() {
    let table = $('#lineswap-finished-table').DataTable();
    table.clear();
    this.data = []

    this.data = [];

    if(this.issues) {
      this.issues.forEach((s,i) => {
        let date = new Date(s.created);
        let hh = '00' + date.getHours();
        let mm = '00' + date.getMinutes();
        let ss = '00' + date.getSeconds();

        this.data.push([
          s.created.toString().split('T')[0],
          `${hh.substring(hh.length-2)}:${mm.substring(mm.length-2)}:${ss.substring(ss.length-2)}`,
          s.issueno,
          s.phone.number,
          this.getIssueType(s.issuetype),              
          s.issuedescription,
          s.issueremark
        ]);
      });
    }

    table.rows.add(this.data);
    table.draw();
  }

	getIssueType(itype: number) {
		let it: string = '';

		switch(itype) {
		case 1:
			it = 'ติดต่อสอบถาม';
			break;
		case 2:
			it = 'โอนสาย';
			break;
		case 3:
			it = 'แจ้งเสีย';
			break;
		}

		return it;
	}

  getToday() {
    let today = new Date()
    return today;
  }
}
