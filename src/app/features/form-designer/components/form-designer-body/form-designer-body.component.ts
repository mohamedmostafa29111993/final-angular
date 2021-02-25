import { CopyKpisComponent } from "../copy-kpis-dialog/copy-kpis-dialog.component";
import { GlobalService } from "@shared/custom-services/global.service";
import {
  Component,
  Input,
  OnInit,
  ViewChildren,
  QueryList,
  Output,
  EventEmitter,
} from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ActivatedRoute } from "@angular/router";
import { NotifyService } from "abp-ng2-module";
import {
  FormDesignerServiceProxy,
  FormStructureColumnDto,
  FormDesignerSubSectionStructureDto,
  FormDesignerKPIDto,
  FormColumnOutputDto,
  FormDesignerDimensionDataDto,
  DimensionFormDesignerListDto,
  FormCellTypeDto,
  FormStructerDataCellDto,
  FormDimensionWeekDto,
  CreateOrUpdatePivotQueryDto,
  FormColumnCubeMappingDto,
  FormStructurePercentageDto,
  PivotConfiguration,
} from "@shared/service-proxies/service-proxies";
import { FormDesignKpiComponent } from "../form-design-kpi/form-design-kpi.component";
import { FormDesignerAddKpiDialogComponent } from "../form-designer-add-kpi-dialog/form-designer-add-kpi-dialog.component";
import { Inject, Renderer2 } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { Router } from "@angular/router";
import { FormDesignerAddMeasureDialogComponent } from "../form-designer-add-measure-dialog/form-designer-add-measure-dialog.component";
import {
  DimentionSampleOutputEmitter,
  DimentionWeekIndexs,
} from "@shared/custom-dtos/output-events-emitter-dto";
import { MppingHilightDto } from "@shared/custom-dtos/mapping-hilight-Dto";
import { FormDesignDimensionComponent } from "../form-design-dimension/form-design-dimension.component";
import { FormDesignerRowComponent } from "../form-designer-row/form-designer-row.component";
import { FormDesignerPivotControlDialogComponent } from "../form-designer-pivot-control-dialog/form-designer-pivot-control-dialog.component";
import {
  CdkDragDrop,
  moveItemInArray,
  CdkDragRelease,
} from "@angular/cdk/drag-drop";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { FormRowType } from "@shared/enums/form-row-type";
import { FormStructureType } from "@shared/enums/form-structure-type";
import { FormDesignerService } from "../../form-designer.service";

@Component({
  selector: "app-form-designer-body",
  templateUrl: "./form-designer-body.component.html",
  styleUrls: ["./form-designer-body.component.css"],
  animations: [
    trigger("animateRow", [
      state(
        "open",
        style({
          height: "auto",
        })
      ),
      state(
        "closed",
        style({
          height: 0,
        })
      ),
      transition("* <=> *", [animate(".2s")]),
    ]),
  ],
})
export class FormDesignerBodyComponent implements OnInit {
  formDesignerStructure: FormDesignerSubSectionStructureDto;
  existingformDesignerStructure: FormDesignerSubSectionStructureDto;
  targetIndex: number;
  animationState = "closed";
  @Input() inputFormSectionID: number;
  btnUp: boolean;
  colOrder: number;
  SelectedIndicatorId: string;
  appendDimensionData: FormDesignerDimensionDataDto[] = [];
  result: DimensionFormDesignerListDto[];
  isLoading: boolean;
  @ViewChildren(FormDesignKpiComponent)
  FormDesignKpiComponents: QueryList<FormDesignKpiComponent>;
  @ViewChildren(FormDesignDimensionComponent)
  FormDesignDimensionComponents: QueryList<FormDesignDimensionComponent>;
  @ViewChildren(FormDesignerRowComponent)
  FormDesignerRowComponents: QueryList<FormDesignerRowComponent>;
  FillterdColumns: FormColumnOutputDto[] = new Array<FormColumnOutputDto>();
  SelectedDataSourceMeasure: FormColumnCubeMappingDto[] = new Array<FormColumnCubeMappingDto>();
  DisableAddMeasure: boolean;
  @Output() onDataPicked: EventEmitter<{
    isSubsection: boolean;
    sectionId: number;
    data: FormDesignerSubSectionStructureDto;
  }> = new EventEmitter<{
    isSubsection: boolean;
    sectionId: number;
    data: FormDesignerSubSectionStructureDto;
  }>();
  @Output() dataIsLoaded: EventEmitter<{
    isLoaded: boolean;
  }> = new EventEmitter<{ isLoaded: boolean }>();
  cellTypes: FormCellTypeDto[];
  weekDimensionStructureId: number;
  change: boolean = false;
  formId = 0;
  pivotConfigration: any;
  pos: any;
  release: boolean = true;
  dimensionsHierarchy: { [key: string]: string[] };
  savedDimId: number;
  dimMappingResult: any;
  unmatchedData: any;
  pivotConfigurationMeasure: PivotConfiguration;
  mppingHilightDto: MppingHilightDto[] = new Array<MppingHilightDto>();
  highlightValue;
  radioStatus: boolean;
  bindSource: string[] = [
    "Required_Growth_BL",
    "BL_Growth_Achievement",
    "BP_Growth_Achievement",
    "Required_Growth_BP",
    "Actual_Growth_BL",
    "FullCapacity",
  ];
  changeablebindSource: string[] = [
    "BestPractice",
    "BaseLine",
    "Historical",
    "Actual",
    "Target",
    "Actual_Growth_BP",
  ];
  isDynamic = false;
  canAddDynamicDim = true;
  // private theBoolean: BehaviorSubject<boolean>;
  selectedEquationTypeId: number;
  selectedEquationTypeIdDimension: number;

