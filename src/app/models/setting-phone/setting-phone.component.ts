import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Issue, LoginInfo, Phone } from '../../interfaces';
import { PhoneService } from '../../services/phone.service';

declare interface DataTable {
    headerRow: string[];
    footerRow: string[];
    dataRows: string[][];
}

declare let $:any;

@Component({
  selector: 'app-setting-phone',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './setting-phone.component.html',
  styleUrl: './setting-phone.component.css'
})
export class SettingPhoneComponent implements AfterViewInit {
  public dataTable!: DataTable;
	public data!: string[][];
  public phones: Phone[]=[];
  public phone: Phone=<Phone>{};
  public info: LoginInfo=<LoginInfo>{};
  public filteredCount: number = 0;

  constructor(private readonly _phoneServ: PhoneService) {
    this.dataTable = {
      headerRow: ['หมายเลข', 'สถานที่', 'ต้นทางชุมสาย', 'H', 'TC1', 'TC2', 'TC3', 'TC4', 'TC5' ],
      footerRow: ['หมายเลข', 'สถานที่', 'ต้นทางชุมสาย', 'H', 'TC1', 'TC2', 'TC3', 'TC4', 'TC5' ],
      dataRows: [],
    };

    this.data=[];

    let storage = localStorage.getItem('info');
    if(storage) {
      this.info = JSON.parse(storage);
    }
  }

  ngAfterViewInit(): void {
    this.initTable();
    this.search();
  }

  initTable() {
    let self = this;

    let table = $('#phone-table').DataTable({
      dom: 'Bfrtlp',
      buttons: [
        {
            text: 'New Phone',
            action: function ( e: any, dt: any, node: any, config: any ) {
              self.phone=<Phone>{};
              self.phone.id=0;
              $('#phoneModal').modal('show');
            }
        },
        'copy', 'csv', 'excel', 'print'],
      columnDefs: [
        { target: [0], width: '10em', className: 'text-center' },
        { target: [-1,-2,-3,-4,-5,-6,-7], width: '8em', className: 'text-center' },
      ],
      responsive: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search records",
      },
      ordering: true,
      order: [0, 'asc'],
      paging: true,
      pageLength: 10,
      pagingType: "full_numbers",
      lengthChange: true,
      lengthMenu: [5, 10, 15, 20],
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
      self.edit(table.row(this).index())
    });

    table.on('search.dt', function() {
      self.filteredCount = table.rows({ search: 'applied' }).count();
    });
  }

  refreshTable() {
    let table = $('#phone-table').DataTable();
    table.clear();
    this.data = [];

    if(this.phones) {
      this.phones.forEach(s => {
        this.data.push([
          s.location,
          s.number,
          s.hc,
          s.kc,
          s.tc1,
          s.tc2,
          s.tc3,
          s.tc4,
          s.tc5
        ])
      });
    }

    table.rows.add(this.data);
    table.rows().invalidate().draw(false);
    this.filteredCount = table.rows({ search: 'applied' }).count();
  }

  edit(inx: number) {
    this.phone = this.phones[inx];
    $('#phoneModal').modal('show');
  }

  search() {
    this._phoneServ.findall().subscribe(rs => {
      this.phones=rs;
      this.refreshTable();
    });
  }

  save() {
    this._phoneServ.save(this.info.token, this.phone).subscribe(rs => {
      this.search();
      $('#phoneModal').modal('hide');
    });
  }
}
