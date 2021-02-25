import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyKpisComponent } from './copy-kpis-dialog.component';

describe('CopyKpisComponent', () => {
  let component: CopyKpisComponent;
  let fixture: ComponentFixture<CopyKpisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CopyKpisComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyKpisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
