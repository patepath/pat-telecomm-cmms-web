import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingPhoneComponent } from './setting-phone.component';

describe('SettingPhoneComponent', () => {
  let component: SettingPhoneComponent;
  let fixture: ComponentFixture<SettingPhoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingPhoneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingPhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
