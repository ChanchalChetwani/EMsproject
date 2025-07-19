import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectionRequests } from './correction-requests';

describe('CorrectionRequests', () => {
  let component: CorrectionRequests;
  let fixture: ComponentFixture<CorrectionRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorrectionRequests]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorrectionRequests);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
