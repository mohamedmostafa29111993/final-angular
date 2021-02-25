import { FormDesignerSubSectionStructureDto } from './../service-proxies/service-proxies';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  public formDesignerSubSection  : FormDesignerSubSectionStructureDto;
  public subSectionSelected  : number;
  public subSectionHasKPI =false;
  public isAllLoading = false;
  constructor() { }
}
