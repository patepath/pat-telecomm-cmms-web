import { TestBed } from '@angular/core/testing';

import { LineswapEditService } from './lineswap-edit.service';

describe('LineswapEditService', () => {
  let service: LineswapEditService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LineswapEditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
