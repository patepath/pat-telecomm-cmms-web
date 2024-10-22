import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-prn-newissue',
  standalone: true,
  imports: [],
  templateUrl: './prn-newissue.component.html',
  styleUrl: './prn-newissue.component.css'
})
export class PrnNewissueComponent implements OnInit {
  public no: string='';
  public location: string='';
  public type: string='';
  public other: string='';

  public x: string='10';
  public y: string='10';

  constructor() {
  }

  ngOnInit(): void {
    var url =  new URL(window.location.href);

    let no = url.searchParams.get("no");
    if(no != null) {
      this.no = no;
    }

    let location = url.searchParams.get('location'); 
    if(location != null){
      this.location = location;
    }

    let type = url.searchParams.get('type'); 
    if(type != null){
      this.type = type;
    } else {
      this.type = '1';
    }

    let other = url.searchParams.get('other'); 
    if(other != null){
      this.other = other;
    }

    switch(type) {
      case '1':
        this.x = '5.8';
        this.y = '3.8';
        break;

      case '2':
        this.x = '8.3';
        this.y = '3.8';
        break
      
      case '3':
        this.x = '12.01';
        this.y = '3.8';
        break

      case '4':
        this.x = '5.8';
        this.y = '4.85';
        break;

      case '5':
        this.x = '8.3';
        this.y = '4.85';
        break;

      case '6':
        this.x = '12.01';
        this.y = '4.85';
        break;

      case '99':
        this.x = '14.53';
        this.y = '4.85';
        break;
    }

    this.initPrint();
  }

  initPrint() {
    setTimeout(() => {
      window.onafterprint = () => {window.close()};
      window.print();
    }, 250)
  }
}
