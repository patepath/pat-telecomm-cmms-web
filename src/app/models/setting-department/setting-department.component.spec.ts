import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingDepartmentComponent } from './setting-department.component';

describe('SettingDepartmentComponent', () => {
  let component: SettingDepartmentComponent;
  let fixture: ComponentFixture<SettingDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingDepartmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
