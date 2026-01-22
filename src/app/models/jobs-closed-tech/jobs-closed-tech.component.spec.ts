import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsClosedTechComponent } from './jobs-closed-tech.component';

describe('JobsClosedTechComponent', () => {
  let component: JobsClosedTechComponent;
  let fixture: ComponentFixture<JobsClosedTechComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobsClosedTechComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobsClosedTechComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