  constructor(
    public renderer2: Renderer2,
    private _formDesignerServiceProxy: FormDesignerServiceProxy,
    private _modalService: BsModalService,
    private route: ActivatedRoute,
    public notify: NotifyService,
    @Inject(DOCUMENT) document,
    r: Renderer2,
    private router: Router,
    private formDesignerService: FormDesignerServiceProxy,
    public global: GlobalService,
    private formDesignerDataService: FormDesignerService
  ) {
    if (this.router.url == "/app/form-design/17") {
      r.addClass(document.body, "hide-side-nav");
    }
    this.cellTypes = [];
    // this.theBoolean = new BehaviorSubject<boolean>(false);
  }
  ngAfterViewInit() {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.formId = +params.get("formId");
    });

    this.getCellTypes();
    this.getWeekDimensionStructureId();
  }

  ngDoCheck(): void {}
  getFormDesign(
    formId: number,
    isSubsection: boolean,
    sectionId: number,
    isDel: boolean
  ): any {
    // ;
    //this.isLoading = true;
    this.global.isAllLoading = true;
    this.dataIsLoaded.next({ isLoaded: true });
    if (!isDel) {
      this.formDesignerStructure = new FormDesignerSubSectionStructureDto();
    }
    this._formDesignerServiceProxy
      .getFormStructureBySubSectionId(formId, isSubsection, sectionId)
      .subscribe((data) => {
        //check when delete Sectiion or subsection
        this.global.formDesignerSubSection = data;
        if (isDel) {
          if (this.formDesignerStructure.id != data.id) {
            this.formDesignerStructure = data;
          }
          this.onDataPicked.next({
            isSubsection: isSubsection,
            sectionId: sectionId,
            data: data,
          });
        } else {
          this.formDesignerStructure = data;
          this.formDesignerStructure.columns.sort((a, b) =>
            a.order > b.order ? 1 : -1
          );

          this.formDesignerStructure.kpis?.forEach((indicator) => {
            indicator.columns?.sort((a, b) => (a.order > b.order ? 1 : -1));
          });
          // this.global.formDesignerObject =this.formDesignerStructure;
          this.GetAllCoulmns();
        }
        if (isSubsection && sectionId > 0) {
          this._formDesignerServiceProxy
            .getFormDataSource(formId, sectionId)
            .subscribe((res) => {
              //
              this.pivotConfigration = res.pivotConfiguration;
              this.dimensionsHierarchy = res.dimensionsHierarchy;
              this.formDesignerDataService.dimensionsHierarchy = this.dimensionsHierarchy;
            });
        }
        //  this.isLoading = false;
        this.global.isAllLoading = false;
        this.global.subSectionHasKPI = this.formDesignerStructure?.kpis
          ? true
          : false;
        this.existingformDesignerStructure = this.formDesignerStructure;
        this.dataIsLoaded.next({ isLoaded: false });
        data.kpis?.forEach((element) => {
          if (element.dimensions) {
            element.dimensions.forEach((x) => {
              if (x.structureTypeId != FormStructureType.DynamicDimension) {
                this.canAddDynamicDim = false;
                return;
              } else {
                this.canAddDynamicDim = true;
              }
            });
          } else {
            this.canAddDynamicDim = true;
          }
        });

        if (data.structureTypeId == FormStructureType.DynamicDimension) {
          this.isDynamic = true;
        } else {
          this.isDynamic = false;
        }
        return true;
      });
  }

  saveObject() {
    debugger;
    // this.isLoading=true;
    this.global.isAllLoading = true;
    this.formDesignerStructure.columns.forEach((col) => {
      col.order = +col.order;
    });
    if (
      this.formDesignerStructure.kpis &&
      this.formDesignerStructure.kpis.length > 0
    ) {
      this.formDesignerStructure.kpis.forEach((KPI) => {
        KPI.order = this.formDesignerStructure.kpis.indexOf(KPI) + 1;
        if (KPI.dimensions && KPI.dimensions.length > 0) {
          KPI.dimensions.forEach((dim) => {
            dim.order = KPI.dimensions.indexOf(dim) + 1;
          });
        }
      });
    }

    //  this.global.formDesignerObject =this.formDesignerStructure;
    this._formDesignerServiceProxy
      .saveFormDesignerMetaData(this.formDesignerStructure)
      .subscribe((res) => {
        if (res) {
          if (this.unmatchedData) {
            abp.message.error(
              "Can't delete sub section you must delete Data at first  ",
              undefined,
              (result: boolean) => {}
            );
          }
          this.formDesignerStructure = res;
          //  this.isLoading=false;
          this.global.isAllLoading = false;

          this.notify.success("Data Saved Successfully");
        } else {
          this.notify.error("Data not Saved");
        }
      });

    if (this.formDesignerStructure === this.existingformDesignerStructure) {
      this.global.subSectionHasKPI = true;
    }
  }

  openPopupKPI() {
    if (!this.formDesignerStructure) {
      abp.message.error(
        "Invalid Form Structure !",
        undefined,
        (result: boolean) => {}
      );
    } else {
      if (this.formDesignerStructure.kpis == null) {
        this.formDesignerStructure.kpis = new Array<FormDesignerKPIDto>();
      }
      let addKPIDialog: BsModalRef;
      addKPIDialog = this._modalService.show(
        FormDesignerAddKpiDialogComponent,
        {
          class: "modal-sm modal-dialog-centered",
          backdrop: "static",
          initialState: {
            FormStructure: this.formDesignerStructure,
          },
        }
      );
      addKPIDialog.content.onSave.subscribe((res) => {
        debugger;
        res.forEach((kpi: FormDesignerKPIDto) => {
          kpi.cells = this.AddKpiCells();
          this.formDesignerStructure.columns.forEach((col) => {
            col.isPercentage = false;
          });
          kpi.columns = this.formDesignerStructure.columns;
          kpi.colCubeMapping = [];
          kpi.struturePercentages = [];
          for (let i = 0; i < kpi.columns.length; i++) {
            if (
              kpi.columns[i].bindSource ==
              this.bindSource.find((a) => a == kpi.columns[i].bindSource)
            ) {
              kpi.columns[i].isPercentage = true;
              var columnId = kpi.columns[i].columnStructureId;
              let obj = this.setIsPercentageValue(columnId);
              kpi.struturePercentages.push(obj);
            }
          }
          this.formDesignerStructure.kpis.push(kpi);

          //this.global.formDesignerObject.kpis.push(kpi);
        });
      });
    }
  }

  setIsPercentageValue(columnId: number) {
    let structurePercentage = new FormStructurePercentageDto();
    structurePercentage.formStructureColumnId = columnId;
    structurePercentage.formStructureRowId = 0;
    structurePercentage.isPercentage = true;
    return structurePercentage;
  }

  deleteKPI(kpiIndex: any) {
    let kpiId = this.formDesignerStructure.kpis[kpiIndex].id;
    let kpititle = this.formDesignerStructure.kpis[kpiIndex].title;
    abp.message.confirm(
      "Are you sure you want to delete this KPI (" +
        kpititle +
        ") and all Contents ?",
      undefined,
      (result: boolean) => {
        if (result) {
          //  ;
          if (
            this.formDesignerStructure.kpis[kpiIndex].weeks &&
            this.formDesignerStructure.kpis[kpiIndex].weeks.length > 0
          ) {
            this.formDesignerStructure.kpis[kpiIndex].weeks.forEach(
              (week, i) => {
                let WeekData = new DimentionWeekIndexs();
                WeekData.dimensionWeekIndex = i;
                WeekData.parentDimensionDataIndex = -1;
                WeekData.parentKpiIndex = kpiIndex;
                this.deleteWeekDimension(WeekData);
              }
            );
          }

          if (
            this.formDesignerStructure.kpis[kpiIndex].dimensions &&
            this.formDesignerStructure.kpis[kpiIndex].dimensions.length > 0
          ) {
            this.formDesignerStructure.kpis[kpiIndex].dimensions.forEach(
              (dimension) => {
                let dimensionDataIndex = this.formDesignerStructure.kpis[
                  kpiIndex
                ].dimensions.indexOf(dimension);
                let KpiDataIndex = kpiIndex;
                let DimensionData = {
                  dimensionDataIndex: dimensionDataIndex,
                  kpiIndex: KpiDataIndex,
                };
                this.deleteDimensionData(DimensionData);
              }
            );
          }
          if (
            this.formDesignerStructure.kpis[kpiIndex].columns &&
            this.formDesignerStructure.kpis[kpiIndex].columns.length > 0
          ) {
            this.formDesignerStructure.kpis[kpiIndex].columns = [];
          }
          if (
            this.formDesignerStructure.kpis[kpiIndex].colCubeMapping &&
            this.formDesignerStructure.kpis[kpiIndex].colCubeMapping.length > 0
          ) {
            this.formDesignerStructure.kpis[kpiIndex].colCubeMapping = [];
          }

          if (kpiId > 0) {
            this.formDesignerStructure.kpis[kpiIndex].isDeleted = true;
            this.formDesignerStructure.kpis[kpiIndex].cells.forEach(
              (KpiCell) => {
                if (KpiCell.structureId > 0) {
                  KpiCell.isDeleted = true;
                } else {
                  let CellIndex = this.formDesignerStructure.kpis[
                    kpiIndex
                  ].cells.indexOf(KpiCell);
                  this.formDesignerStructure.kpis[kpiIndex].cells.splice(
                    CellIndex,
                    1
                  );
                }
              }
            );
          } else {
            this.formDesignerStructure.kpis.splice(kpiIndex, 1);
          }
          this.notify.success("KPI deleted Successfully");
        }
      }
    );
  }
  addDimentions(indicatorDimentions: any) {
    this.result = indicatorDimentions.result;
    let mapped = this.result.map(function (obj) {
      let dim = new FormDesignerDimensionDataDto();
      dim.structureId = obj.id;
      dim.title = obj.title;
      return dim;
    });
    if (
      this.formDesignerStructure.kpis[indicatorDimentions.indicatorIndex]
        .dimensions == undefined
    ) {
      this.formDesignerStructure.kpis[
        indicatorDimentions.indicatorIndex
      ].dimensions = [];
    }

    // this.deleteDimentionSample(indicatorDimentions.indicatorIndex);

    mapped.forEach((dim) =>
      this.formDesignerStructure.kpis[
        indicatorDimentions.indicatorIndex
      ].dimensions.push(dim)
    );

    this.notify.success("Dimension added Successfully");
  }

  addDimentionSample(object: DimentionSampleOutputEmitter) {
    this._formDesignerServiceProxy
      .getDimentionSampleByDimentionTypeId(object.DimTypeId, object.KpiId)
      .subscribe((Response) => {
        let dim = new FormDesignerDimensionDataDto();
        dim.dimTypeId = Response.dimentionTypeId;
        dim.dimensionWeeks = Response.weeks;
        dim.isDeleted = Response.isDeleted;
        dim.isLeaf = Response.isLeaf;
        dim.order = Response.order;
        dim.parentId = Response.parentId;
        dim.structureId = Response.structureId;
        dim.structureTypeId = Response.structureTypeId;
        dim.title = Response.title;
        dim.rowTypeId = FormRowType.Details;

        let dimArray: FormDesignerDimensionDataDto[] = [];
        dimArray.push(dim);

        if (!this.formDesignerStructure.kpis[object.KpiIndex].dimensions) {
          this.formDesignerStructure.kpis[object.KpiIndex].dimensions = [];
        }

        // this.formDesignerStructure.kpis[object.KpiIndex].dimensions.map(
        //   (_, i) => {
        //     this.deleteDimensionData({
        //       kpiIndex: object.KpiIndex,
        //       dimensionDataIndex: i,
        //     });
        //   }
        // );

        // if (this.formDesignerStructure.kpis[object.KpiIndex].dimensions.length > 0) {
        //   for (let i = 0; i < this.formDesignerStructure.kpis[object.KpiIndex].dimensions.length; i++) {
        //     this.deleteDimensionData({
        //       kpiIndex: object.KpiIndex,
        //       dimensionDataIndex: i,
        //     });
        //   }
        // }

        // if (this.formDesignerStructure.kpis[object.KpiIndex].weeks.length > 0) {
        //   for (let i = 0; i < this.formDesignerStructure.kpis[object.KpiIndex].weeks.length; i++) {
        //     let week = this.formDesignerStructure.kpis[object.KpiIndex].weeks[i];
        //     let WeekData = new DimentionWeekIndexs();
        //     WeekData.dimensionWeekIndex = i;
        //     WeekData.parentDimensionDataIndex = -1;
        //     WeekData.parentKpiIndex = object.KpiIndex;
        //     this.deleteWeekDimension(WeekData);

        //     i = week.id ? i :  i - 1;
        //   }
        // }

        this.formDesignerStructure.kpis[object.KpiIndex].dimensions.push(dim);
      });
  }

  deleteDimentionSample(kpiIndex) {
    if (this.formDesignerStructure.kpis[kpiIndex].dimensions) {
      this.formDesignerStructure.kpis[kpiIndex].dimensions.map((elem, i) => {
        if (elem.dimTypeId) {
          this.deleteDimensionData({
            kpiIndex: kpiIndex,
            dimensionDataIndex: i,
          });
        }
      });
    }
  }

  selectedIndicator(indicatorId) {
    //     this.SelectedIndicatorId=indicatorId;
    //     this.FormDesignKpiComponents.forEach(c=>c.SelectedIndicatorId=this.SelectedIndicatorId);
    //     console.log("id  "+indicatorId+"  hhh  "+this.SelectedIndicatorId);
  }
  changeBtnUp(order) {
    if (this.colOrder == 0) {
      this.colOrder = order;
    } else {
      if (this.colOrder == order) this.colOrder = 0;
      else this.colOrder = order;
    }
  }
  openPopupMeasure() {
    this.formDesignerStructure.columns.forEach((col) => {
      col.order = +col.order;
    });
    if (!this.formDesignerStructure) {
      abp.message.error(
        "Invalid Form Structure !",
        undefined,
        (result: boolean) => {}
      );
    } else {
      if (this.formDesignerStructure.columns == null) {
        this.formDesignerStructure.columns = new Array<FormStructureColumnDto>();
      }
      let addMeasureDialog: BsModalRef;
      addMeasureDialog = this._modalService.show(
        FormDesignerAddMeasureDialogComponent,
        {
          class: "modal-sm modal-dialog-centered",
          backdrop: "static",
          initialState: {
            Columns: this.FillterdColumns,
            FormStructure: this.formDesignerStructure,
          },
        }
      );
      addMeasureDialog.content.onSave.subscribe((res) => {
        res.forEach((Column) => {
          this.formDesignerStructure.columns.push(Column);
          if (
            this.formDesignerStructure.kpis != undefined &&
            this.formDesignerStructure.kpis.length > 0
          ) {
            this.formDesignerStructure.kpis.forEach((kpi) => {
              if (kpi.columns == undefined) {
                kpi.columns = [];
              }

              kpi.columns = this.formDesignerStructure.columns;
            });
          }

          this.AddMeasureCells(Column);
          this.GetAllCoulmns();
          this.ReFillAllCells();
        });
      });
    }
  }
  // copy kpis modal
  openCopyKpisModal(
    title = "Copy Kpis",
    type = "CopyAsKPI",
    parentId = this.formDesignerStructure.id,
    percentages?
  ) {
    if (!this.formDesignerStructure) {
      abp.message.error(
        "Invalid Form Structure !",
        undefined,
        (result: boolean) => {}
      );
    } else {
      let copySumKpis: BsModalRef;
      copySumKpis = this._modalService.show(CopyKpisComponent, {
        class: "modal-xl modal-dialog-centered",
        backdrop: "static",
        initialState: {
          FormStructure: this.formDesignerStructure,
          title: title,
          type: type,
          parentId: parentId,
          percentages: percentages,
        },
      });

      copySumKpis.content.CopySumRes.subscribe((res: any[]) => {
        if (type === "CopyAsKPI" && !this.formDesignerStructure.kpis) {
          this.formDesignerStructure.kpis = [];
        }
        if (
          type === "CopyAsDimension" &&
          !this.formDesignerStructure.kpis.find((kpi) => kpi.id === parentId)
            ?.dimensions
        ) {
          this.formDesignerStructure.kpis.find(
            (kpi) => kpi.id === parentId
          ).dimensions = [];
        }
        // res.forEach((kpi, i) => {
        //   res[i].cells = this.formDesignerDataService.fillCells(this.formDesignerStructure.columns, kpi.columns)
        // })
        type == "CopyAsKPI"
          ? this.formDesignerStructure.kpis.push(...res)
          : type == "CopyAsDimension"
          ? this.formDesignerStructure.kpis
              .find((kpi) => kpi.id === parentId)
              .dimensions.push(...res)
          : null;
        copySumKpis.hide();
      });
    }
  }

  GetAllCoulmns() {
    this.FillterdColumns = [];
    this._formDesignerServiceProxy.getAllMeasure().subscribe((res) => {
      this.FillterdColumns = res;
      let yFilter = this.formDesignerStructure.columns
        .filter((x) => x.isDeleted == false)
        .map((itemY) => {
          return itemY.columnStructureId;
        });
      this.FillterdColumns = this.FillterdColumns.filter(
        (itemX) => !yFilter.includes(itemX.id)
      );
      this.DisableAddMeasure = this.FillterdColumns.length > 0 ? false : true;
    });
  }
  DeleteMeasure(data: any) {
    const columnIndex = this.formDesignerStructure.columns?.findIndex(
      (c) => c.columnStructureId === data
    );

    let ColumnId = this.formDesignerStructure.columns.find(
      (f) => f.columnStructureId == data && f.isDeleted == false
    ).id;
    let ColumnIndex = this.formDesignerStructure.columns.indexOf(
      this.formDesignerStructure.columns.find(
        (f) => f.columnStructureId == data && f.isDeleted == false
      )
    );
    let Columntitle = this.formDesignerStructure.columns.find(
      (f) => f.columnStructureId == data && f.isDeleted == false
    ).header;

    abp.message.confirm(
      "Are you sure you want to delete this Measure (" + Columntitle + ") ?",
      undefined,
      (result: boolean) => {
        if (result) {
          this.RemoveMeasureCells(
            this.formDesignerStructure.columns.find(
              (f) => f.columnStructureId == data && f.isDeleted == false
            ).bindSource
          );
          moveItemInArray(
            this.formDesignerStructure.columns,
            columnIndex,
            this.formDesignerStructure.columns.length - 1
          );
          this.ShiftOrderColumns(
            this.formDesignerStructure.columns.find(
              (f) => f.columnStructureId == data && f.isDeleted == false
            ).order
          );
          this.formDesignerStructure.kpis?.forEach((kpi, i) => {
            const column = kpi.columns?.find(
              (c) => c.columnStructureId === data
            );
            // delete kpi columns
            // set isDeleted equal true if the column saved
            if (column?.id > 0) {
              let kpiColumn = this.formDesignerStructure.kpis[i].columns;
              kpiColumn[columnIndex].isDeleted = true;
              moveItemInArray(kpiColumn, columnIndex, kpiColumn.length - 1);
              kpiColumn = [...kpiColumn];
              this.formDesignerStructure.kpis[i]?.columns?.forEach(
                (c, index) => {
                  const t = kpiColumn[index];
                  t.order = this.formDesignerStructure.columns.find(
                    (c) => c.bindSource === t.bindSource
                  ).order;
                }
              );
            } else {
              // splice item from array
              this.formDesignerStructure.kpis[i].columns = kpi.columns.splice(
                columnIndex,
                1
              );
              this.formDesignerStructure.kpis[i].columns.forEach((c, index) => {
                this.formDesignerStructure.kpis[i].columns[
                  index
                ].order = index++;
              });
            }
            // delete kpi cells
            let kpi_cells = this.formDesignerStructure.kpis[i].cells;
            if (kpi_cells) {
              kpi_cells.find((c, i) => i == columnIndex).isDeleted = true;
              moveItemInArray(kpi_cells, columnIndex, kpi_cells.length - 1);
              this.formDesignerStructure.kpis[i].cells = [...kpi_cells];
            }
            // delete dimensions cells
            if (this.formDesignerStructure.kpis[i].dimensions) {
              this.formDesignerStructure.kpis[i].dimensions.forEach(
                (d, index) => {
                  let d_cells = this.formDesignerStructure.kpis[i].dimensions[
                    index
                  ].cells;
                  if (d_cells) {
                    d_cells.find((c, i) => i == columnIndex).isDeleted = true;
                    moveItemInArray(d_cells, columnIndex, d_cells.length - 1);
                    d_cells = [...d_cells];
                  }
                  this.formDesignerStructure.kpis[i].dimensions[
                    index
                  ].dimensionWeeks?.forEach((w, ii) => {
                    let dw_cells = this.formDesignerStructure.kpis[i]
                      .dimensions[index].dimensionWeeks[ii].cells;
                    if (dw_cells) {
                      dw_cells.find(
                        (c, i) => i == columnIndex
                      ).isDeleted = true;
                      moveItemInArray(
                        dw_cells,
                        columnIndex,
                        dw_cells.length - 1
                      );
                      dw_cells = [...dw_cells];
                    }
                  });
                }
              );
            }
            if (this.formDesignerStructure.kpis[i].weeks) {
              this.formDesignerStructure.kpis[i].weeks.forEach((w, index) => {
                let kpi_week_cells = this.formDesignerStructure.kpis[i].weeks[
                  index
                ].cells;
                if (kpi_week_cells) {
                  kpi_week_cells.find(
                    (c, i) => i == columnIndex
                  ).isDeleted = true;
                  moveItemInArray(
                    kpi_week_cells,
                    columnIndex,
                    kpi_week_cells.length - 1
                  );
                  kpi_cells = [...kpi_cells];
                }
              });
            }
          });
          //  ;
          // this.DeleteKPIColumn(this.formDesignerStructure.columns.find(f=>f.columnStructureId==data).bindSource);
          if (ColumnId > 0) {
            this.formDesignerStructure.columns.find(
              (f) => f.columnStructureId == data && f.isDeleted == false
            ).order = 0;
            this.formDesignerStructure.columns.find(
              (f) => f.columnStructureId == data && f.isDeleted == false
            ).isDeleted = true;
            var col = this.formDesignerStructure.columns.find(
              (f) => f.columnStructureId == data
            ).id;

            this.formDesignerStructure?.kpis?.forEach((kpi) => {
              if (
                kpi.colCubeMapping.find((x) => x.formStructureColumnId == col)
              ) {
                kpi.colCubeMapping.find(
                  (x) => x.formStructureColumnId == col
                ).isDeleted = true;
              }
            });
          } else {
            this.formDesignerStructure.columns.splice(ColumnIndex, 1);
          }
          this.notify.success("Measure deleted Successfully");
          this.GetAllCoulmns();
          this.ReFillAllCells();
        }
      }
    );
  }

  //   DeleteKPIColumn(KpiColbindSource:any){
  // if( this.formDesignerStructure.kpis &&  this.formDesignerStructure.kpis.length >0)
  //   {

  //     this.formDesignerStructure.kpis.forEach(kpi => {
  //       let kpiIndex=kpi.columns.findIndex(f=>f.bindSource==KpiColbindSource);
  //       kpi.columns.splice(kpiIndex,1);
  //     });
  //   }
  //   }
  openDeleteWeekDimentionPopup(data: DimentionWeekIndexs) {
    abp.message.confirm(
      "Are you sure you want to delete this Week ?",
      undefined,
      (result: boolean) => {
        if (result) {
          let result = this.deleteWeekDimension(data);
          if (result) {
            this.notify.success("Week Dimention deleted Successfully");
          } else {
            this.notify.error("An error occurred");
          }
        }
      }
    );
  }

  deleteWeekDimension(data: DimentionWeekIndexs): boolean {
    //
    let result = false;
    if (data.dimensionWeekIndex >= 0) {
      if (data.parentKpiIndex >= 0) {
        let kpi = this.formDesignerStructure.kpis[data.parentKpiIndex];
        if (data.parentDimensionDataIndex >= 0) {
          let week =
            kpi.dimensions[data.parentDimensionDataIndex].dimensionWeeks[
              data.dimensionWeekIndex
            ];
          if (week.id > 0) {
            week.isDeleted = true;
            this.deleteWeekDimensionCells(week);
          } else {
            kpi.dimensions[data.parentDimensionDataIndex].dimensionWeeks.splice(
              data.dimensionWeekIndex,
              1
            );
          }
        } else {
          let week = kpi.weeks[data.dimensionWeekIndex];
          if (week.id > 0) {
            week.isDeleted = true;
            this.deleteWeekDimensionCells(week);
          } else {
            kpi.weeks.splice(data.dimensionWeekIndex, 1);
          }
        }
        result = true;
      }
    }
    return result;
  }

  deleteWeekDimensionCells(week: FormDimensionWeekDto) {
    week.cells.forEach((cell, i) => {
      if (cell.structureId > 0) {
        cell.isDeleted = true;
      } else {
        week.cells.splice(i, 1);
      }
    });
  }

  getCellTypes() {
    this._formDesignerServiceProxy.getCellTypes().subscribe((data) => {
      this.cellTypes = data;
    });
  }

  OpenDeleteDimensionDialog(data) {
    abp.message.confirm(
      "Are you sure you want to delete this Dimension ?",
      undefined,
      (result: boolean) => {
        if (result) {
          let result = this.deleteDimensionData(data);
          if (result) {
            this.notify.success("Dimention deleted Successfully");
          } else {
            this.notify.error("An error occurred");
          }
        }
      }
    );
  }

  deleteDimensionData(data): boolean {
    let result = false;
    if (data.kpiIndex >= 0 && data.dimensionDataIndex >= 0) {
      let parentKpi = this.formDesignerStructure.kpis[data.kpiIndex];
      if (
        parentKpi.dimensions != undefined &&
        parentKpi.dimensions.length >= 0
      ) {
        let dimRow = parentKpi.dimensions[data.dimensionDataIndex];
        if (dimRow.id > 0) {
          this.deleteKpiDimensionData(dimRow);
        } else {
          parentKpi.dimensions.splice(data.dimensionDataIndex, 1);
        }
        result = true;
      }
    }
    return result;
  }

  deleteKpiDimensionData(dimRow: FormDesignerDimensionDataDto) {
    let self = this;
    dimRow.isDeleted = true;
    // delete mapped object if exists
    if (dimRow?.dimensionCubMapping?.id > 0) {
      dimRow.dimensionCubMapping.isDeleted = true;
    }
    // delete dimensions cells if exist
    if (dimRow.cells != null && dimRow.cells.length > 0) {
      dimRow.cells.forEach((cell, i) => {
        if (cell.structureId > 0) {
          cell.isDeleted = true;
        } else {
          //dimRow.cells.splice(i, 1);
          dimRow.cells = [];
        }
      });
    }
    // delete week dimensions if exist
    if (dimRow.dimensionWeeks != null && dimRow.dimensionWeeks.length > 0) {
      let weeks = dimRow.dimensionWeeks;
      weeks.forEach((week, i) => {
        //  let k = i;

        if (week.id > 0) {
          week.isDeleted = true;
        } else {
          dimRow.dimensionWeeks = [];
        }
        self.deleteWeekDimensionCells(week);
      });
    }
  }

  getWeekDimensionStructureId() {
    this.formDesignerService.getStructureWeekDimensioId().subscribe((data) => {
      this.weekDimensionStructureId = data;
    });
  }

  AddMeasureCells(Column: any) {
    //  ;
    if (
      this.formDesignerStructure.kpis &&
      this.formDesignerStructure.kpis.length > 0
    ) {
      this.formDesignerStructure.kpis.forEach((Kpi) => {
        Kpi.cells = Kpi.cells
          ? Kpi.cells
          : new Array<FormStructerDataCellDto>();
        let Kpicell = new FormStructerDataCellDto();
        Kpicell = this.PrepareCellObject(Column, Kpi.id);
        Kpi.cells.push(Kpicell);

        if (Kpi.weeks && Kpi.weeks.length > 0) {
          Kpi.weeks.forEach((week) => {
            week.cells = week.cells
              ? week.cells
              : new Array<FormStructerDataCellDto>();
            let Weekcell = new FormStructerDataCellDto();
            Weekcell = this.PrepareCellObject(Column, week.id);
            week.cells.push(Weekcell);
          });
        }
        if (Kpi.dimensions && Kpi.dimensions.length > 0) {
          //  ;
          Kpi.dimensions.forEach((dim) => {
            dim.cells = dim.cells
              ? dim.cells
              : new Array<FormStructerDataCellDto>();
            let Dimcell = new FormStructerDataCellDto();
            Dimcell = this.PrepareCellObject(Column, dim.id);
            dim.cells.push(Dimcell);

            if (dim.dimensionWeeks && dim.dimensionWeeks.length > 0) {
              //  ;
              dim.dimensionWeeks.forEach((week) => {
                week.cells = week.cells
                  ? week.cells
                  : new Array<FormStructerDataCellDto>();
                let DimWeekcell = new FormStructerDataCellDto();
                DimWeekcell = this.PrepareCellObject(Column, week.id);
                week.cells.push(DimWeekcell);
              });
            }
          });
        }
      });
    }
  }

  PrepareCellObject(
    Column: FormStructureColumnDto,
    formRowId: number
  ): FormStructerDataCellDto {
    //   ;
    let cell = new FormStructerDataCellDto();
    cell.columnBindSource = Column.bindSource;
    cell.columnHeader = Column.header;
    cell.dataId = 0;
    cell.formColumnId = 0;
    cell.structureId = 0;
    cell.typeId = 1;
    cell.formRowId = formRowId;
    cell.isDeleted = false;
    return cell;
  }

  AddKpiCells(): FormStructerDataCellDto[] {
    //
    let cells = new Array<FormStructerDataCellDto>();
    if (
      this.formDesignerStructure.columns &&
      this.formDesignerStructure.columns.length > 0
    ) {
      this.formDesignerStructure.columns.forEach((column) => {
        let cell = new FormStructerDataCellDto();
        cell = this.PrepareCellObject(column, 0);
        cells.push(cell);
      });
    }
    return cells;
  }

  RemoveMeasureCells(columnBindSource: string) {
    if (
      this.formDesignerStructure.kpis &&
      this.formDesignerStructure.kpis.filter((x) => x.isDeleted == false)
        .length > 0
    ) {
      this.formDesignerStructure.kpis
        .filter((x) => x.isDeleted == false)
        .forEach((Kpi) => {
          if (Kpi.cells && Kpi.cells.length > 0) {
            if (
              Kpi.cells
                .filter((x) => x.isDeleted == false)
                .find((x) => x.columnBindSource == columnBindSource)
                .structureId > 0
            ) {
              Kpi.cells
                .filter((x) => x.isDeleted == false)
                .find(
                  (x) => x.columnBindSource == columnBindSource
                ).isDeleted = true;
            } else {
              let CellIndex = Kpi.cells.indexOf(
                Kpi.cells.find(
                  (x) =>
                    x.columnBindSource == columnBindSource && x.structureId == 0
                )
              );
              Kpi.cells.splice(CellIndex, 1);
            }
          }
          if (
            Kpi.weeks &&
            Kpi.weeks.filter((x) => x.isDeleted == false).length > 0
          ) {
            Kpi.weeks
              .filter((x) => x.isDeleted == false)
              .forEach((week) => {
                if (week.cells && week.cells.length > 0) {
                  if (
                    week.cells
                      .filter((x) => x.isDeleted == false)
                      .find((x) => x.columnBindSource == columnBindSource)
                      .structureId > 0
                  ) {
                    week.cells
                      .filter((x) => x.isDeleted == false)
                      .find(
                        (x) => x.columnBindSource == columnBindSource
                      ).isDeleted = true;
                  } else {
                    let CellIndex = week.cells.indexOf(
                      week.cells.find(
                        (x) =>
                          x.columnBindSource == columnBindSource &&
                          x.structureId == 0
                      )
                    );
                    week.cells.splice(CellIndex, 1);
                  }
                }
              });
          }
          if (
            Kpi.dimensions &&
            Kpi.dimensions.filter((x) => x.isDeleted == false).length > 0
          ) {
            Kpi.dimensions
              .filter((x) => x.isDeleted == false)
              .forEach((dim) => {
                if (dim.cells && dim.cells.length > 0) {
                  if (
                    dim.cells
                      .filter((x) => x.isDeleted == false)
                      .find((x) => x.columnBindSource == columnBindSource)
                      .structureId > 0
                  ) {
                    dim.cells
                      .filter((x) => x.isDeleted == false)
                      .find(
                        (x) => x.columnBindSource == columnBindSource
                      ).isDeleted = true;
                  } else {
                    let CellIndex = dim.cells.indexOf(
                      dim.cells.find(
                        (x) =>
                          x.columnBindSource == columnBindSource &&
                          x.structureId == 0
                      )
                    );
                    dim.cells.splice(CellIndex, 1);
                  }
                }
                if (
                  dim.dimensionWeeks &&
                  dim.dimensionWeeks.filter((x) => x.isDeleted == false)
                    .length > 0
                ) {
                  dim.dimensionWeeks
                    .filter((x) => x.isDeleted == false)
                    .forEach((week) => {
                      if (week.cells && week.cells.length > 0) {
                        if (
                          week.cells
                            .filter((x) => x.isDeleted == false)
                            .find((x) => x.columnBindSource == columnBindSource)
                            .structureId > 0
                        ) {
                          week.cells
                            .filter((x) => x.isDeleted == false)
                            .find(
                              (x) => x.columnBindSource == columnBindSource
                            ).isDeleted = true;
                        } else {
                          let CellIndex = week.cells.indexOf(
                            week.cells.find(
                              (x) =>
                                x.columnBindSource == columnBindSource &&
                                x.structureId == 0
                            )
                          );
                          week.cells.splice(CellIndex, 1);
                        }
                      }
                    });
                }
              });
          }
        });
    }
  }

  ShiftOrderColumns(order: any) {
    order = +order;

    //let i=1;
    this.formDesignerStructure.columns
      .filter((x) => x.isDeleted == false && x.order > order)
      .forEach((column) => (column.order -= 1));
  }

  ChangeOrder(order: any, column: FormStructureColumnDto, input: any) {
    if (
      order.trim() == "" ||
      order <= 0 ||
      order >
        this.formDesignerStructure.columns.filter((x) => !x.isDeleted).length
    ) {
      order = column.order;
      order =
        typeof this.formDesignerStructure.columns.find(
          (x) => x.bindSource == column.bindSource
        ).order == "string"
          ? +order
          : order.toString();
    }
    this.formDesignerStructure.columns.find(
      (x) => x.order == order && x.isDeleted == false
    ).order = column.order;
    this.formDesignerStructure.columns.find(
      (x) => x.bindSource == column.bindSource && x.isDeleted == false
    ).order = order;
  }

  ReFillAllCells() {
    this.FormDesignKpiComponents.forEach((Kpi) => Kpi.fillCells());
    this.FormDesignDimensionComponents.forEach((Dim) => Dim.fillCells());
    this.FormDesignerRowComponents.forEach((week) => week.fillCells());
  }

  openPivotDialog() {
    let pivotDialog: BsModalRef;
    pivotDialog = this._modalService.show(
      FormDesignerPivotControlDialogComponent,
      {
        class: "modal-xl pivot-control-modal",
        backdrop: "static",
        initialState: {
          formId: this.formId,
          formStructureRowId: this.formDesignerStructure.id, // subSection
        },
      }
    );
    pivotDialog.content.savePivotConfig.subscribe(
      (res: CreateOrUpdatePivotQueryDto) => {
        //
        this.pivotConfigration = res.pivotConfig;
        this.dimensionsHierarchy = res.dimensionsHierarchy;
        this.formDesignerDataService.dimensionsHierarchy = this.dimensionsHierarchy;
        this.unmatchedDataSource();
        if (this.unmatchedDataSource().length) {
          this.notify.error("Mapping to this Column dropped");
        }

        pivotDialog.hide();
      }
    );
  }

  public unmatchedDataSource(): any[] {
    this.mppingHilightDto = [];
    this.formDesignerStructure?.kpis?.forEach((kpi) => {
      kpi?.colCubeMapping?.forEach((colMapping) => {
        if (!colMapping.isDeleted) {
          this.unmatchedData = this.pivotConfigration?.measures?.find(
            (x) => x.name == colMapping.selector?.trim()
          );
          if (this.unmatchedData == undefined) {
            let obj = new MppingHilightDto();
            obj.kpiId = kpi.id;
            obj.MappingId = colMapping.id;
            obj.ColId = colMapping.formStructureColumnId;
            obj.rowId = colMapping.formStructureRowId;
            obj.BindingSource = colMapping.mainBindingSource;
            obj.Selector = colMapping.selector;
            this.mppingHilightDto.push(obj);
            // this.notify.error("Mapping to this Column dropped");
          }
        }
      });
    });

    return this.mppingHilightDto;
  }

  checkColMpped(
    kpiobj: FormDesignerKPIDto,
    columnObj: FormStructureColumnDto
  ): boolean {
    let mappedflag = false;
    if (kpiobj.colCubeMapping && kpiobj.colCubeMapping.length > 0) {
      const mappedobj = kpiobj.colCubeMapping.find(
        (x) => x.mainBindingSource == columnObj.bindSource && !x.isDeleted
      );
      let unmapped = this.mppingHilightDto.find(
        (x) =>
          x.ColId == columnObj.id &&
          x.BindingSource == columnObj.bindSource &&
          x.kpiId == kpiobj.id
      );
      if (mappedobj && unmapped == undefined) {
        mappedflag = true;
      }
      return mappedflag;
    }
    return mappedflag;
  }

  GetSelectedMeasure(formColumnId: number, kpiId: number): boolean {
    let flag = false;
    if (formColumnId > 0) {
      this._formDesignerServiceProxy
        .getSelectedColumnBindingDataSource(formColumnId, kpiId)
        .subscribe((res) => {
          if (res) {
            res.selector;
            flag = true;
          }
        });
    }
    return flag;
  }

  // drag and drop methods
  dropCol(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.formDesignerStructure.columns,
      event.previousIndex,
      event.currentIndex
    );
    this.formDesignerStructure.columns.forEach(
      (column, index) =>
        (this.formDesignerStructure.columns[index].order = index + 1)
    );
    this.formDesignerStructure?.columns?.sort((x) => x.order);
    this.formDesignerStructure?.kpis?.forEach((indicator) => {
      indicator.id > 0
        ? indicator.columns
          ? moveItemInArray(
              indicator.columns,
              event.previousIndex,
              event.currentIndex
            )
          : null
        : null;
      indicator?.columns.forEach(
        (column, index) => (indicator.columns[index].order = index + 1)
      );
      indicator?.columns.sort((x) => x.order);
      indicator.cells
        ? moveItemInArray(
            indicator.cells,
            event.previousIndex,
            event.currentIndex
          )
        : null;
      indicator.dimensions?.forEach((d) => {
        if (d?.cells) {
          moveItemInArray(d.cells, event.previousIndex, event.currentIndex);
        }
        d.dimensionWeeks?.forEach((dw) =>
          dw.cells
            ? moveItemInArray(dw.cells, event.previousIndex, event.currentIndex)
            : null
        );
      });
      indicator.weeks
        ? indicator.weeks.forEach((w) =>
            w
              ? moveItemInArray(
                  w.cells,
                  event.previousIndex,
                  event.currentIndex
                )
              : null
          )
        : null;
    });
    this.formDesignerStructure.columns = [
      ...this.formDesignerStructure.columns,
    ];
    this.formDesignerStructure.kpis = [...this.formDesignerStructure.kpis];
  }

  reOrderArray(arr: any[]) {
    return arr.forEach((el, index) => (el.order = index + 1));
  }

  dropRow(event: CdkDragDrop<string[]>, list, i) {
    moveItemInArray(list, event.previousIndex, event.currentIndex);
    this.formDesignerStructure.kpis.map((indicator: FormDesignerKPIDto, i) =>
      indicator.dimensions
        ? indicator.dimensions.map((dimension, i) => (dimension.order = i + 1))
        : null
    );
  }

  mouseDown(event, el: any = null) {
    el = el || event.target;
    this.pos = {
      x: el.getBoundingClientRect().left - event.clientX + "px",
      y: el.getBoundingClientRect().top - event.clientY + "px",
      width: el.getBoundingClientRect().width + "px",
    };
  }

  onDragRelease(event: CdkDragRelease) {
    this.renderer2.setStyle(
      event.source.element.nativeElement,
      "margin-left",
      "0px"
    );
  }
  slectedBtn: false;
  showMeasaureRow(i) {
    if (!this.formDesignerStructure.kpis[i].referenceId) {
      this.targetIndex = i;
      this.animationState = "open";
      this.slectedBtn;
    }
  }

  // public getTheBoolean(): Observable<boolean> {
  //   return this.theBoolean.asObservable();
  // }

  //   CheckMeasureDataSource(MeasureName: any): boolean {
  //     if (this.pivotConfigration.measures != null) {
  //       if (this.pivotConfigration.measures.find(f => f.MainBindingSource == MeasureName && f.IsMeasure==true))
  //         return true;
  //       else
  //         return false;
  //     }
  //     else
  //       return false;
  //   }
  checkDimensionDataMapping(formDimension) {
    let dimChecking;
    if (formDimension?.dimensionCubMapping?.id > 0) {
      dimChecking = true;
    } else {
      dimChecking = false;
    }
    return dimChecking;
  }

  changeIsPercentage(
    isPercentage: boolean,
    colItem: FormStructureColumnDto,
    kpiItem: FormDesignerKPIDto
  ) {
    if (this.changeablebindSource.find((a) => a == colItem.bindSource)) {
      for (let i = 0; i < kpiItem.columns.length; i++) {
        if (
          kpiItem.columns[i].bindSource ==
          this.changeablebindSource.find(
            (a) => a == kpiItem.columns[i].bindSource
          )
        ) {
          kpiItem.columns[i].isPercentage = isPercentage;
          if (kpiItem.id > 0) {
            var percentage = kpiItem?.struturePercentages.find(
              (a) =>
                a.formStructureRowId == kpiItem.id &&
                a.formStructureColumnId == colItem.id
            );
            var columnId = kpiItem.columns[i].columnStructureId;
            let obj = this.setIsPercentageValue(columnId);
            kpiItem.struturePercentages.push(obj);
          }
        }
      }
    }
    /* var kpiCol = kpiItem?.columns?.find((x) => x.id == colItem.id);
    kpiCol.isPercentage = isPercentage;*/
    if (kpiItem.id > 0) {
      var percentage = kpiItem?.struturePercentages.find(
        (a) =>
          a.formStructureRowId == kpiItem.id &&
          a.formStructureColumnId == colItem.id
      );
      if (percentage == undefined && isPercentage) {
        kpiItem?.struturePercentages.push(
          this.prepareKpiPercentage(percentage, isPercentage, colItem, kpiItem)
        );
      } else {
        this.prepareKpiPercentage(percentage, isPercentage, colItem, kpiItem);
      }
    } else {
      const objPercentage = this.prepareKpiPercentage(
        null,
        isPercentage,
        colItem,
        kpiItem
      );
      kpiItem?.struturePercentages.push(objPercentage);
    }
    let flag = false;
    for (let i = 0; i < 6; i++) {
      if (kpiItem.columns[i].isPercentage) {
        flag = true;
        break;
      }
    }
    if (flag) {
      kpiItem.equationTypeId = 1;
      kpiItem.dimensions.forEach((dimension) => {
        dimension.equationTypeId = 1;
      });
    }
  }

  prepareKpiPercentage(
    percentage: FormStructurePercentageDto | null,
    isPercentage: boolean,
    colItem: FormStructureColumnDto,
    kpiItem: FormDesignerKPIDto
  ) {
    const formStructurePercentage = new FormStructurePercentageDto();
    if (percentage == undefined || percentage == null) {
      formStructurePercentage.id = 0;
      formStructurePercentage.formStructureRowId = kpiItem.id;
      formStructurePercentage.formStructureColumnId = colItem.id;
      formStructurePercentage.isPercentage = isPercentage;
      return formStructurePercentage;
    } else {
      percentage.isPercentage = isPercentage;
      return percentage;
    }
  }
  changedEquationType(EquationTypeId: number, kpiItem: FormDesignerKPIDto) {
    if (EquationTypeId > 1) {
      for (var i = 0; i < 6; i++) {
        if (kpiItem.columns[i].isPercentage) {
          this.changeIsPercentage(false, kpiItem.columns[i], kpiItem);
        }
      }
    }
    this.selectedEquationTypeId = EquationTypeId;
  }

  changedEquationTypeDimension(
    EquationTypeId: number,
    kpiItem: FormDesignerKPIDto
  ) {
    kpiItem.dimensions.forEach((dimension) => {
      dimension.equationTypeId = EquationTypeId;
    });
    if (EquationTypeId > 1) {
      for (var i = 0; i < 6; i++) {
        if (kpiItem.columns[i].isPercentage) {
          this.changeIsPercentage(false, kpiItem.columns[i], kpiItem);
        }
      }
    }
    this.selectedEquationTypeIdDimension = EquationTypeId;
  }
  checked = false;
}
