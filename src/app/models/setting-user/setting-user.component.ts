import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginInfo, User } from '../../interfaces';
import { UserService } from '../../services/user.service';
import { Md5 } from 'md5-typescript';

declare interface DataTable {
    headerRow: string[];
    footerRow: string[];
    dataRows: string[][];
}

declare let $:any;

@Component({
  selector: 'app-setting-user',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './setting-user.component.html',
  styleUrl: './setting-user.component.css'
})
export class SettingUserComponent implements AfterViewInit {
  public dataTable!: DataTable;
	public data!: string[][];
  public users: User[]=[];
  public user: User=<User>{};
  public password1: string=''; 
  public password2: string='';
  public isChangePassword: boolean=false;
  public token: string='';

  constructor(private readonly _userServ: UserService) {
    this.dataTable = {
      headerRow: ['User Name', 'Full Name', 'Position', 'Role', 'Status' ],
      footerRow: ['User Name', 'Full Name', 'Position', 'Role', 'Status' ],
      dataRows: [],
    };

    this.data=[];

    var storage = localStorage.getItem('info')
    if(storage) {
      var info: LoginInfo = JSON.parse(storage);
      this.token = info.token;
    }
  }

  ngAfterViewInit(): void {
    this.initTable();
  }

  initTable() {
    let self = this;

    let table = $('#user-table').DataTable({
      dom: 'Bfrtip',
      buttons: [
        {
            text: 'New User',
            action: function ( e: any, dt: any, node: any, config: any ) {
              self.user=<User>{};
              self.user.id=0;
              self.isChangePassword = false;
              $('#user-modal').modal('show');
            }
        },
        'copy', 'csv', 'excel', 'print'],
      columnDefs: [
//        { 
//          target: 0,
//          width: '2em',
//          render: function(data: any, type: any, full: any, meta: any) {
//            return data; 
//          }
//        },
        { target: [0, -1, -2], width: '10em', className: 'text-center' },
        { target: [2], width: '16em', className: 'text-center' },
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
      //let $tr = $(this).closest('tr');
      $(this).css('cursor', 'pointer');
      $(this).css('font-weight', 'bold');
    });

    table.on('mouseout', 'tr', function(this: any) {
      //let $tr = $(this).closest('tr');
      $(this).css('font-weight', 'normal');
    });

    table.on('click', 'td', function(this: any) {
      let $tr = $(this).closest('tr');
      self.user = self.users[table.row($tr).index()];
      self.isChangePassword = false;
      $('#user-modal').modal('show');
    });

    self.search();
  }

  search() {
    this._userServ.findall(this.token).subscribe({
      next: rs => {
        this.users = rs;
        this.refreshTable();
      }
    });
  }

  refreshTable() {
    let table = $('#user-table').DataTable();
    table.clear();
    this.data = [];

    if(this.users) {
      this.users.forEach(s => {
        this.data.push([
          s.name,
          s.firstname + ' ' + s.lastname,
          s.position,
          this.getRoleName(s.role),
          this.getStatusName(s.status)
        ]);
      });
    }

    table.rows.add(this.data);
    table.draw();
  }

  getRoleName(role: number): string {
    switch(role) {
      case 1:
        return "ผู้รับเรื่อง";

      case 2:
        return "ช่าง";

      case 3:
        return "หัวหน้าฝ่าย";

      case 4:
        return "เจ้าหน้าที่สลับสาย";
    }

    return "";
  }

  getStatusName(status: number): string {
    switch(status) {
      case 0:
        return "ยกเลิกการใช้งาน"

      case 1:
        return "ใช้งานปกติ"
    }

    return ""
  }

  insert() {
    this.isChangePassword = false;
    $('#user-modal').modal('show');
  }

  save() {
    if(this.user.status == 0) {
      if(confirm("ต้องการยกเลิกการยกเลิกผู้ใช้งาน ?")) {
        this._userServ.save(this.token, this.user).subscribe(rs => {
          this.search();
          $('#user-modal').modal('hide');
        });
      }

    } else {
      this._userServ.save(this.token, this.user).subscribe(rs => {
        this.search();
        $('#user-modal').modal('hide');
      });
    }
  }

  changePassword() {
    this.isChangePassword = true;
  }

  submitPassword() {
    this.user.password = Md5.init(this.password1);
    this._userServ.changepassword(this.token, this.user).subscribe(rs => {
      $('#user-modal').modal('hide');
    });
  }

  close() {
    $('#user-modal').modal('hide');
  }
}
