import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDesignerAddDimensiontypeDialogComponent } from './form-designer-add-dimensiontype-dialog.component';

describe('FormDesignerAddDimensiontypeDialogComponent', () => {
  let component: FormDesignerAddDimensiontypeDialogComponent;
  let fixture: ComponentFixture<FormDesignerAddDimensiontypeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDesignerAddDimensiontypeDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDesignerAddDimensiontypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
