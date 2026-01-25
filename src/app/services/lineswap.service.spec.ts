import { TestBed } from '@angular/core/testing';

import { LineswapService } from './lineswap.service';

describe('LineswapService', () => {
  let service: LineswapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LineswapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
