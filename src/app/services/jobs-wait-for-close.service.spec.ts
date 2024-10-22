import { TestBed } from '@angular/core/testing';

import { JobsWaitForCloseService } from './jobs-wait-for-close.service';

describe('JobsWaitForCloseService', () => {
  let service: JobsWaitForCloseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobsWaitForCloseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
