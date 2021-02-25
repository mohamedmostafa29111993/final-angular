import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeEffectComponent } from './code-effect.component';

describe('CodeEffectComponent', () => {
  let component: CodeEffectComponent;
  let fixture: ComponentFixture<CodeEffectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeEffectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeEffectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
