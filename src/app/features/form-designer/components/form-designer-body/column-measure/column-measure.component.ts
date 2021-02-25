import { Component, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import {
  FormColumnCubeMappingDto,
  FormDesignerKPIDto,
  FormStructureColumnDto,
  KPIDto,
  PivotConfiguration,
} from "@shared/service-proxies/service-proxies";

@Component({
  selector: "column-measure",
  templateUrl: "./column-measure.component.html",
  styleUrls: ["./column-measure.component.css"],
})
export class ColumnMeasureComponent implements OnInit {
  @Input() pivot: PivotConfiguration;
  @Input() kpi: FormDesignerKPIDto;
  @Input() columnn: FormStructureColumnDto;
  highlight: FormGroup;

  constructor() {}

  ngOnInit(): void {
    this.highlight = new FormGroup({
      mappingRadio: new FormControl([""]),
    });
    if (this.kpi.colCubeMapping) {
      this.highlight
        .get("mappingRadio")
        .setValue(
          this.kpi.colCubeMapping.find(
            (c) =>
              c.mainBindingSource === this.columnn.bindSource &&
              c.isDeleted == false
          )?.selector
        );
    }
  }
  selectedDataSource(
    kpiobj: FormDesignerKPIDto,
    columnObj: FormStructureColumnDto,
    value: any,
    measureName
    // input: HTMLInputElement
  ) {
    debugger;
    let flag = false;
    let colCubeMapping: FormColumnCubeMappingDto = this.checkExistingDataSource(
      columnObj.bindSource,
      kpiobj.id,
      value
    );
    if (colCubeMapping) {
      // input.value = null;
      if (colCubeMapping.id > 0) {
        colCubeMapping.selector = value;
        this.highlight.get("mappingRadio").setValue(value);
      }
    }

    let SelectedDataSourceMeasureObj = new FormColumnCubeMappingDto();
    SelectedDataSourceMeasureObj.id = 0;
    SelectedDataSourceMeasureObj.formStructureColumnId = columnObj.id;
    SelectedDataSourceMeasureObj.mainBindingSource = columnObj.bindSource;
    SelectedDataSourceMeasureObj.formStructureRowId = kpiobj.id;
    SelectedDataSourceMeasureObj.selector = measureName;
    SelectedDataSourceMeasureObj.isMeasure = true;
    if (!kpiobj.colCubeMapping) {
      kpiobj.colCubeMapping = [];
    }
    let existObj = kpiobj.colCubeMapping.find(
      (x) =>
        x.mainBindingSource == SelectedDataSourceMeasureObj.mainBindingSource &&
        !x.isDeleted
    );
    if (!existObj) {
      debugger;
      kpiobj.colCubeMapping.push(SelectedDataSourceMeasureObj);
      this.highlight.get("mappingRadio").setValue(value);
    } else {
      var colMapIndex = kpiobj.colCubeMapping.findIndex(
        (x) =>
          x.mainBindingSource ==
            SelectedDataSourceMeasureObj.mainBindingSource && !x.isDeleted
      );
      if (existObj.id == 0) {
        if (existObj.selector == SelectedDataSourceMeasureObj.selector) {
          kpiobj.colCubeMapping.splice(colMapIndex, 1);
          this.highlight.reset();
        } else {
          kpiobj.colCubeMapping.splice(colMapIndex, 1);
          kpiobj.colCubeMapping.push(SelectedDataSourceMeasureObj);
          this.highlight.get("mappingRadio").setValue(value);
        }
      }
      if (existObj.id > 0) {
        if (existObj.selector == SelectedDataSourceMeasureObj.selector) {
          existObj.isDeleted = true;
          this.highlight.reset();
          // this.dropMapping.emit({kpi: kpiobj, column: existObj})
        } else {
          existObj.isDeleted = true;
          this.highlight.reset();
          kpiobj.colCubeMapping.push(SelectedDataSourceMeasureObj);
          this.highlight.get("mappingRadio").setValue(value);
        }
      }
    }
  }

  checkExistingDataSource(
    bindSource: string,
    kpiId: number,
    measureName: string,
    checked = false
  ) {
    let colcubemapping;
    // let kpi = this.formDesignerStructure.kpis.find((x) => x.id == kpiId);
    if (this.kpi) {
      colcubemapping = this.kpi?.colCubeMapping.find(
        (x) =>
          x.mainBindingSource == bindSource &&
          x.selector?.trim() == measureName?.trim() &&
          x.isDeleted == false
      );
    }
    return colcubemapping;
  }
}
