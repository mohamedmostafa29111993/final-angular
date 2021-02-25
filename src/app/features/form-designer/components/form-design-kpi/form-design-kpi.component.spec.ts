import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDesignKpiComponent } from './form-design-kpi.component';

describe('FormDesignKpiComponent', () => {
  let component: FormDesignKpiComponent;
  let fixture: ComponentFixture<FormDesignKpiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDesignKpiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDesignKpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
