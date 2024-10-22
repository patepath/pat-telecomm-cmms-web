import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsClosedComponent } from './jobs-closed.component';

describe('JobsClosedComponent', () => {
  let component: JobsClosedComponent;
  let fixture: ComponentFixture<JobsClosedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobsClosedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobsClosedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
