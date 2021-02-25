import { Component, EventEmitter, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormControl } from "@angular/forms";
import {
  FormServiceProxy,
  FormDesignerReferenceServiceProxy,
  SubSectionWithSectionNameDto,
  GetReferenceSumInputDto,
  ReferenceDimensionSumDto,
  GetReferenceDimensionSumInputDto,
  KPIDto,
} from "@shared/service-proxies/service-proxies";
import { NotifyService } from "abp-ng2-module";
import { BsModalRef } from "ngx-bootstrap/modal";
import { FormDesignerService } from "../../form-designer.service";
import { CopyKpisComponent } from "../copy-kpis-dialog/copy-kpis-dialog.component";

@Component({
  selector: "app-sum-dimensions-dialog",
  templateUrl: "./sum-dimensions-dialog.component.html",
  styleUrls: ["../copy-kpis-dialog/copy-kpis-dialog.component.css"],
})
export class SumDimensionsDialogComponent
  extends CopyKpisComponent
  implements OnInit {
  columns;
  FormDimension;
  FormKpi;
  sumDimension;
  targetDimensions: ReferenceDimensionSumDto[] = [];
  targetKPIS;
  fromStructureReference: any[] = [];
  sumRes: EventEmitter<
    ReferenceDimensionSumDto[] | KPIDto[]
  > = new EventEmitter<ReferenceDimensionSumDto[] | KPIDto[]>();
  constructor(
    public ModalRef: BsModalRef,
    public notify: NotifyService,
    protected formBuilder: FormBuilder,
    protected _formervice: FormServiceProxy,
    protected _formDesignerService: FormDesignerReferenceServiceProxy,
    protected formDesignerService: FormDesignerService
  ) {
    super(
      ModalRef,
      notify,
      formBuilder,
      _formervice,
      _formDesignerService,
      formDesignerService
    );
  }
  ngOnInit(): void {
    this.createCopyKPIForm();
    this.copyKpisForm.addControl(
      "dimensions",
      new FormControl("", Validators.required)
    );
    this.loadForms();
    this.onFormsChange();
    this.onSubSectionsChange();
    this.onKPISChange();
    this.onDimensionSChange();
  }

  loadSubsection(form) {
    const id = form?.formId ? form.formId : form;
    this.copyKpisForm.get("SubSections").reset();
    this.targetFormId = null;
    this.isSubSectionsLoaded = false;
    this.showSubSection = true;
    if (id && this.columns) {
      this.targetFormId = id;
      let body = new GetReferenceSumInputDto();
      body.formId = id;
      body.kpiColumnDto = this.columns;
      body.isDimensionSum = this.sumDimension;
      this._formDesignerService
        .retrieveSubSectionForReferenceSum(body)
        .subscribe((res: SubSectionWithSectionNameDto[]) => {
          if (res) {
            this.subSections = this.subSections.concat(res);
            if (this.FormStructure.id) {
              res.map((item, index) =>
                item.subSectionId == this.FormStructure.id
                  ? this.subSections.splice(index, 1)
                  : null
              );
            }
          }
          this.isSubSectionsLoaded = true;
        });
    }
  }

  // KPIS
  onKPISChange() {
    this.subscription.add(
      this.copyKpisForm.get("KPIS").valueChanges.subscribe((value) => {
        this.targetKPIS = null;
        this.isKPISLoaded = false;
        if (value) {
          this.targetKPIS = value;
          this.fromStructureReference.forEach((f, index) => {
            if (f.formId == this.targetSubSection.formId) {
              this.fromStructureReference[index].subSection.kpIs = value?.map(
                (k) =>
                  new KPIDto({
                    kpiId: k,
                    kpiTitle: this.findKpiOnSubsections(k)?.kpiTitle,
                    structureId: this.findKpiOnSubsections(k)?.structureId,
                    referenceDimensionDto: this.findKpiOnSubsections(k)
                      ?.referenceDimensionDto,
                  })
              );
            }
          });
          if (this.sumDimension) {
            this.loadDimensions(value[value.length - 1]);
          }
          this.formSubmitted = false;
        } else {
          this.isDimensionsLoaded = false;
          this.copyKpisForm.get("dimensions")?.setValue("");
          this.Dimensions = [];
        }
        this.isKPISLoaded = true;
      })
    );
  }
  loadDimensions(kpiId) {
    if (kpiId) {
      this.showDimensions = true;
      this.isDimensionsLoaded = false;
      const body = new GetReferenceDimensionSumInputDto({
        kpiId: kpiId,
        formId: this.targetFormId,
        dimensionDataDto: this.FormDimension,
      });
      this._formDesignerService
        .retrieveDimensionForReferenceSum(body)
        .subscribe((res: ReferenceDimensionSumDto[]) => {
          if (res.length) {
            this.Dimensions = res;
          }
          this.isDimensionsLoaded = true;
        });
    }
  }
  DCompareFn(item, selected) {
    return item.id === selected.id;
  }

  // KPIS
  onDimensionSChange() {
    this.subscription.add(
      this.copyKpisForm
        .get("dimensions")
        .valueChanges.subscribe((value: any[]) => {
          if (value) {
            this.targetDimensions.push(
              ...this.Dimensions.filter((d) => d.id == value.find((v) => v))
            );
            this.fromStructureReference.forEach((f, index) => {
              if (f.formId == this.targetSubSection.formId) {
                if (
                  !this.fromStructureReference[index].subSection.kpIs.find(
                    (kpi) =>
                      kpi.kpiId === this.targetKPIS[this.targetKPIS.length - 1]
                  )?.referenceDimensionDto
                ) {
                  this.fromStructureReference[index].subSection.kpIs.find(
                    (kpi) =>
                      kpi.kpiId === this.targetKPIS[this.targetKPIS.length - 1]
                  ).referenceDimensionDto = [];
                }
                this.fromStructureReference[index].subSection.kpIs
                  .find(
                    (kpi) =>
                      kpi.kpiId === this.targetKPIS[this.targetKPIS.length - 1]
                  )
                  .referenceDimensionDto.push(
                    this.targetDimensions[this.targetDimensions.length - 1]
                  );
              }
            });
          } else {
            this.Dimensions = [];
          }
        })
    );
  }
  save() {
    this.formSubmitted = true;
    if (!this.sumDimension) {
      this.copyKpisForm.removeControl("dimensions");
    }
    if (this.copyKpisForm.valid) {
      if (this.sumDimension) {
        this.sumRes.emit(this.targetDimensions);
      } else {
        let kpis: KPIDto[] = [];
        this.fromStructureReference.forEach((f) =>
          kpis.push(...f.subSection.kpIs)
        );
        this.sumRes.emit(kpis);
      }
    }
  }
}
