import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { Profile } from '../../interfaces';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  public profile: Profile=<Profile>{};

  constructor(private _profileServ: ProfileService) {
    this._profileServ.get().subscribe(s => {
      this.profile=s;
    });
  }

  ngOnInit(): void {
  }

  save() {
    this._profileServ.save(this.profile).subscribe(s => {
    });
  }
}

