import {
  FormDimensionDataDto,
  FormDimensionWeekDto,
  FormKPIDto,
  FormStructerDataCellDto,
  FormStructureColumnDto,
  FormSubsectionDto,
} from "@shared/service-proxies/service-proxies";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormStructureType } from "@shared/enums/form-structure-type";
import { FormRowType } from "@shared/enums/form-row-type";
import { AffectedParentRowsIds } from "@shared/custom-dtos/output-events-emitter-dto";
import { FormCellType } from "@shared/enums/form-cell-type";

@Component({
  selector: "[app-form-preview-row]",
  templateUrl: "./form-preview-row.component.html",
  styleUrls: ["./form-preview-row.component.css"],
})
export class FormPreviewRowComponent implements OnInit {
  cells: FormStructerDataCellDto[];
  @Input() columns: FormStructureColumnDto[];
  @Input() kpi: FormKPIDto;
  @Input() dimensionData: FormDimensionDataDto;
  @Input() dimensionWeek: FormDimensionWeekDto;
  @Output() updateAffectedRows = new EventEmitter<AffectedParentRowsIds>();
  @Input() structureTypeId: number;

  constructor() {}

  ngOnInit(): void {
    this.fillCells(this.structureTypeId);
  }
  getCell(
    bindSource: string,
    structureTypeId: number
  ): FormStructerDataCellDto {
    let cell = null;
    if (structureTypeId == FormStructureType.KPI) {
      cell = this.kpi.cells?.find((x) => x.columnBindSource === bindSource);
    } else if (structureTypeId == FormStructureType.DimensionData) {
      cell = this.dimensionData.cells?.find(
        (x) => x.columnBindSource === bindSource
      );
    } else if (structureTypeId == FormStructureType.DimensionWeek) {
      cell = this.dimensionWeek.cells?.find(
        (x) => x.columnBindSource === bindSource
      );
    }
    return cell;
  }

  fillCells(structureTypeId: number) {
    this.cells = [];
    this.columns.forEach((col: FormStructureColumnDto) => {
      let cell: FormStructerDataCellDto = this.getCell(
        col.bindSource,
        structureTypeId
      );
      if (!cell) {
        cell = new FormStructerDataCellDto();
        cell.dataId = 0;
        cell.structureId = 0;
        cell.value = 0;
        cell.formColumnId = col.id;
        cell.columnBindSource = col.bindSource;
        cell.columnHeader = col.header;
        cell.columnIsPercentage = col.isPercentage;
      }
      this.cells.push(cell);
    });
    if (structureTypeId == FormStructureType.KPI) {
      this.kpi.cells = this.cells;
      if (this.kpi.rowTypeId == FormRowType.Details && this.kpi.showValues) {
      }
    } else if (structureTypeId == FormStructureType.DimensionData) {
      this.dimensionData.cells = this.cells;
    } else if (structureTypeId == FormStructureType.DimensionWeek) {
      this.dimensionWeek.cells = this.cells;
    }
  }
  get structureType() {
    return FormStructureType;
  }
  get cellType() {
    return FormCellType;
  }
}
