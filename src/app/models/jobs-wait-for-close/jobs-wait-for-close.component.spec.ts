import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsWaitForCloseComponent } from './jobs-wait-for-close.component';

describe('JobsWaitForCloseComponent', () => {
  let component: JobsWaitForCloseComponent;
  let fixture: ComponentFixture<JobsWaitForCloseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobsWaitForCloseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobsWaitForCloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
