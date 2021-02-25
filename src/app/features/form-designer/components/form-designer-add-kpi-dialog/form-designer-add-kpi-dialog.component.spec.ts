import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDesignerAddKpiDialogComponent } from './form-designer-add-kpi-dialog.component';

describe('FormDesignerAddKpiDialogComponent', () => {
  let component: FormDesignerAddKpiDialogComponent;
  let fixture: ComponentFixture<FormDesignerAddKpiDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDesignerAddKpiDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDesignerAddKpiDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
