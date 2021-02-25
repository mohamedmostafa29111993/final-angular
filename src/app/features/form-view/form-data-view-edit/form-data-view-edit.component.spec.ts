import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDataViewEditComponent } from './form-data-view-edit.component';

describe('FormDataViewEditComponent', () => {
  let component: FormDataViewEditComponent;
  let fixture: ComponentFixture<FormDataViewEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormDataViewEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDataViewEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
