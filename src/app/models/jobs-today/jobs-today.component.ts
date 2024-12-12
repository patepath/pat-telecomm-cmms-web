import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTable, Issue } from '../../interfaces';
import { JobsTodayService } from '../../services/jobs-today.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

declare let $:any;

@Component({
  selector: 'app-jobs-today',
  standalone: true,
  imports: [ CommonModule,FormsModule ],
  templateUrl: './jobs-today.component.html',
  styleUrl: './jobs-today.component.css'
})
export class JobsTodayComponent implements AfterViewInit {
  public dataTable!: DataTable;
	public data!: string[][];
  public issue: Issue=<Issue>{}
  public issues: Issue[]=[];
  public token: string='';
  
  public frmDate: string;

  constructor(
    private readonly _rptServ: JobsTodayService, 
    private readonly _router: Router) {
      this.dataTable = {
        headerRow: ['ที่', 'วันที่รับเรื่อง', 'เวลา', 'เลขที่รับเรื่อง', 'เลขหมาย', 'สถานที่', 'เหตุเสีย', 'เคเบิ้ล', 'หมายเลขติดต่อกลับ', 'สถานะ' ],
        footerRow: ['ที่', 'วันที่รับเรื่อง', 'เวลา', 'เลขที่รับเรื่อง', 'เลขหมาย', 'สถานที่', 'เหตุเสีย', 'เคเบิ้ล', 'หมายเลขติดต่อกลับ', 'สถานะ' ],
        dataRows: [],
      };

      this.data=[];

      let storage = localStorage.getItem('info');
      if(storage) {
        let info = JSON.parse(storage);
        this.token = info.token;
      }

      let today = new Date();
      this.frmDate = today.toISOString().split('T')[0];
  }

  ngAfterViewInit(): void {
    this.initTable();
  }

  initTable() {
    let self = this;

    let table = $('#jobs-today-table').DataTable({
      dom: 'Bfrtip',
      buttons: ['copy', 'csv', 'excel', {
        extend: 'print',
        title: '',
        messageTop:     function() {
                          return `
                          <div>เรียน อกบช./ชกบช.(งานไฟฟ้า)/หบฟ./ชบฟ.(ชศ.)</div>
                          <div>เรื่อง แจ้งผลการรับแจ้งและผลการตรวจแก้โทรศัพท์หมายเลขที่ขัดข้อง<div>
                          <div style="margin-top: 1em; margin-left: 4em">การรับแจ้งโทรศัพท์ขัดข้อง ประจำวันที่ ${self.getToday().getDate()}/${self.getToday().getMonth() + 1}/${self.getToday().getFullYear()+543} ดังนี้</div>
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
        { targets: [0], width: '3rem', className: 'text-center' },
        { targets: [1,2,3,4], width: '8rem', className: 'text-center' },
        { targets: [5], width: '18rem' },
        { targets: [-1,-2,-3], width: '10rem', className: 'text-center' },
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
          s.created.toString().split('T')[1].split('+')[0],
          s.issueno,
          s.phone.number,
          s.phone.location,
          s.issuedescription,
          s.phone.hc,
          s.issuecontactno,
          this.getStatus(s.status)
        ]);
      });
    }

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
  search() {
    this._rptServ.findall(this.token, this.frmDate).subscribe(rs => {
      this.issues = rs;
      this.refreshTable();
    });
  }

  getToday() {
    let today = new Date(this.frmDate);
    return today;
  }
}

