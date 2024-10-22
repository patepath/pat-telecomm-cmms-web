import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsProcessComponent } from './jobs-process.component';

describe('JobsProcessComponent', () => {
  let component: JobsProcessComponent;
  let fixture: ComponentFixture<JobsProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobsProcessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobsProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
