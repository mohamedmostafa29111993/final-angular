import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from "@angular/core";
import { DimentionWeekIndexs } from "@shared/custom-dtos/output-events-emitter-dto";
import {
  FormCellTypeDto,
  FormDesignerKPIDto,
  FormDimensionWeekDto,
  FormStructerDataCellDto,
  FormStructureCellDesignerDto,
  FormStructureColumnDto,
  FormStructureDataDto,
} from "@shared/service-proxies/service-proxies";
import { FormDesignerService } from "../../form-designer.service";

@Component({
  selector: "[app-form-designer-row]",
  templateUrl: "./form-designer-row.component.html",
  styleUrls: ["./form-designer-row.component.css"],
})
export class FormDesignerRowComponent implements OnInit, OnChanges {
  @Input() kpiIndex: number;
  @Input() dimensionDataIndex: number;
  @Input() formIndicator: FormDesignerKPIDto;
  @Input() formDimension;
  @Input() index: number;
  @Input() formRow: FormDimensionWeekDto;
  @Input() formColumns: FormStructureColumnDto[];
  @Input() cellTypes: FormCellTypeDto[];
  @Output() deleteWeekDimension = new EventEmitter<DimentionWeekIndexs>();
  constructor(public formDesignerService: FormDesignerService) {}
  ngOnChanges() {
    //debugger;
    this.formIndicator = this.formIndicator;
  }
  ngOnInit(): void {
    this.fillCells();
  }
  fillCells() {
    let cells: FormStructerDataCellDto[] = [];
    if (this.formColumns) {
      this.formColumns.forEach((col) => {
        let cell = this.formRow.cells?.find(
          (x) => x.columnBindSource == col.bindSource
        );
        if (!cell) {
          cell = new FormStructerDataCellDto();
          cell.typeId = 1;
          cell.columnBindSource = col.bindSource;
          cell.formColumnId = !col.id ? 0 : col.id;
          cell.isDeleted = false;
          cell.columnOrder = col.order;
        }
        cells.push(cell);
      });
    }
    this.formRow.cells = cells;
  }
  delete() {
    this.deleteWeekDimension.emit({
      parentKpiIndex: this.kpiIndex,
      parentDimensionDataIndex: this.dimensionDataIndex,
      dimensionWeekIndex: this.index,
    });
  }
  assignCellType(typeId: number, i: number, sentCell) {
    let cell = this.formRow.cells[i];
    sentCell.typeId = typeId;
    cell = sentCell;
  }
  getCellTypeName(id: number) {
    return this.cellTypes.find((x) => x.id == id)?.type;
  }
}
