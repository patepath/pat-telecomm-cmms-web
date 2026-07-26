import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineswapReportDailyComponent } from './lineswap-report-daily.component';

describe('LineswapReportDailyComponent', () => {
  let component: LineswapReportDailyComponent;
  let fixture: ComponentFixture<LineswapReportDailyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineswapReportDailyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineswapReportDailyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
