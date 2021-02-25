import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewSubsectionComponent } from './preview-subsection.component';

describe('PreviewSubsectionComponent', () => {
  let component: PreviewSubsectionComponent;
  let fixture: ComponentFixture<PreviewSubsectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewSubsectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewSubsectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
