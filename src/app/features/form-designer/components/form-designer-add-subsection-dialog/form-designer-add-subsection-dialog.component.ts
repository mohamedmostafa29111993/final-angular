import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import {
  FormDesignerServiceProxy,
  FormDesignerSubSectionDto,
  MainSubSectionsDto,
} from "@shared/service-proxies/service-proxies";
import { NotifyService } from "abp-ng2-module";
import { BsModalRef } from "ngx-bootstrap/modal";

@Component({
  selector: "app-form-designer-add-subsection-dialog",
  templateUrl: "./form-designer-add-subsection-dialog.component.html",
  styleUrls: ["./form-designer-add-subsection-dialog.component.css"],
})
export class FormDesignerAddSubsectionDialogComponent implements OnInit {
  @ViewChild("template", { static: false }) template: TemplateRef<any>;
  @Output() onSave = new EventEmitter<any>();
  selectedSubsections = new Array<FormDesignerSubSectionDto>();
  FormMainSubsections: MainSubSectionsDto[] = new Array<MainSubSectionsDto>();
  FormStructureSubSections: FormDesignerSubSectionDto = new FormDesignerSubSectionDto();
  FormSubSections: FormDesignerSubSectionDto[] = new Array<FormDesignerSubSectionDto>();
  errorMsg: boolean;

  constructor(
    public ModalRef: BsModalRef,
    public notify: NotifyService,
    private _formDesignerServiceProxy: FormDesignerServiceProxy
  ) {}

  ngOnInit(): void {
    console.log(this.FormMainSubsections);
  }
  addSubsection() {
    //debugger
    if (this.selectedSubsections.length > 0) {
      this.errorMsg = false;
      this.FormMainSubsections =
        !this.FormMainSubsections || this.FormMainSubsections.length == 0
          ? []
          : this.FormMainSubsections;
      this.selectedSubsections.forEach((sec) => {
        var selectedindex = this.FormMainSubsections.find(
          (x) => x.subSectionId == sec.subSectionId
        );
        var index = this.FormMainSubsections.indexOf(selectedindex, 0);
        this.FormMainSubsections.splice(index, 1);

        this.FormSubSections.push(this.prepareSubSectionObject(sec));
      });
      //debugger
      console.log(this.FormSubSections);
      this.onSave.emit(this.FormSubSections);
      this.ModalRef.hide();
      this.notify.success("Sub Section Saved Successfully");
    } else {
      this.errorMsg = true;
    }
  }

  prepareSubSectionObject(sec: any): FormDesignerSubSectionDto {
    //debugger
    const newSection = new FormDesignerSubSectionDto();
    newSection.subSectionId = sec.subSectionId;
    newSection.formSubSectionId = 0;
    newSection.subSectionTitle = sec.subSectionTitle;
    newSection.subSectionTypeId = sec.subSectionTypeId;
    newSection.parentSectionId = sec.parentSectionId;
    newSection.isDeleted = sec.isDeleted;
    newSection.isLeaf = sec.isLeaf;
    newSection.order = sec.order;
    return newSection;
  }
}
