import { Component } from '@angular/core';
import { LoginInfo, Operator } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OperatorService } from '../../services/operator.service';

declare interface DataTable {
    headerRow: string[];
    footerRow: string[];
    dataRows: string[][];
}

declare let $:any;

@Component({
  selector: 'app-setting-lineswap',
  standalone: true,
  imports: [ CommonModule, FormsModule],
  templateUrl: './setting-lineswap.component.html',
  styleUrl: './setting-lineswap.component.css'
})
export class SettingLineswapComponent {
  public dataTable!: DataTable;
	public data!: string[][];
  public operators: Operator[]=[];
  public operator: Operator=<Operator>{};

  public info: LoginInfo=<LoginInfo>{};

  constructor(private readonly _operatorServ: OperatorService) {
    this.dataTable = {
      headerRow: ['หมายเลข', 'หมายเลขข้างเคียง', 'ชื่อบุคคล', 'ตำแหน่ง', 'แผนก', 'กอง', 'ฝ่าย' ],
      footerRow: ['หมายเลข', 'หมายเลขข้างเคียง', 'ชื่อบุคคล', 'ตำแหน่ง', 'แผนก', 'กอง', 'ฝ่าย' ],
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

    let table = $('#operator-table').DataTable({
      dom: 'Bfrtip',
      buttons: [
        {
            text: 'New Phone',
            action: function ( e: any, dt: any, node: any, config: any ) {
              self.operator=<Operator>{};
              self.operator.id=0;
              $('#operatorModal').modal('show');
            }
        },
        'copy', 'csv', 'excel', 'print'],
      columnDefs: [
        { target: [0, 1], width: '10em', className: 'text-center' },
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
  }

  refreshTable() {
    let table = $('#operator-table').DataTable();
    table.clear();
    this.data = [];

    if(this.operators.length>0) {
      this.operators.forEach(s => {
        this.data.push([
          s.phonenumber,
          s.nearbynumber,
          s.staffname,
          s.position,
          s.organization,
          s.division,
          s.department,
        ])
      });
    }

    table.rows.add(this.data);
    table.draw()
  }

  edit(inx: number) {
    this.operator = this.operators[inx];
    $('#operatorModal').modal('show');
  }

  search() {
    this._operatorServ.findall().subscribe(rs => {
      this.operators=rs;
      this.refreshTable();
    });
  }

  save() {
    this._operatorServ.save(this.info.token, this.operator).subscribe(rs => {
      this.search();
      $('#operatorModal').modal('hide');
    });
  }
}
