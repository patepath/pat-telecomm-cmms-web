import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingOperatorComponent } from './setting-operator.component';

describe('SettingOperatorComponent', () => {
  let component: SettingOperatorComponent;
  let fixture: ComponentFixture<SettingOperatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingOperatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingOperatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
