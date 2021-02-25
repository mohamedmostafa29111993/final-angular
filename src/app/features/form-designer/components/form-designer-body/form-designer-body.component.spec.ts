import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDesignerBodyComponent } from './form-designer-body.component';

describe('FormDesignerBodyComponent', () => {
  let component: FormDesignerBodyComponent;
  let fixture: ComponentFixture<FormDesignerBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDesignerBodyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDesignerBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
