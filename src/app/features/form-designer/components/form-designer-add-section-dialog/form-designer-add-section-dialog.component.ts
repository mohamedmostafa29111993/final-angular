import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import {
  FormDesignerSectionDto,
  FormDesignerServiceProxy,
  FormDesignerSubSectionDto,
} from "@shared/service-proxies/service-proxies";
import { NotifyService } from "abp-ng2-module";
import { BsModalRef } from "ngx-bootstrap/modal";

@Component({
  selector: "app-form-designer-add-section-dialog",
  templateUrl: "./form-designer-add-section-dialog.component.html",
  styleUrls: ["./form-designer-add-section-dialog.component.css"],
})
export class FormDesignerAddSectionDialogComponent implements OnInit {
  @ViewChild("template", { static: false }) template: TemplateRef<any>;
  @Output() onSave = new EventEmitter<any>();
  selectedSections = new Array<any>();
  errorMsg: boolean;
  // filteredKPIs: IndicatorTypeEditDto[] = new Array<IndicatorTypeEditDto>();
  FormMainSections: FormDesignerSectionDto[] = new Array<FormDesignerSectionDto>();
  FormStructureSections: FormDesignerSectionDto[] = new Array<FormDesignerSectionDto>();
  FormStructureSubSections: FormDesignerSubSectionDto = new FormDesignerSubSectionDto();

  constructor(
    public ModalRef: BsModalRef,
    public notify: NotifyService,
    private _formDesignerServiceProxy: FormDesignerServiceProxy
  ) {}

  ngOnInit(): void {
    //debugger
    // tslint:disable-next-line: no-unused-expression
    console.log(this.FormMainSections);
  }

  addSection() {
    //debugger
    if (this.selectedSections.length > 0) {
      this.errorMsg = false;
      this.FormMainSections =
        !this.FormMainSections || this.FormMainSections.length == 0
          ? []
          : this.FormMainSections;
      this.selectedSections.forEach((sec) => {
        var selectedindex = this.FormMainSections.find(
          (x) => x.sectionId == sec.sectionId
        );
        var index = this.FormMainSections.indexOf(selectedindex, 0);
        this.FormMainSections.splice(index, 1);

        this.FormStructureSections.push(this.prepareSectionObject(sec));
      });
      //debugger
      console.log(this.FormStructureSections);
      this.onSave.emit(this.FormStructureSections);
      this.ModalRef.hide();
      this.notify.success("Section Saved Successfully");
    } else {
      this.errorMsg = true;
    }
  }

  prepareSectionObject(sec: any): FormDesignerSectionDto {
    //debugger
    const newSection = new FormDesignerSectionDto();
    newSection.sectionId = sec.sectionId;
    newSection.formSectionId = sec.formSectionId;
    newSection.sectionTitle = sec.sectionTitle;
    newSection.sectionTypeId = sec.sectionTypeId;
    newSection.parentSectionId = sec.parentSectionId;
    if (sec?.childern.length != 0) {
      sec.childern[0].isDeleted = false;
      newSection.childern = sec?.childern;
    } else {
      newSection.childern = [];
      const dummySubSection = new FormDesignerSubSectionDto();
      dummySubSection.formSubSectionId = 0;
      dummySubSection.subSectionTitle = "Root";
      dummySubSection.subSectionTypeId = 2;
      dummySubSection.parentSectionId = 0;
      newSection?.childern.push(dummySubSection);
    }
    return newSection;
  }
}
