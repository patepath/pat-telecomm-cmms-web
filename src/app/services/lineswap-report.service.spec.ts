import { TestBed } from '@angular/core/testing';

import { LineswapReportService } from './lineswap-report.service';

describe('LineswapReportService', () => {
  let service: LineswapReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LineswapReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
