import { TestBed } from '@angular/core/testing';

import { JobsTodayService } from './jobs-today.service';

describe('JobsTodayService', () => {
  let service: JobsTodayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobsTodayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
