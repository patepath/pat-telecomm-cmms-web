import { Component } from '@angular/core';
import { DataTable, Issue, IssueInquiry, IssueType, LineswapReport } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LineswapReportService } from '../../services/lineswap-report.service';
import { LineswapService } from '../../services/lineswap.service';

declare let $:any;

@Component({
  selector: 'app-lineswap-report-daily',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lineswap-report-daily.component.html',
  styleUrl: './lineswap-report-daily.component.css'
})
export class LineswapReportDailyComponent {
  public dataTable1!: DataTable;
	public data1!: string[][];

  public dataTable2!: DataTable;
	public data2!: string[][];

  public dataTable3!: DataTable;
	public data3!: string[][];

  public issue: Issue=<Issue>{}
  public issues: Issue[]=[];

  public rpt1s: LineswapReport[]=[];
  public rpt1: LineswapReport =<LineswapReport>{};
  public rpt2s: LineswapReport[]=[];
  public rpt2: LineswapReport =<LineswapReport>{};

  public token: string='';
  public filteredCount: number = 0;
  public date: string;

	public issueTypes: IssueType[]=[];
	public issueInquiries: IssueInquiry[]=[];

  constructor(
    protected readonly _lineswpServ: LineswapService,
    private readonly _rptserv: LineswapReportService,) {
      this.dataTable1 = {
        headerRow: ['ลำดับ', 'ประเภทงาน', 'จำนวน' ],
        footerRow: ['ลำดับ', 'ประเภทงาน', 'จำนวน' ],
        dataRows: [],
      };

      this.data1=[];

      this.dataTable2 = {
        headerRow: ['ลำดับ', 'ประเภทงาน', 'รายการย่อย', 'จำนวน' ],
        footerRow: ['ลำดับ', 'ประเภทงาน', 'รายการย่อย', 'จำนวน' ],
        dataRows: [],
      };

      this.data2=[];

      this.dataTable3 = {
        headerRow: ['ลำดับ', 'ประเภทงาน', 'รายการย่อย', 'จำนวน' ],
        footerRow: ['ลำดับ', 'ประเภทงาน', 'รายการย่อย', 'จำนวน' ],
        dataRows: [],
      };

      this.data3=[];

      let storage = localStorage.getItem('info');
      if(storage) {
        let info = JSON.parse(storage);
        this.token = info.token;
      }

      let today = new Date();
      this.date = today.toISOString().split('T')[0];

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

    $('#jobs-daily-all-table').DataTable({
      dom: 'r',
      columnDefs: [
        { targets: [0], width: '6rem', className: 'text-center' },
        { targets: [-1], width: '12rem', className: 'text-center' },
      ],
      responsive: true,
      ordering:  false,
      paging: false,
    });

    $('#jobs-daily-internal-table').DataTable({
      dom: 'r',
      columnDefs: [
        { targets: [0], width: '6rem', className: 'text-center' },
        { targets: [-1], width: '12rem', className: 'text-center' },
      ],
      responsive: true,
      ordering:  false,
      paging: false,
    });

    $('#jobs-daily-external-table').DataTable({
      dom: 'r',
      columnDefs: [
        { targets: [0], width: '6rem', className: 'text-center' },
        { targets: [-1], width: '12rem', className: 'text-center' },
      ],
      responsive: true,
      ordering:  false,
      paging: false,
    });

    self.search();
  }

  search(): void {
    this._rptserv.reportdailyall(this.token, this.date).subscribe({
      next: (res) => {
        this.data1 = res.map(rpt => [
          (res.indexOf(rpt) +1).toString(),
          rpt.type == 1 ? 'สายใน' : rpt.type == 2 ? 'สายนอก': 'ไม่ระบุ',
          rpt.total.toString()
        ]);
        $('#jobs-daily-all-table').DataTable().clear().rows.add(this.data1).draw();
      }
    });

    this._rptserv.reportdaily(this.token, this.date, 1).subscribe({
      next: (res) => {
        this.data2 = res.map(rpt => [
          (res.indexOf(rpt) +1).toString(),
          this.issueTypes[rpt.type].value == 0 ? '-' : this.issueTypes[rpt.type].name,
          this.issueInquiries[rpt.subtype]?.value == 0 ? '-' : this.issueInquiries[rpt.subtype]?.name || 'ไม่ระบุ',
          rpt.total.toString()
        ]);
        $('#jobs-daily-internal-table').DataTable().clear().rows.add(this.data2).draw();
      }
    });

    this._rptserv.reportdaily(this.token, this.date, 2).subscribe({
      next: (res) => {
        this.data3 = res.map(rpt => [
          (res.indexOf(rpt) +1).toString(),
          this.issueTypes[rpt.type].name,
          this.issueInquiries[rpt.subtype].value == 0 ? '-' : this.issueInquiries[rpt.subtype].name,
          rpt.total.toString()
        ]);
        $('#jobs-daily-external-table').DataTable().clear().rows.add(this.data3).draw();
      }
    });
  }

  getIssueTypeText(issuetype: number): string {
    switch(issuetype) {
      case 1: return 'ติดต่อสอบถาม';
      case 2: return 'โอนย้าย';
      case 3: return 'แจ้งเสีย';
      default: return '';
    }
  }

}
