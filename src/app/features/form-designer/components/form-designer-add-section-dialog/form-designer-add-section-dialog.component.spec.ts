import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDesignerAddSectionDialogComponent } from './form-designer-add-section-dialog.component';

describe('FormDesignerAddSectionDialogComponent', () => {
  let component: FormDesignerAddSectionDialogComponent;
  let fixture: ComponentFixture<FormDesignerAddSectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDesignerAddSectionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDesignerAddSectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
