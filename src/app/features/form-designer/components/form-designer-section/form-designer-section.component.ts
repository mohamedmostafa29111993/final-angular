import { ActivatedRoute } from "@angular/router";

import { LeftSectionType } from "@shared/enums/left-section-type";
import { FormDesignerAddSectionDialogComponent } from "../form-designer-add-section-dialog/form-designer-add-section-dialog.component";

import { FormDesignerAddSubsectionDialogComponent } from "./../form-designer-add-subsection-dialog/form-designer-add-subsection-dialog.component";
import {
  AfterViewChecked,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import {
  FormDesignerServiceProxy,
  FormDesignerSubSectionDto,
} from "@shared/service-proxies/service-proxies";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";

import { NotifyService } from "abp-ng2-module";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { GlobalService } from "@shared/custom-services/global.service";
import { FormDesignerService } from "../../form-designer.service";
@Component({
  selector: "app-form-designer-section",
  templateUrl: "./form-designer-section.component.html",
  styleUrls: ["./form-designer-section.component.css"],
})
export class FormDesignerSectionComponent implements OnInit, AfterViewChecked {
  isCollapsed = false;
  //allSections: FormDesignerSectionDto[] =  new Array<FormDesignerSectionDto>();
  allSections = new Array<any>();
  mainSections = new Array<any>();
  allSubSections = new Array<any>();
  mainSubSections = new Array<any>();
  updatedSections = new Array<any>();

  formId = 0;
  enumLeftSectionType = LeftSectionType;
  formSectionId: number;
  event: any;
  IsLoadingHtml = false;
  minHeight = null;
  overflow = "hidden";
  panelClicked = false;
  sectionSelected: number;
  subSectionSelected: number;
  checkAll = false;
  isDisabledAddSection = false;
  isDisabledAddSubSection = false;
  isDelete = false;
  anyChanges = false;
  testPreview = true;
  // start coding -By Meska-
  isExpanded: number;
  computedValue: number;
  // end coding -By Meska-

  @ViewChild("namedElement", { static: false }) namedElement: ElementRef;
  @ViewChild("btnAccordion", { static: false }) btnAccordion: ElementRef;
  @Input() sectionData: any;
  @Output() sendSubSections: EventEmitter<{
    isSubsection: boolean;
    sectionId: FormDesignerSubSectionDto;
    isDel: boolean;
  }> = new EventEmitter();

  constructor(
    private _formDesignerService: FormDesignerServiceProxy,
    private route: ActivatedRoute,
    private _modalService: BsModalService,
    public notify: NotifyService,
    public global: GlobalService,
    public formDesignerService: FormDesignerService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.formId = +params.get("formId");
      if (this.formId > 0) {
        this.getAllSections();
        this.getAllSubsections();
      }
    });
  }

  ngAfterViewChecked() {
    if (this.btnAccordion != undefined && this.IsLoadingHtml) {
      this.btnAccordion.nativeElement.click();
      this.IsLoadingHtml = false;
    }
  }
  getAllSections() {
    //debugger;
    this._formDesignerService
      .getAllDesignerSections(this.formId)
      .subscribe((res) => {
        this.allSections =
          res.formDesignerSectionDto.length > 0
            ? res.formDesignerSectionDto
                .filter((element) => element.isDeleted == false)
                .filter((a) => a?.childern.filter((x) => x.isDeleted == false))
            : res.mainSections.filter((element) => element.isDeleted == false);
        this.mainSections =
          res.formDesignerSectionDto.length == 0
            ? new Array<any>()
            : res.mainSections;
        if (res.formDesignerSectionDto.length == 0) {
          // debugger
          this.updatedSections = res.mainSections;
        }

        //this.global.formDesignerObject = this.allSections;
        if (this.mainSections.length == 0 || this.allSections.length == 0) {
          this.isDisabledAddSection = true;
        } else {
          this.isDisabledAddSection = false;
        }
        if (this.allSections.length > 0) {
          this.sectionSelected = this.allSections[0]?.sectionId;

          // start coding -By Meska-
          this.isExpanded = +sessionStorage.getItem("storedExpandedPanel");
          this.computedValue = +sessionStorage.getItem("computedValue");

          let storedActiveSubSection = +sessionStorage.getItem(
            "storedSubSection"
          );
          let subsection = storedActiveSubSection
            ? storedActiveSubSection
            : this.allSections[0]?.childern[0]?.formSubSectionId;
          // end coding -By Meska-

          // let subsection = (this.allSections[0]??.childern[0]?.formSubSectionId > 0) ? this.allSections[0]??.childern[0]?.formSubSectionId : this.allSections[0]??.childern[0]?.subSectionId;
          this.sendFormSectionId(true, subsection, false, this.isExpanded);
        }
        this.IsLoadingHtml = true;
      });
  }
  getAllSubsections() {
    //debugger;
    this._formDesignerService
      .getAllDesignerSubSections(this.formId)
      .subscribe((res) => {
        this.allSubSections = res.formDesignerSubSectionDto;
        this.mainSubSections = res.mainSubSections;
        if (this.mainSubSections.length == 0) {
          this.isDisabledAddSubSection = true;
        } else {
          this.isDisabledAddSubSection = false;
        }
        //   this.IsLoadingHtml = true;
      });
  }

  sendFormSectionId(
    isSubsection,
    formSectionId,
    isDelete,
    expandedPanelIndex,
    subsection?,
    section?
  ) {
    this.global.subSectionSelected = formSectionId;

    //  let index = this.allSections.indexOf(this.allSections.find(x => x.formSubSectionId == formSectionId ));

    // start coding -By Meska-
    sessionStorage.setItem("storedSubSection", formSectionId);
    sessionStorage.setItem("storedExpandedPanel", expandedPanelIndex);

    if (expandedPanelIndex <= 0) {
      sessionStorage.setItem(
        "computedValue",
        JSON.stringify(expandedPanelIndex + 1)
      );
      this.computedValue = +sessionStorage.getItem("computedValue");
    } else {
      sessionStorage.setItem("computedValue", expandedPanelIndex);
    }
    // end coding -By Meska-
    this.global.formDesignerSubSection = section;
    this.global.formDesignerSubSection = subsection;
    // let index = this.allSections.indexOf(this.allSections.find(x => x.formSubSectionId == formSectionId ));
    console.log("🚀 ~ FROM SENDFORMSECTIONID ", formSectionId);

    this.subSectionSelected = formSectionId;
    this.sendSubSections.emit({
      isSubsection: isSubsection,
      sectionId: formSectionId,
      isDel: isDelete,
    });
  }

  toggleAccordian(event, index, formSectionId, leftSectionType) {
    // debugger;
    var element = event.target;

    element.classList.toggle("active");

    if (leftSectionType == LeftSectionType.FormSection) {
      if (this.allSections[index].isActive) {
        this.allSections[index].isActive = false;
      } else {
        this.allSections[index].isActive = true;
      }
    } else if (leftSectionType == LeftSectionType.MainSection) {
      if (this.mainSections[index].isActive) {
        this.mainSections[index].isActive = false;
      } else {
        this.mainSections[index].isActive = true;
      }
    }

    var panel = element.nextElementSibling;
    var panelChild = panel.childNodes;
    if (panel == undefined) {
      // this.sendSubSections.emit(formSectionId);
    } else {
      this.panelClicked = true;
      if (panel.style.minHeight) {
        panel.style.minHeight =
          "calc(18px + " + (panel.style.minHeight = null) + "px)";
      } else {
        panel.style.minHeight = panel.scrollHeight + "px";
        // panel.style.overflow = 'hidden !important';
      }
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.mainSections, event.previousIndex, event.currentIndex);
    moveItemInArray(this.allSections, event.previousIndex, event.currentIndex);
  }

  /* Section Add/Remove */
  openPopupSection() {
    //debugger;
    console.log(this.mainSections);
    if (!this.mainSections) {
      abp.message.error(
        "Invalid Form Structure !",
        undefined,
        (result: boolean) => {}
      );
    } else {
      if (this.mainSections == null) {
        this.mainSections = new Array<any>();
      }
      let addSectionDialog: BsModalRef;
      addSectionDialog = this._modalService.show(
        FormDesignerAddSectionDialogComponent,
        {
          class: "modal-sm modal-dialog-centered",
          backdrop: "static",
          initialState: {
            FormMainSections: this.mainSections,
          },
        }
      );
      addSectionDialog.content.onSave.subscribe((res) => {
        //debugger;
        this.anyChanges = true;
        if (this.mainSections.length == 0) {
          this.isDisabledAddSection = true;
        } else {
          this.isDisabledAddSection = false;
        }
        res.forEach((sec) => {
          this.allSections.push(sec);
        });
      });
    }
  }

  deleteSection(sectionId: number) {
    this.isDelete = true;
    this.sendFormSectionId(false, sectionId, this.isDelete, this.isExpanded);
  }
  responseDeleteSection(sectionId: number, hasData: boolean) {
    if (hasData) {
      abp.message.error(
        "Can't delete section you must delete Data at first  ",
        undefined,
        (result: boolean) => {}
      );

      this.isDelete = false;
    } else {
      let sectionObj: any;
      let sectionIndex: any;
      let sectionTitle: any;
      if (this.allSections.length > 0) {
        sectionObj = this.allSections.find(
          (f) =>
            (f.formSectionId != 0 ? f.formSectionId : f.sectionId) == sectionId
        );
        sectionIndex = this.allSections.indexOf(sectionObj);
        sectionTitle = this.allSections.find(
          (f) =>
            (f.formSectionId != 0 ? f.formSectionId : f.sectionId) == sectionId
        ).sectionTitle;
      } else {
        sectionObj = this.mainSections.find(
          (f) =>
            (f.formSectionId != 0 ? f.formSectionId : f.sectionId) == sectionId
        );
        sectionIndex = this.mainSections.indexOf(sectionObj);
        sectionTitle = this.mainSections.find(
          (f) =>
            (f.formSectionId != null ? f.formSectionId : f.sectionId) ==
            sectionId
        ).sectionTitle;
      }
      abp.message.confirm(
        "Are you sure you want to delete this Section (" + sectionTitle + ") ?",
        undefined,
        (result: boolean) => {
          if (result) {
            /*  if (this.allSections.length > 0) { */

            // this.allSections.splice(sectionIndex, 1);
            this.mainSections.push(sectionObj);
            if (sectionObj.childern.length > 0) {
              sectionObj.childern[0].isDeleted = true;
            }
            sectionObj.isDeleted = true;
            /*  }
             else {
               this.mainSections.splice(sectionIndex, 1);
               this.allSections.push(sectionObj);
             } */

            if (this.mainSections.length != 0) {
              this.isDisabledAddSection = false;
            } else if (this.allSections.length != 0) {
              this.isDisabledAddSection = false;
            }
            this.notify.success("Section deleted Successfully");
          }
        }
      );
    }
  }
  /* Subsection Add/Remove */
  openPopupSubsection(parentSectionId: number) {
    //debugger;
    //set parentId to subsections
    for (let prop of this.mainSubSections) {
      prop.parentSectionId = parentSectionId;
    }
    //debugger
    if (!this.mainSubSections) {
      abp.message.error(
        "Invalid Form Structure !",
        undefined,
        (result: boolean) => {}
      );
    } else {
      if (this.mainSubSections == null) {
        this.mainSubSections = new Array<any>();
      }
      let addSubSectionDialog: BsModalRef;
      addSubSectionDialog = this._modalService.show(
        FormDesignerAddSubsectionDialogComponent,
        {
          class: "modal-sm modal-dialog-centered",
          backdrop: "static",
          initialState: {
            FormMainSubsections: this.mainSubSections,
          },
        }
      );
      addSubSectionDialog.content.onSave.subscribe((res) => {
        //debugger;
        if (this.mainSubSections.length == 0) {
          this.isDisabledAddSubSection = true;
        } else {
          this.isDisabledAddSubSection = false;
        }
        res.forEach((sec) => {
          debugger;
          if (this.allSections.length > 0) {
            const sectionObj = this.allSections.find(
              (f) =>
                (f.formSectionId != 0 ? f.formSectionId : f.sectionId) ==
                sec.parentSectionId
            );
            sectionObj?.childern.push(sec);
            this.allSubSections.push(sec);
          } else {
            const sectionObj = this.mainSections.find(
              (f) =>
                (f.formSectionId != 0 ? f.formSectionId : f.sectionId) ==
                sec.parentSectionId
            );
            sectionObj?.childern.push(sec);
            this.allSubSections.push(sec);
          }
        });
      });
    }
  }
  deleteSubSection(subSectionId: number) {
    this.isDelete = true;
    this.sendFormSectionId(true, subSectionId, this.isDelete, this.isExpanded);
  }
  responseDeleteSubSection(sectionId: number, hasData: boolean) {
    if (hasData) {
      abp.message.error(
        "Can't delete sub section you must delete Data at first  ",
        undefined,
        (result: boolean) => {}
      );

      this.isDelete = false;
    } else {
      let subsection = new FormDesignerSubSectionDto();
      let sectionObj = this.allSections.find((section) =>
        section?.childern.find(
          (x) =>
            (x.formSubSectionId != 0 ? x.formSubSectionId : x.subSectionId) ==
            sectionId
        )
      );
      subsection = sectionObj?.childern.find(
        (x) =>
          (x.formSubSectionId != 0 ? x.formSubSectionId : x.subSectionId) ==
          sectionId
      );
      const sectionIndex = sectionObj?.childern
        .map((itemY) => {
          return itemY;
        })
        .indexOf(subsection);

      abp.message.confirm(
        "Are you sure you want to delete this SubSection (" +
          subsection.subSectionTitle +
          ") ?",
        undefined,
        (result: boolean) => {
          if (result) {
            let subsectionDeleted = sectionObj?.childern.find(
              (x) =>
                (x.formSubSectionId != 0
                  ? x.formSubSectionId
                  : x.subSectionId) == sectionId
            ) as FormDesignerSubSectionDto;
            this.mainSubSections.push(subsection);
            if (subsectionDeleted.formSubSectionId == 0) {
              sectionObj?.childern.splice(sectionIndex, 1);
            } else {
              subsectionDeleted.isDeleted = true;
            }

            /*    this.allSections =  this.allSections.filter((element) => {
                 return element?.childern.filter(function (item) {
                     return item.isDeleted == false
                 })
             }) */
            // this.allSections = this.allSections.filter(a=>a?.childern.filter(x=>x.isDeleted ==false))
            if (this.mainSubSections.length != 0) {
              this.isDisabledAddSubSection = false;
            }
            this.notify.success("SubSection deleted Successfully");
          }
        }
      );
    }
  }

  // start coding -By Meska-
  checkExpandedPanel(panelIndex) {
    if (panelIndex == 0) {
      if (panelIndex + this.computedValue == this.isExpanded) {
        return true;
      } else {
        return false;
      }
    } else {
      if (panelIndex == this.isExpanded) {
        return true;
      } else {
        return false;
      }
    }
  }
  // end coding -By Meska-

  panelOpenState = false;
}
