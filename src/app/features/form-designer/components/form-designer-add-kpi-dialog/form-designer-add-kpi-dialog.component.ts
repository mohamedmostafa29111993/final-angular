import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  EventEmitter,
  Output,
} from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { NotifyService } from "abp-ng2-module";
import * as _ from "lodash";
import {
  IndicatorTypeEditDto,
  FormDesignerServiceProxy,
  FormDesignerKPIDto,
  FormDesignerSubSectionStructureDto,
  FormColumnDto,
  FormStructerDataCellDto,
  FormDesignerDimensionDataDto,
  FormDimensionWeekDto,
} from "@shared/service-proxies/service-proxies";
import { FormStructureType } from "@shared/enums/form-structure-type";

@Component({
  selector: "app-form-designer-add-kpi-dialog",
  templateUrl: "./form-designer-add-kpi-dialog.component.html",
  styleUrls: ["./form-designer-add-kpi-dialog.component.css"],
})
export class FormDesignerAddKpiDialogComponent implements OnInit {
  @ViewChild("template", { static: false }) template: TemplateRef<any>;
  @Output() onSave = new EventEmitter<any>();
  selectedKPIs: IndicatorTypeEditDto[] = new Array<IndicatorTypeEditDto>();
  filteredKPIs: IndicatorTypeEditDto[] = new Array<IndicatorTypeEditDto>();
  FormStructure: FormDesignerSubSectionStructureDto = new FormDesignerSubSectionStructureDto();
  FormStructureKPIs: FormDesignerKPIDto[] = new Array<FormDesignerKPIDto>();
  errorMsg: boolean;

  constructor(
    public ModalRef: BsModalRef,
    public notify: NotifyService,
    private _formDesignerServiceProxy: FormDesignerServiceProxy
  ) {}

  ngOnInit(): void {}

  getFilteredKPIs(prefix: string) {
    this.filteredKPIs = [];
    if (prefix.trim() != "") {
      this._formDesignerServiceProxy
        .getAllIndicatorTypesByPrefix(prefix)
        .subscribe((res) => {
          this.filteredKPIs = res;
          let yFilter = this.selectedKPIs.map((itemY) => {
            return itemY.id;
          });
          this.filteredKPIs = this.filteredKPIs.filter(
            (itemX) => !yFilter.includes(itemX.id)
          );
        });
    }
  }

  CheckKPI(kpiId: any): boolean {
    if (this.FormStructure.kpis != null) {
      if (
        this.FormStructure.kpis.find(
          (f) => f.structureId == kpiId && f.isDeleted == false
        )
      )
        return true;
      else return false;
    } else return false;
  }

  addKPI() {
    if (this.selectedKPIs.length > 0) {
      this.errorMsg = false;
      this.FormStructure.kpis =
        !this.FormStructure.kpis || this.FormStructure.kpis.length == 0
          ? []
          : this.FormStructure.kpis;
      this.selectedKPIs.forEach((kpi) => {
        this.FormStructureKPIs.push(this.prepareIndicatorObject(kpi));
      });
      this.onSave.emit(this.FormStructureKPIs);
      this.ModalRef.hide();
      this.notify.success("KPI Saved Successfully");
    } else {
      this.errorMsg = true;
    }
  }

  prepareIndicatorObject(kpi: IndicatorTypeEditDto): FormDesignerKPIDto {
    debugger;
    let newIndicator = new FormDesignerKPIDto();
    newIndicator.code = kpi.kpiCode;
    newIndicator.structureId = kpi.id;
    newIndicator.isLeaf = true;
    newIndicator.order = 0;
    newIndicator.parentId = this.FormStructure.id;
    newIndicator.rowTypeId = this.FormStructure.rowTypeId;
    newIndicator.structureTypeId = FormStructureType.KPI;
    newIndicator.title = kpi.title;
    newIndicator.cells = new Array<FormStructerDataCellDto>();
    newIndicator.dimensions = new Array<FormDesignerDimensionDataDto>();
    newIndicator.weeks = new Array<FormDimensionWeekDto>();
    newIndicator.showValues = true;
    newIndicator.id = 0;
    newIndicator.isDeleted = false;

    return newIndicator;
  }
}
