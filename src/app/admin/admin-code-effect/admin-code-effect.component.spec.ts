import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCodeEffectComponent } from './admin-code-effect.component';

describe('AdminCodeEffectComponent', () => {
  let component: AdminCodeEffectComponent;
  let fixture: ComponentFixture<AdminCodeEffectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCodeEffectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCodeEffectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
