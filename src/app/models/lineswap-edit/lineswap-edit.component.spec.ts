import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineswapEditComponent } from './lineswap-edit.component';

describe('LineswapEditComponent', () => {
  let component: LineswapEditComponent;
  let fixture: ComponentFixture<LineswapEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineswapEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineswapEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
