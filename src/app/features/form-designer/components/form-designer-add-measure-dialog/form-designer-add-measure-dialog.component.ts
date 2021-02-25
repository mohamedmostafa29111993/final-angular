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
  FormDesignerServiceProxy,
  FormColumnOutputDto,
  FormDesignerSubSectionStructureDto,
  FormStructureColumnDto,
} from "@shared/service-proxies/service-proxies";

@Component({
  selector: "app-form-designer-add-measure-dialog",
  templateUrl: "./form-designer-add-measure-dialog.component.html",
  styleUrls: ["./form-designer-add-measure-dialog.component.css"],
})
export class FormDesignerAddMeasureDialogComponent implements OnInit {
  @Output() onSave = new EventEmitter<any>();

  selectedColumns: FormColumnOutputDto[] = new Array<FormColumnOutputDto>();
  StructureColumns: FormStructureColumnDto[] = new Array<FormStructureColumnDto>();
  Columns: FormColumnOutputDto[] = new Array<FormColumnOutputDto>();
  FormStructure: FormDesignerSubSectionStructureDto = new FormDesignerSubSectionStructureDto();
  errorMsg: boolean;

  constructor(
    public ModalRef: BsModalRef,
    public notify: NotifyService,
    private _formDesignerServiceProxy: FormDesignerServiceProxy
  ) {}

  ngOnInit(): void {
    // this.GetAllCoulmns();
  }

  addColumn() {
    if (this.selectedColumns.length > 0) {
      this.errorMsg = false;
      this.FormStructure.columns =
        !this.FormStructure.columns || this.FormStructure.columns.length == 0
          ? []
          : this.FormStructure.columns;
      let ColumnOrder = 0;
      if (this.FormStructure.columns.length > 0) {
        this.FormStructure.columns.forEach((Column) => {
          if (Column.order > ColumnOrder) {
            ColumnOrder = Column.order;
          }
        });
      }

      for (var i = 0; i < this.selectedColumns.length; i++) {
        let newCoulmn = this.prepareMeasureObject(this.selectedColumns[i]);
        newCoulmn.order = 1 + i + ColumnOrder;
        this.StructureColumns.push(newCoulmn);
      }

      this.onSave.emit(this.StructureColumns);
      this.ModalRef.hide();
      this.notify.success("Measure Saved Successfully");
    } else {
      this.errorMsg = true;
    }
  }

  prepareMeasureObject(Column: FormColumnOutputDto): FormStructureColumnDto {
    let FormStructureColumn = new FormStructureColumnDto();
    FormStructureColumn.header = Column.header;
    FormStructureColumn.bindSource = Column.bindingSource;
    FormStructureColumn.columnStructureId = Column.id;
    FormStructureColumn.id = 0;
    FormStructureColumn.parentId = this.FormStructure.id;
    FormStructureColumn.isDeleted = false;
    return FormStructureColumn;
  }
}
