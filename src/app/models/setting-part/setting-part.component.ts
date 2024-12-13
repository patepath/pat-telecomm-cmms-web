import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginInfo, Part, PartProfile } from '../../interfaces';
import { PartService } from '../../services/part.service';

declare interface DataTable {
    headerRow: string[];
    footerRow: string[];
    dataRows: string[][];
}

declare let $:any;

@Component({
  selector: 'app-setting-part',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './setting-part.component.html',
  styleUrl: './setting-part.component.css'
})
export class SettingPartComponent implements AfterViewInit {
  public dataTable!: DataTable;
	public data!: string[][];
  public partprofiles: PartProfile[]=[];
  public partprofile: PartProfile=<PartProfile>{};
  public token: string='';

  constructor(private readonly _partServ: PartService) {
    this.dataTable = {
      headerRow: ['รหัส', 'ชื่ออะไหล่', 'หน่วย'],
      footerRow: ['รหัส', 'ชื่ออะไหล่', 'หน่วย'],
      dataRows: [],
    };

    this.data = [];

    let storage = localStorage.getItem('info');
    if(storage) {
      let info: LoginInfo = JSON.parse(storage);
      this.token = info.token;
    }
  }

  ngAfterViewInit(): void {
    this.initTable();
    this.search();
  }

  initTable() {
    let self = this;

    let table = $('#partprofile-table').DataTable({
      dom: 'Bfrtip',
      buttons: [
        {
            text: 'New Part',
            action: function ( e: any, dt: any, node: any, config: any ) {
              self.partprofile=<PartProfile>{};
              self.partprofile.id=0;
              $('#partModal').modal('show');
            }
        },
        'copy', 'csv', 'excel', {
        extend: 'print',
        title: '',
      }],
      columnDefs: [
        { targets: [0, -1], width: '10em', className: 'text-center' },
      ],
      responsive: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search records",
      },
      ordering: false,
      paging: true,
      pageLength: 10,
      pagingType: "full_numbers",
    });

    table.on('mouseover', 'tr', function(this: any) {
      //let $tr = $(this).closest('tr');
      $(this).css('cursor', 'pointer');
      $(this).css('font-weight', 'bold');
      $(this).css('cursor', 'pointer');
    });

    table.on('mouseout', 'tr', function(this: any) {
      //let $tr = $(this).closest('tr');
      $(this).css('font-weight', 'normal');
      $(this).css('cursor', 'normal');
    });

    table.on('click', 'td', function(this: any) {
      let $tr = $(this).closest('tr');
      var data = table.row($tr).data();
      //self.router.navigate(['admin/close-issue', self.reports[table.row(this).index()].id]);
      self.edit(table.row(this).index());
    });
  }

  refreshTable() {
    let table = $('#partprofile-table').DataTable();
    table.clear();
    this.data=[];

    this.partprofiles.forEach(s => {
      this.data.push([
        s.code,
        s.name,
        s.unit
      ]);
    });

    table.rows.add(this.data);
    table.draw();
  }

  search() {
    this._partServ.findallpartprofile().subscribe(rs => {
      if(rs) {
        this.partprofiles=rs;
      } else {
        this.partprofiles=[];
      }

      this.refreshTable();
    });
  }

  edit(inx: number) {
    this.partprofile = this.partprofiles[inx];
    $('#partModal').modal('show');
  }

  save() {
    this._partServ.savepartprofile(this.token, this.partprofile).subscribe(rs => {
      this.search();
      $('#partModal').modal('hide');
    });
  }
}
