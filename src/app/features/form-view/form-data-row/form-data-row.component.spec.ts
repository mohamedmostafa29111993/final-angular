import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDataRowComponent } from './form-data-row.component';

describe('FormDataRowComponent', () => {
  let component: FormDataRowComponent;
  let fixture: ComponentFixture<FormDataRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormDataRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDataRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
