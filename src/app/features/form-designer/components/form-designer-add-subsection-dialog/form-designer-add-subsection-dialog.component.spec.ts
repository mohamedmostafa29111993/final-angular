import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDesignerAddSubsectionDialogComponent } from './form-designer-add-subsection-dialog.component';

describe('FormDesignerAddSubsectionDialogComponent', () => {
  let component: FormDesignerAddSubsectionDialogComponent;
  let fixture: ComponentFixture<FormDesignerAddSubsectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDesignerAddSubsectionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDesignerAddSubsectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
