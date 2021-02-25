import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDataBodyComponent } from './form-data-body.component';

describe('FormDataBodyComponent', () => {
  let component: FormDataBodyComponent;
  let fixture: ComponentFixture<FormDataBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDataBodyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDataBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
