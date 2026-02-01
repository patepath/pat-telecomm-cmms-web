import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineswapFinishedComponent } from './lineswap-finished.component';

describe('LineswapFinishedComponent', () => {
  let component: LineswapFinishedComponent;
  let fixture: ComponentFixture<LineswapFinishedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineswapFinishedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineswapFinishedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
