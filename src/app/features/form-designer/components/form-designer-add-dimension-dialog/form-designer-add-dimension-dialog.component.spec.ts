import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDesignerAddDimensionDialogComponent } from './form-designer-add-dimension-dialog.component';

describe('FormDesignerAddDimensionDialogComponent', () => {
  let component: FormDesignerAddDimensionDialogComponent;
  let fixture: ComponentFixture<FormDesignerAddDimensionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDesignerAddDimensionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDesignerAddDimensionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
