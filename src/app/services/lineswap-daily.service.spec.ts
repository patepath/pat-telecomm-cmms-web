import { TestBed } from '@angular/core/testing';

import { LineswapDailyService } from './lineswap-daily.service';

describe('LineswapDailyService', () => {
  let service: LineswapDailyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LineswapDailyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
