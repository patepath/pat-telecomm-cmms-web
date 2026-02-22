import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineswapCompletedComponent } from './lineswap-completed.component';

describe('LineswapCompletedComponent', () => {
  let component: LineswapCompletedComponent;
  let fixture: ComponentFixture<LineswapCompletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineswapCompletedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineswapCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
