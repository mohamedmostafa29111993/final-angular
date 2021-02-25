import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnMeasureComponent } from './column-measure.component';

describe('ColumnMeasureComponent', () => {
  let component: ColumnMeasureComponent;
  let fixture: ComponentFixture<ColumnMeasureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColumnMeasureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnMeasureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
