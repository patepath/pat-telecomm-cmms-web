import { Component } from '@angular/core';
import { DataTable, Issue, IssueInquiry, IssueType, LineswapIssue } from '../../interfaces';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LineswapService } from '../../services/lineswap.service';
import { LineswapReportService } from '../../services/lineswap-report.service';

declare let $:any;

@Component({
  selector: 'app-lineswap-all-issue',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './lineswap-all-issue.component.html',
  styleUrl: './lineswap-all-issue.component.css'
})
export class LineswapAllIssueComponent {
  public dataTable!: DataTable;
	public data!: string[][];
  public issue: LineswapIssue=<LineswapIssue>{}
  public issues: LineswapIssue[]=[];

  public token: string='';
  public filteredCount: number = 0;
  public date: string;

  public frmDate: string;
  public toDate: string;

	public issueTypes: IssueType[]=[];
	public issueInquiries: IssueInquiry[]=[];

  constructor(
    private readonly _lineswpServ: LineswapService,
    private readonly _serv: LineswapReportService,
  ) {
      this.dataTable = {
        headerRow: ['ลำดับ', 'วันที่รับเรื่อง', 'เวลา', 'เลขที่รับเรื่อง', 'สายโทรเข้า', 'เลขหมาย', 'สถานที่', 'ประเภทงาน', 'รายละเอียดงาน' ],
        footerRow: ['ลำดับ', 'วันที่รับเรื่อง', 'เวลา', 'เลขที่รับเรื่อง', 'สายโทรเข้า', 'เลขหมาย', 'สถานที่', 'ประเภทงาน', 'รายละเอียดงาน' ],
        dataRows: [],
      };

      this.data=[];

      let storage = localStorage.getItem('info');
      if(storage) {
        let info = JSON.parse(storage);
        this.token = info.token;
      }

      let today = new Date();
      this.date = today.toISOString().split('T')[0];

      var frmdate = new Date();
      frmdate.setMonth(frmdate.getMonth()-1);
      frmdate.setDate(1);
      this.frmDate = frmdate.toISOString().split('T')[0]; 
      this.toDate = new Date().toISOString().split('T')[0];

      this._lineswpServ.getIssueTypesLineSwap().subscribe(rs => {
        this.issueTypes = rs;
      });

      this._lineswpServ.getIssueInquiry().subscribe(rs => {
        this.issueInquiries = rs;
      });
  }

  ngAfterViewInit(): void {
    this.initTable();
  }

  private initTable(): void {
    let self = this;

    let table = $('#jobs-all-issue-table').DataTable({
      dom: 'Bfrtip',
      buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
      columnDefs: [
        { targets: [0], width: '3rem', className: 'text-center' },
        { targets: [1,2,3,4], width: '8rem', className: 'text-center' },
        { targets: [5], width: '16rem', className: 'text-center' },
      ]
    });

    table.on('search.dt', function() {
      self.filteredCount = table.rows({ search: 'applied' }).count();
    });

    self.searchbydate();
  }

  search(): void {
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
    this._serv.reportbyperiod(this.token, this.frmDate, this.toDate).subscribe({
      next: (res) => {
        this.data = res.map((issue) => [
          (res.indexOf(issue) +1).toString(),
          new Date(issue.created).toLocaleDateString('th-TH', { year: 'numeric', month: '2-digit', day: '2-digit' }),
          new Date(issue.created).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
          issue.issueno,
          issue.linetype === 1 ? 'สายใน' : issue.linetype === 2 ? 'สายนอก' : '',
          issue.phone.number,
          issue.phone.location,
          issue.issuetype == 0 ? '-' : this.issueTypes[issue.issuetype]?.name,
          issue.issuedescription + ''
        ]);
        $('#jobs-all-issue-table').DataTable().clear().rows.add(this.data).draw();
      }
    });
  }
}
