import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPreviewRowComponent } from './form-preview-row.component';

describe('FormPreviewRowComponent', () => {
  let component: FormPreviewRowComponent;
  let fixture: ComponentFixture<FormPreviewRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormPreviewRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPreviewRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
