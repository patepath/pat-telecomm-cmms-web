import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsDailyComponent } from './jobs-daily.component';

describe('JobsDailyComponent', () => {
  let component: JobsDailyComponent;
  let fixture: ComponentFixture<JobsDailyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobsDailyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobsDailyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
