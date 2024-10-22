import { Component, AfterViewInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { LoginInfo } from '../../interfaces';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements AfterViewInit {
  public name: string='';
  public password: string='';
  public isInvalid: boolean=false;

  constructor(
    private readonly router: Router,
    private readonly loginServ: LoginService
  ) {

  }

  ngAfterViewInit(): void {
    var info: LoginInfo;
    var storage = localStorage.getItem('info');

    if(storage) {
      info = JSON.parse(storage);
        this.loginServ.chektoken(info.token).subscribe({ 
          next: rs => {
            this.gotopage(rs);
          },
          error: err => {
            localStorage.removeItem('info');
          }
      })
    }
  }

  gotopage(info: LoginInfo) {
    switch(info.role) {
      case 1:
        this.router.navigate(['/admin/new-issue']);
        break;

      case 2:
        this.router.navigate(['/tech/new-issue']);
        break;
    }
  }

  login() {
    this.loginServ.login(this.name, this.password).subscribe({
      next: info => {
        localStorage.setItem('info', JSON.stringify(info));
        this.gotopage(info);
      },
      error: err => {
        localStorage.clear();
        this.isInvalid = true;
      }
    });
  }
}
