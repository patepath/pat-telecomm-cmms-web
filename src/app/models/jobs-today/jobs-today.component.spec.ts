import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsTodayComponent } from './jobs-today.component';

describe('JobsTodayComponent', () => {
  let component: JobsTodayComponent;
  let fixture: ComponentFixture<JobsTodayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobsTodayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobsTodayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
