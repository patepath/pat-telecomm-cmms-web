import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineswapNewIssueComponent } from './lineswap-new-issue.component';

describe('LineswapNewIssueComponent', () => {
  let component: LineswapNewIssueComponent;
  let fixture: ComponentFixture<LineswapNewIssueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineswapNewIssueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineswapNewIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
