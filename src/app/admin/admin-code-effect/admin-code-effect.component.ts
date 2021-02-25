import { AppSessionService } from '@shared/session/app-session.service';
import { Component, OnInit, ViewChild } from '@angular/core';
// import { FormServiceProxy, FormListDto, SectionServiceProxy, FormColumnServiceProxy, FormColumnForSectionDto, SectionColumnOutputDto } from '@shared/service-proxies/service-proxies';
// import { CodeEffectComponent } from '../code-effect/code-effect.component';

@Component({
  selector: 'app-admin-code-effect',
  templateUrl: './admin-code-effect.component.html',
  styleUrls: ['./admin-code-effect.component.css', '../../../assets/style/form.css']
})
export class AdminCodeEffectComponent implements OnInit {
  // isLoaded: boolean = false;
  // public FormList: FormListDto[];
  // Sections: SectionColumnOutputDto[];
  // templateFieldsHeaders: FormColumnForSectionDto[];
  // selectedItem: FormColumnForSectionDto;
  // @ViewChild(CodeEffectComponent) child: CodeEffectComponent;

  constructor(
    // private formService: FormServiceProxy,
    // private _FormColumnService: FormColumnServiceProxy,
    // private _sectionService: SectionServiceProxy,
    // private appSessionService: AppSessionService
    ) {

    }


  ngOnInit(): void {
  }

  ngAfterViewInit() {
    // this.getFormsList();
  }

  // public getFormsList(): void {
  //   this.formService.getAllForms(this.appSessionService.userId).pipe()
  //     .subscribe((result: FormListDto[]) => {

  //       this.FormList = result;

  //     });
  // }
  // public getSectionsByForm(formId: number): void {
  //   this._sectionService.getSectionByForm(formId).pipe()
  //     .subscribe((result: SectionColumnOutputDto[]) => {
  //       this.Sections = result;
  //     });
  // }
  // public getColumnBySection(sectionId: number): void {
  //   this.isLoaded = true;
  //   console.log(sectionId);
  //   this._FormColumnService.getColumnsBySection(sectionId).pipe()
  //     .subscribe((result: FormColumnForSectionDto[]) => {
  //       this.templateFieldsHeaders = result;
  //       this.isLoaded = false;
  //     }, error => { this.isLoaded = true });
  // }

  // getRule(item: FormColumnForSectionDto) {
  //   // tslint:disable-next-line: no-debugger
  //  // debugger;
  //  /*  this._codeEffectServiceProxy.templateTypeId = itemTemplateId;
  //   this._codeEffectServiceProxy.fieldRuleId = item.businessRuleId;
  //   this._codeEffectServiceProxy.ItemSelected = item;
  //   */
  //   this.selectedItem = item;
  // //  this.selectedItem.TemplateName = (item.TemplateId == TemplateTypes.OutCome) ? 'Header' : 'Week';
  //   //this.child.getRuleChild(item.businessRuleId);
  // }
}
