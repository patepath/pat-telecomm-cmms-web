import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingUserComponent } from './setting-user.component';

describe('SettingUserComponent', () => {
  let component: SettingUserComponent;
  let fixture: ComponentFixture<SettingUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
