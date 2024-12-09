import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTable, Issue } from '../../interfaces';
import { JobsTodayService } from '../../services/jobs-today.service';
import { Router } from '@angular/router';

declare let $:any;

@Component({
  selector: 'app-jobs-today',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './jobs-today.component.html',
  styleUrl: './jobs-today.component.css'
})
export class JobsTodayComponent implements AfterViewInit {
  public dataTable!: DataTable;
	public data!: string[][];
  public issue: Issue=<Issue>{}
  public issues: Issue[]=[];
  public token: string='';
  
  constructor(
    private readonly _rptServ: JobsTodayService, 
    private readonly _router: Router) {
      this.dataTable = {
        headerRow: ['ที่', 'วันที่รับเรื่อง', 'เลขที่รับเรื่อง', 'เลขหมาย', 'สถานที่', 'เหตุเสีย', 'เคเบิ้ล', 'หมายเลขติดต่อกลับ' ],
        footerRow: ['ที่', 'วันที่รับเรื่อง', 'เลขที่รับเรื่อง', 'เลขหมาย', 'สถานที่', 'เหตุเสีย', 'เคเบิ้ล', 'หมายเลขติดต่อกลับ' ],
        dataRows: [],
      };

      this.data=[];

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

    let table = $('#jobs-today-table').DataTable({
      dom: 'Bfrtip',
      buttons: ['copy', 'csv', 'excel', 'print'],
      columnDefs: [
        { targets: [0], width: '3rem', className: 'text-center' },
        { targets: [1,2,3], width: '8rem', className: 'text-center' },
        { targets: [4], width: '18rem' },
        { targets: [-1,-2], width: '10rem', className: 'text-center' },
      ],
      responsive: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search records",
      },
      ordering:  false,
      paging: true,
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
      self.issue = self.issues[table.row($tr).index()];
      self._router.navigate(['admin/edit-issue', self.issues[table.row(this).index()].id]);
    });

    self.search();
  }

  refreshTable() {
    let table = $('#jobs-today-table').DataTable();
    table.clear();
    this.data = []

    if(this.issues) {
      this.issues.forEach((s,i) => {
        this.data.push([
          String(i+1),
          s.created.toString().split('T')[0],
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

  search() {
    this._rptServ.findall(this.token).subscribe(rs => {
      this.issues = rs;
      this.refreshTable();
    });
  }
}

