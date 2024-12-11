import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTable, Issue } from '../../interfaces';
import { IssueService } from '../../services/issue.service';

declare let $:any;

@Component({
  selector: 'app-report-by-status',
  standalone: true,
  imports: [CommonModule, FormsModule ],
  templateUrl: './report-by-status.component.html',
  styleUrl: './report-by-status.component.css'
})
export class ReportByStatusComponent implements AfterViewInit {
  public dataTable!: DataTable;
	public data!: string[][];

  public issue: Issue=<Issue>{}
  public issues: Issue[]=[];
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
        headerRow: ['วันที่', 'เวลา', 'เลขที่รับเรื่อง', 'เลขหมาย', 'เคเบิ้ล', 'สถานที่', 'เหตุเสีย', 'สถานะ' ],
        footerRow: ['วันที่', 'เวลา', 'เลขที่รับเรื่อง', 'เลขหมาย', 'เคเบิ้ล', 'สถานที่', 'เหตุเสีย', 'สถานะ' ],
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
  }

  initTable() {
    let self = this;

    let table = $('#report-by-status-table').DataTable({
      dom: 'Bfrtip',
      buttons: ['copy', 'csv', 'excel', 'print'],
      columnDefs: [
        { targets: [0,1], width: '6rem', className: 'text-center' },
        { targets: [0,1,2,3,4], width: '8rem', className: 'text-center' },
        { targets: [5], width: '18rem' },
        { targets: [-1], width: '10rem', className: 'text-center' },
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
      //self._router.navigate(['admin/edit-issue', self.issues[table.row(this).index()].id]);
    });
  }

  refreshTable() {
    let table = $('#report-by-status-table').DataTable();
    table.clear();
    this.data = []

    this.issues.forEach(s => {  
      var create = new Date(s.created)
      this.data.push([
        create.toLocaleDateString(),
        create.toLocaleTimeString(),
        s.issueno,
        s.phone.number,
        s.phone.hc,
        s.phone.location,
        s.issuedescription,
        //String(s.status)
        this.getStatus(s.status)
      ]);
    });

    table.rows.add(this.data);
    table.draw();
  }

  getStatus(status: number): string {
    switch(status) {
      case 0:
        return 'ดำเนินการ'

      case 1:
        return 'ปิดงาน'

      case 99:
        return 'ยกเลิก'
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
    
    this._issueSrv.findAllByDate(this.token, this.frmDate, this.toDate).subscribe(s => {
      this.issues=s;
      this.refreshTable();
    }); 
  }
}
