import { Component, AfterViewInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { LoginInfo } from '../../interfaces';

@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [
    RouterOutlet, 
    RouterModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './default-layout.component.html',
  styleUrl: './default-layout.component.css'
})
export class DefaultLayoutComponent implements AfterViewInit{

  public loc?: String;
  public info: LoginInfo=<LoginInfo>{}

  constructor(private readonly _router: Router) {
    this.loc = document.location.pathname.split('/').pop();

    let storage = localStorage.getItem('info');
    if(storage) {
      this.info = JSON.parse(storage);
    }
  }

  ngAfterViewInit(): void {
    let navs = document.getElementsByClassName('nav-link');

    for(let i=0; i<navs.length; i++) {
      navs[i].addEventListener('click', function() {
        for(let i=0; i<navs.length; i++) {
          navs[i].classList.remove('active');
        }

        navs[i].classList.add('active');
      })
    }
  }

  signout() {
    localStorage.clear();
    this._router.navigate(['/login'])
  }
}
