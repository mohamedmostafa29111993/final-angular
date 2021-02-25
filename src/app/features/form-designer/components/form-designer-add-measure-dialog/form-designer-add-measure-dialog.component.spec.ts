import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDesignerAddMeasureDialogComponent } from './form-designer-add-measure-dialog.component';

describe('FormDesignerAddMeasureDialogComponent', () => {
  let component: FormDesignerAddMeasureDialogComponent;
  let fixture: ComponentFixture<FormDesignerAddMeasureDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDesignerAddMeasureDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDesignerAddMeasureDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
