import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTable, Issue } from '../../interfaces';
import { IssueService } from '../../services/issue.service';

declare let $:any;

@Component({
  selector: 'app-report-by-summary',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './report-by-summary.component.html',
  styleUrl: './report-by-summary.component.css'
})
export class ReportBySummaryComponent {
  public dataTable!: DataTable;
	public data!: string[][];

  public rpt: ReportSummaryByDate=<ReportSummaryByDate>{}
  public rpts: ReportSummaryByDate[]=[];
  public token: string='';

  public frmDate: string;
  public toDate: string;

  constructor(private _issueSrv: IssueService) {
      let storage = localStorage.getItem('info');

      if(storage) {
        let info = JSON.parse(storage);
        this.token = info.token;
      }

      this.dataTable = {
        headerRow: ['ลำดับ', 'ประเภทงาน', 'ดำเนินการ', 'ปิดงาน', 'ยกเลิก' ],
        footerRow: ['ลำดับ', 'ประเภทงาน', 'ดำเนินการ', 'ปิดงาน', 'ยกเลิก' ],
        dataRows: [],
      };

      this.data=[];

      var frmdate = new Date();
      frmdate.setMonth(frmdate.getMonth()-1);
      frmdate.setDate(1);
      this.frmDate = frmdate.toISOString().split('T')[0]; 

      this.toDate = new Date().toISOString().split('T')[0];
  }

  ngAfterViewInit(): void {
    this.initTable();
    this.searchbydate();
  }

  initTable() {
    $('#report-by-summary-table').DataTable({
      dom: 'Bfrtip',
      buttons: ['copy', 'csv', 'excel', 'print'],
      columnDefs: [
        { targets: [0], width: '5rem', className: 'text-center' },
        { targets: [-1,-2,-3], width: '10rem', className: 'text-center' },
      ],
      responsive: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search records",
      },
      ordering:  false,
      paging: false,
      pageLength: 15,
      pagingType: "full_numbers",
    });
  }

  refreshTable() {
    let table = $('#report-by-summary-table').DataTable();
    table.clear();
    this.data = []

    this.rpts.forEach((s, i) => {  
      this.data.push([
        String(i+1),
        this.getIssueType(s.issue_type),
        String(s.proceeding),
        String(s.closed),
        String(s.cancelled),
      ]);
    });

    table.rows.add(this.data);
    table.rows().invalidate().draw(false);
  }

  getIssueType(issue_type: string): string {
    var v: string='';

    if(!issue_type || issue_type.trim() === '' || issue_type === '11') {
      issue_type = '0';
    }

    switch(issue_type) {
      case '0': v = 'ไม่ระบุ'; break;
      case '1': v = 'แจ้งเหตุเสีย'; break;
      case '2': v = 'ติดตั้งเลขหมายใหม่'; break;
      case '3': v = 'ติดตั้งเครื่องพ่วง'; break;
      case '4': v = 'ปรับปรุงสาย'; break;
      case '5': v = 'ย้าย'; break;
      case '6': v = 'เปลี่ยนเครื่อง'; break;
      case '99': v = 'อื่นๆ'; break;
      default: v = issue_type;
    } 

    return v;
  }

  getStatus(status: number): string {
    switch(status) {
      case 0:
        return 'ยกเลิก'

      case 1:
        return 'ดำเนินการ'

      case 2:
        return 'ดำเนินการ'

      case 3:
        return 'ปิดงาน'
    }

    return 'N/A'
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
    this._issueSrv.summaryByDate(this.token, this.frmDate, this.toDate).subscribe(s => {
      this.rpts = s;      
      this.refreshTable();
    }); 
  }
}

declare interface ReportSummaryByDate {
  issue_type: string;
  proceeding: number;
  waitforclosed: number;
  closed: number;
  cancelled: number;
}