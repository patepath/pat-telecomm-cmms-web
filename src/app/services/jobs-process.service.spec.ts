import { TestBed } from '@angular/core/testing';

import { JobsProcessService } from './jobs-process.service';

describe('JobsProcessService', () => {
  let service: JobsProcessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobsProcessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
