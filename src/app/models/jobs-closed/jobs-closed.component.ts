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
  public info: LoginInfo=<LoginInfo>{}

  constructor(
    private readonly _rptServ: JobsCompletedService,
    private readonly _router: Router) {
    this.dataTable = {
      headerRow: ['ที่', 'วันที่รับเรื่อง', 'เลขที่รับเรื่อง', 'เลขหมาย', 'สถานที่', 'เหตุเสีย', 'เคเบิ้ล', 'หมายเลขติดต่อกลับ' ],
      footerRow: ['ที่', 'วันที่รับเรื่อง', 'เลขที่รับเรื่อง', 'เลขหมาย', 'สถานที่', 'เหตุเสีย', 'เคเบิ้ล', 'หมายเลขติดต่อกลับ' ],
      dataRows: [],
    };

    this.data=[];

    this.start.setMonth(this.today.getMonth() - 3);
    this.frmDate = this.start.toISOString().split('T')[0];
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
                          <div>เรียน หบค./ชบค.</div>
                          <div>เรื่อง แจ้งผลการรับแจ้งและผลการตรวจซ่อมที่แล้วเสร็จ<div>
                          <div style="margin-top: 1em; margin-left: 4em">ประจำวันที่ ${self.getToday().getDate()}/${self.getToday().getMonth() + 1}/${self.getToday().getFullYear()+543} ดังนี้</div>
                          <p>
                          `
                        },
        messageBottom:  function() {
                          return `
                          <div style="margin-top: 4em; text-align: center">
                            <div>จึงเรียนมาเพื่อโปรดทราบ</div>
                            <div style="margin-top: 3em">(.........................................)</div>
                            <div>ช่างเทคนิค 4</div>
                            <div>.........../.........../...........</div>
                          </div>`
                        }
      }],
      columnDefs: [
        { targets: [0], width: '3em', className: 'text-center' },
        { targets: [1], width: '8em', className: 'text-center' },
        { targets: [2], width: '10em', className: 'text-center' },
        { targets: [3, 5, -1], width: '12em', className: 'text-center' },
      ],
      responsive: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search records",
      },
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

    self.searchbydate();
  }

  refreshTable() {
    let table = $('#jobs-completed-table').DataTable();
    table.clear();
    this.data = []

    let phone: string;

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
    this._rptServ.findall(this.info.token).subscribe(rs => {
      this.issues = rs;
      this.refreshTable();
    });  
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
