import { TestBed } from '@angular/core/testing';

import { FormDesignerService } from './form-designer.service';

describe('FormDesignerService', () => {
  let service: FormDesignerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormDesignerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
