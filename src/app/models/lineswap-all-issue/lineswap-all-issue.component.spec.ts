import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineswapAllIssueComponent } from './lineswap-all-issue.component';

describe('LineswapAllIssueComponent', () => {
  let component: LineswapAllIssueComponent;
  let fixture: ComponentFixture<LineswapAllIssueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineswapAllIssueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineswapAllIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
