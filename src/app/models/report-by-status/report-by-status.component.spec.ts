import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportByStatusComponent } from './report-by-status.component';

describe('ReportByStatusComponent', () => {
  let component: ReportByStatusComponent;
  let fixture: ComponentFixture<ReportByStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportByStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportByStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
