import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDesignerPivotControlDialogComponent } from './form-designer-pivot-control-dialog.component';

describe('FormDesignerPivotControlDialogComponent', () => {
  let component: FormDesignerPivotControlDialogComponent;
  let fixture: ComponentFixture<FormDesignerPivotControlDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDesignerPivotControlDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDesignerPivotControlDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
