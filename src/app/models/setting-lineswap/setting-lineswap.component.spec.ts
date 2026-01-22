import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingLineswapComponent } from './setting-lineswap.component';

describe('SettingLineswapComponent', () => {
  let component: SettingLineswapComponent;
  let fixture: ComponentFixture<SettingLineswapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingLineswapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingLineswapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
