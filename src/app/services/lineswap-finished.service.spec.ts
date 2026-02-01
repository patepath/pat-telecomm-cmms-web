import { TestBed } from '@angular/core/testing';

import { LineswapFinishedService } from './lineswap-finished.service';

describe('LineswapFinishedService', () => {
  let service: LineswapFinishedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LineswapFinishedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
