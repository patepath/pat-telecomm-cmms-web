import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineswapReportPeriodComponent } from './lineswap-report-period.component';

describe('LineswapReportPeriodComponent', () => {
  let component: LineswapReportPeriodComponent;
  let fixture: ComponentFixture<LineswapReportPeriodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineswapReportPeriodComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineswapReportPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
