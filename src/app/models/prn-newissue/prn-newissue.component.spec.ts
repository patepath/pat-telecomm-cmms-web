import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrnNewissueComponent } from './prn-newissue.component';

describe('PrnNewissueComponent', () => {
  let component: PrnNewissueComponent;
  let fixture: ComponentFixture<PrnNewissueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrnNewissueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrnNewissueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
