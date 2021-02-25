import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDesignDimensionComponent } from './form-design-dimension.component';

describe('FormDesignDimensionComponent', () => {
  let component: FormDesignDimensionComponent;
  let fixture: ComponentFixture<FormDesignDimensionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDesignDimensionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDesignDimensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
