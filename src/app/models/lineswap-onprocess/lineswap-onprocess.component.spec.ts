import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineswapOnprocessComponent } from './lineswap-onprocess.component';

describe('LineswapOnprocessComponent', () => {
  let component: LineswapOnprocessComponent;
  let fixture: ComponentFixture<LineswapOnprocessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineswapOnprocessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineswapOnprocessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
