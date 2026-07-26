import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineswapDailyComponent } from './lineswap-daily.component';

describe('LineswapDailyComponent', () => {
  let component: LineswapDailyComponent;
  let fixture: ComponentFixture<LineswapDailyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineswapDailyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineswapDailyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
