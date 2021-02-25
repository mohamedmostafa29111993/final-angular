import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SumDimensionsDialogComponent } from './sum-dimensions-dialog.component';

describe('SumDimensionsDialogComponent', () => {
  let component: SumDimensionsDialogComponent;
  let fixture: ComponentFixture<SumDimensionsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SumDimensionsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SumDimensionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
