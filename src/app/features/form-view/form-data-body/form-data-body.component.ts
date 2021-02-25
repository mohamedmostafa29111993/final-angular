import { Component, Input, OnInit } from "@angular/core";
import { FormStructureType } from "@shared/enums/form-structure-type";
import {
  CalenderDto,
  FormDimensionDataDto,
  FormKPIDto,
  FormSubsectionDto,
} from "@shared/service-proxies/service-proxies";
import { AffectedParentRowsIds } from "@shared/custom-dtos/output-events-emitter-dto";
import { FormRowType } from "@shared/enums/form-row-type";
import { EquationType } from "@shared/enums/EquationType";

@Component({
  selector: "[app-form-data-body]",
  templateUrl: "./form-data-body.component.html",
  styleUrls: [
    "./form-data-body.component.css",
    "../../../../assets/style/form.css",
  ],
})
export class FormDataBodyComponent implements OnInit {
  @Input() formId: number;
  @Input() Month: number;
  @Input() Weeks: number[];
  @Input() Year: number[];
  @Input() businessUnitId: number;
  @Input() subsection: FormSubsectionDto;
  @Input() weeksCalender: CalenderDto[];
  kpis: FormKPIDto[];
  isLoaded = false;
  constructor() {
    this.kpis = [];
  }
  ngOnInit(): void {
    if (this.subsection?.kpis) {
      this.isLoaded = true;
      this.kpis = this.subsection?.kpis;
    }
  }
  updateAffectedRows(affectedRows: AffectedParentRowsIds) {
    this.updateSummaryRow(affectedRows);
  }
  updateSummaryRow(affectedRows: AffectedParentRowsIds) {
    let kpi = this.kpis.find((x) => x.id == affectedRows.kpiId);
    if (kpi) {
      debugger;
      let dimentionData = kpi?.dimensions?.find(
        (x) => x.id == affectedRows.dimensionDataId
      );
      if (affectedRows.dimensionDataId > 0) {
        if (dimentionData.rowTypeId == this.rowType.Details) {
          dimentionData.cells.forEach((cell) => {
            cell.value = this.getWeeksSumValueForDimention(
              cell.formColumnId,
              dimentionData
            );
          });
        }
      }
      if (
        affectedRows.week > 0 &&
        kpi.dimensionWeeks?.length > 0 &&
        kpi.dimensions?.length > 0
      ) {
        let week = kpi.dimensionWeeks.find((x) => x.week == affectedRows.week);
        week?.cells.forEach((cell) => {
          cell.value = this.getSumValueForKpiWeekDimension(
            cell.formColumnId,
            kpi,
            week.week
          );
        });
      }
      if (kpi.rowTypeId == this.rowType.Details) {
        let sumOnKpiLevel = kpi.dimensionWeeks?.length > 0 ? true : false;
        kpi.cells.forEach((cell) => {
          cell.value = this.getWeeksSumValueForKpi(
            cell.formColumnId,
            kpi,
            sumOnKpiLevel
          );
        });
      }
    }
  }
  getWeeksSumValueForDimention(
    formColumnId: number,
    dimentionData: FormDimensionDataDto
  ): number {
    let value = 0;
    let isPercentage = false;
    const dimensionWeeksLength = dimentionData?.dimensionWeeks.length;
    dimentionData.dimensionWeeks?.forEach((x) => {
      value += x.cells?.find((c) => c.formColumnId == formColumnId)?.value;
      isPercentage = x.cells?.find((c) => c.formColumnId == formColumnId)
        .columnIsPercentage;
    });
    if (isPercentage && dimensionWeeksLength != undefined) {
      return (value / dimensionWeeksLength) * 100;
    } else if (dimentionData.equationTypeId == EquationType.Average) {
      return value / dimentionData.dimensionWeeks.length;
    } else if (dimentionData.equationTypeId == EquationType.Sum) {
      return value;
    } else {
      return;
    }
  }
  getWeeksSumValueForKpi(
    formColumnId: number,
    kpi: FormKPIDto,
    onKpiLevel: boolean
  ): number {
    let value = 0;
    let isPercentage = false;
    let commonLength;
    if (onKpiLevel) {
      commonLength = kpi?.dimensionWeeks.length;
      kpi.dimensionWeeks.forEach((w) => {
        value += w.cells?.find((c) => c.formColumnId == formColumnId)?.value;
        isPercentage = w.cells?.find((c) => c.formColumnId == formColumnId)
          ?.columnIsPercentage;
      });
    } else {
      debugger;
      commonLength = kpi?.dimensions?.length;
      kpi.dimensions
        ?.filter((x) => x.rowTypeId == this.rowType.Details)
        ?.forEach((d) => {
          if (d.dimensionWeeks?.length > 0) {
            value += this.getWeeksSumValueForDimention(formColumnId, d);
            isPercentage = d.cells?.find((c) => c.formColumnId == formColumnId)
              ?.columnIsPercentage;
          } else {
            value += d.cells?.find((c) => c.formColumnId == formColumnId)
              ?.value;
            isPercentage = d.cells?.find((c) => c.formColumnId == formColumnId)
              ?.columnIsPercentage;
          }
        });
    }
    if (isPercentage && commonLength) {
      value = (value / commonLength) * 100;
    } else if (kpi.equationTypeId == EquationType.Average) {
      value = value / kpi.dimensionWeeks.length;
    }
    return value;
  }
  getSumValueForKpiWeekDimension(
    formColumnId: number,
    kpi: FormKPIDto,
    week: number
  ): number {
    let value = 0;
    let isPercentage = false;
    const dimensionLength = kpi?.dimensions?.length;
    kpi.dimensions.forEach((d) => {
      let weekDimension = d.dimensionWeeks.find((x) => x.week == week);
      if (weekDimension) {
        value += weekDimension.cells?.find(
          (c) => c.formColumnId == formColumnId
        )?.value;
        isPercentage = weekDimension.cells?.find(
          (c) => c.formColumnId == formColumnId
        )?.columnIsPercentage;
      }
    });
    if (isPercentage && dimensionLength) {
      value = (value / dimensionLength) * 100;
    } else if (kpi.equationTypeId == EquationType.Average) {
      value = value / kpi.dimensionWeeks.length;
    }
    return value;
  }
  distributedDimensionData(parentIds: AffectedParentRowsIds) {
    debugger;
    if (this.weeksCalender && this.weeksCalender.length > 0) {
      let totalDaysCount = Math.max.apply(
        Math,
        this.weeksCalender.map(function (week) {
          return week.toDay;
        })
      );
      let dimensionData = this.kpis
        .find((x) => x.id == parentIds.kpiId)
        ?.dimensions.find((x) => x.id == parentIds.dimensionDataId);
      if (dimensionData) {
        let dayAmount = 0;
        let weekDaysCount = 0;
        let calenderWeek: CalenderDto = null;
        dimensionData.cells.forEach((mainCell) => {
          dayAmount = mainCell.value / totalDaysCount;
          dimensionData.dimensionWeeks.forEach((week) => {
            calenderWeek = this.weeksCalender.find((x) => x.week == week.week);
            weekDaysCount = calenderWeek?.toDay - calenderWeek?.fromDay + 1;
            week.cells.find(
              (x) => x.columnBindSource == mainCell.columnBindSource
            ).value = dayAmount * weekDaysCount;
          });
        });
        //this.updateSummaryRow(parentIds);
      }
    }
  }
  addDynamicDim(event: any) {
    debugger;
    this.kpis.forEach((element) => {
      if (element.id == event.kpiId) {
        element.dimensions.push(event.result);
      }
    });
    //this.kpis[event.kpiId].dimensions=event.result;
  }
  get structureType() {
    return FormStructureType;
  }
  deletDynamicDim(event) {
    this.kpis.forEach((element) => {
      if (element.id == event.kpiId) {
        element.dimensions.forEach((x) => {
          if (x.id == event.deltedId) {
            let deletedIndex = element.dimensions.findIndex(
              (c) => c.id == x.id
            );
            element.dimensions.splice(deletedIndex, 1);
          }
        });
        element.dimensions.push(event.result);
      }
    });

    //parentKpi.dimensions.splice(data.dimensionDataIndex, 1);
  }

  // fillDynamicDim(dynamicDims: FormDimensionWeekDto[]){
  //   console.log("xxxxxxxxxxxxx");
  //   console.log(dynamicDims);
  //  let kpiId= dynamicDims[0].parentId;
  //   let selectedKpi=this.kpis.find(x=>x.id==kpiId);
  //   let dynmDto: FormDimensionWeekDto[];
  //   dynamicDims.forEach(e => {
  //     let obj: FormDimensionWeekDto;
  //     obj.week = e.week;
  //     obj.rowTypeId = null;
  //     obj.structureTypeId = 6;
  //     obj.order = e.order;
  //     obj.week =e.week;
  //     //obj.structureId = 33;
  //     //week.cells = [];
  //     obj.parentId=e.parentId;
  //     selectedKpi.dimensionWeeks.push(obj)
  //   })
  //  // selectedKpi.dimensionWeeks.push(dynamicDims);
  // }
  get rowType() {
    return FormRowType;
  }
}
