import { AfterViewInit, Component } from '@angular/core';
import { DataTable, Issue } from '../../interfaces';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LineswapDailyService } from '../../services/lineswap-daily.service';

declare let $:any;

@Component({
  selector: 'app-lineswap-daily',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lineswap-daily.component.html',
  styleUrl: './lineswap-daily.component.css'
})
export class LineswapDailyComponent implements AfterViewInit {
  public dataTable!: DataTable;
	public data!: string[][];
  public issue: Issue=<Issue>{}
  public issues: Issue[]=[];
  public token: string='';
  public filteredCount: number = 0;
  public date: string;

  constructor(
    private readonly _jobsServ: LineswapDailyService,
    private readonly _router: Router) {
      this.dataTable = {
        headerRow: ['ลำดับ', 'วันที่รับเรื่อง', 'เวลา', 'เลขที่รับเรื่อง', 'เลขหมาย', 'ประเภทงาน', 'รายละเอียดงาน' ],
        footerRow: ['ลำดับ', 'วันที่รับเรื่อง', 'เวลา', 'เลขที่รับเรื่อง', 'เลขหมาย', 'ประเภทงาน', 'รายละเอียดงาน' ],
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
  }

  ngAfterViewInit(): void {
    this.initTable();
  }

  private initTable(): void {
    let self = this;

    let table = $('#jobs-daily-table').DataTable({
      dom: 'Bfrtip',
      buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
      columnDefs: [
        { targets: [0], width: '3rem', className: 'text-center' },
        { targets: [1,2,3,4], width: '8rem', className: 'text-center' },
        { targets: [5], width: '16rem', className: 'text-center' },
      ],
      responsive: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search records",
      },
      ordering:  false,
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
      //self._router.navigate(['operator/edit-lineswapissue', self.issues[table.row(this).index()].id]);
      window.open('/operator/edit-lineswapissue/' + self.issue.id, '_blank');
    });

    table.on('search.dt', function() {
      self.filteredCount = table.rows({ search: 'applied' }).count();
    });

    self.search();
  }

  search(): void {
    this._jobsServ.finddaily(this.token, this.date).subscribe({
      next: (res) => {
        this.issues = res;
        this.data = res.map(issue => [
          (res.indexOf(issue) +1).toString(),
          new Date(issue.created).toLocaleDateString('th-TH', { year: 'numeric', month: '2-digit', day: '2-digit' }),
          new Date(issue.created).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
          issue.issueno,
          issue.phone.number,
          //issue.issuetype === 0 ? issue.issuetypeother : this.getIssueTypeText(issue.issuetype),
          this.getIssueTypeText(issue.issuetype),
          issue.issuedescription + ''
        ]);
        $('#jobs-daily-table').DataTable().clear().rows.add(this.data).draw();
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
