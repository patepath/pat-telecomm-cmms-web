import { TestBed } from '@angular/core/testing';

import { JobsCompletedService } from './jobs-completed.service';

describe('JobsCompletedService', () => {
  let service: JobsCompletedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobsCompletedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
