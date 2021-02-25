import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatFormAssignmentComponent } from './creat-form-assignment.component';

describe('CreatFormAssignmentComponent', () => {
  let component: CreatFormAssignmentComponent;
  let fixture: ComponentFixture<CreatFormAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatFormAssignmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatFormAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
