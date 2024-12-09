import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportBySummaryComponent } from './report-by-summary.component';

describe('ReportBySummaryComponent', () => {
  let component: ReportBySummaryComponent;
  let fixture: ComponentFixture<ReportBySummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportBySummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportBySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
