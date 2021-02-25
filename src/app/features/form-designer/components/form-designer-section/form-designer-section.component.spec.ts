import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDesignerSectionComponent } from './form-designer-section.component';

describe('FormDesignerSectionComponent', () => {
  let component: FormDesignerSectionComponent;
  let fixture: ComponentFixture<FormDesignerSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDesignerSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDesignerSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
