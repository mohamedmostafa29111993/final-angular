import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDesignerRowComponent } from './form-designer-row.component';

describe('FormDesignerRowComponent', () => {
  let component: FormDesignerRowComponent;
  let fixture: ComponentFixture<FormDesignerRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDesignerRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDesignerRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
