import {
  Component,
  Input,
  OnInit,
  EventEmitter,
  Output,
  AfterViewInit,
  OnChanges,
} from "@angular/core";
import {
  FormDesignerServiceProxy,
  FormDesignerSubSectionStructureDto,
  FormDesignerKPIDto,
  FormDimensionWeekDto,
  FormStructerDataCellDto,
  FormStructureColumnDto,
  FormCellTypeDto,
  EquationTypeDto,
  FormDesignerDynamicDimensionDto,
  FormStructurePercentageDto,
  KPIDto,
} from "@shared/service-proxies/service-proxies";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { FormDesignerAddDimensionDialogComponent } from "../form-designer-add-dimension-dialog/form-designer-add-dimension-dialog.component";
import { ActivatedRoute } from "@angular/router";
import { FormRowType } from "@shared/enums/form-row-type";
import { FormDisplayType } from "@shared/enums/form-display-type";
import { NotifyService } from "abp-ng2-module";
import { SumDimensionsDialogComponent } from "../sum-dimensions-dialog/sum-dimensions-dialog.component";
import { EquationType } from "@shared/enums/EquationType";
import { DimentionSampleOutputEmitter } from "@shared/custom-dtos/output-events-emitter-dto";
import { FormDesignerAddDimensiontypeDialogComponent } from "../form-designer-add-dimensiontype-dialog/form-designer-add-dimensiontype-dialog.component";
import { KPIReferenceTypeEnum } from "@shared/enums/kpi-refrence-type";
import { FormDesignerService } from "../../form-designer.service";

@Component({
  selector: "[app-form-design-kpi]",
  templateUrl: "./form-design-kpi.component.html",
  styleUrls: [
    "./form-design-kpi.component.css",
    "./../../../../../assets/style/form.css",
  ],
})
export class FormDesignKpiComponent
  implements OnInit, OnChanges, AfterViewInit {
  @Input() form: FormDesignerSubSectionStructureDto;
  formId: number = 0;
  @Input() formIndicator: FormDesignerKPIDto;
  @Input() formColumns: FormStructureColumnDto[];
  @Input() indicatorIndex: number;
  @Output() deleteKPIid = new EventEmitter<any>();
  @Output() selectedDimentionForBody = new EventEmitter<any>();
  @Output()
  SelectedDimentionType = new EventEmitter<DimentionSampleOutputEmitter>();
  @Input() formDisplayType;
  @Input() weekDimensionStructureId: number;
  @Input() cellTypes: FormCellTypeDto[];
  @Input() equationTypes: EquationTypeDto[];
  @Input() selectedEquationTypeId: number;
  @Output() changedEquationTypeId = new EventEmitter<number>();
  @Output() selectedIndicator = new EventEmitter<any>();
  @Output() copyKpiAsDimension: EventEmitter<{
    title: string;
    type: string;
    parentId: number;
    percentages: FormStructurePercentageDto[];
  }> = new EventEmitter<{
    title: string;
    type: string;
    parentId: number;
    percentages: FormStructurePercentageDto[];
  }>();
  activeIndicator: boolean = false;
  // dimentionTypeList:DimentionTypeListDto[];
  SelectedIndicatorId: string;
  // addDimentionPlus:boolean=false;
  // indicatorDimentionOutputDto:FormIndicatorDimentionOutputDto[];
  // indicatorDimention:FormIndicatorDimentionOutputDto;
  checkAll: boolean = false;
  isSummary = false;
  @Input() isDynamic;
  @Input() canAddDynamicDim;

  showValues = false;
  constructor(
    private _formDesignerService: FormDesignerServiceProxy,
    private _modalService: BsModalService,
    private route: ActivatedRoute,
    public notify: NotifyService,
    public formDesignerService: FormDesignerService
  ) {
    this.equationTypes = new Array<EquationTypeDto>();
  }

  ngOnChanges() {
    this.formColumns = [...this.formColumns];
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.formId = +params.get("formId");
    });

    this.showValues =
      this.formIndicator.id > 0 ? this.formIndicator.showValues : true;
    this.isSummary =
      this.formIndicator.rowTypeId == FormRowType.Summary ||
      (this.formIndicator.rowTypeId == null &&
        this.formDisplayType == FormDisplayType.Summary)
        ? true
        : false;
    this.fillCells();
    if (this.formIndicator.equationTypeId == EquationType.Sum) {
      this.formIndicator.equationTypeId = EquationType.Sum;
    } else if (this.formIndicator.equationTypeId == EquationType.Average) {
      this.formIndicator.equationTypeId = EquationType.Average;
    } else {
      this.formIndicator.equationTypeId = EquationType.None;
    }
    this.getEquationTypes();
  }
  equationTypeChange(event: any) {
    if (event.value == EquationType.None) {
      this.formIndicator.equationTypeId = EquationType.None;
    } else if (event.value == EquationType.Sum) {
      this.formIndicator.equationTypeId = EquationType.Sum;
    } else if (event.value == EquationType.Average) {
      this.formIndicator.equationTypeId = EquationType.Average;
    }
    this.changedEquationTypeId.emit(this.formIndicator.equationTypeId);
  }
  getEquationTypes() {
    this._formDesignerService.getEquationTypes().subscribe(
      (res) => {
        this.equationTypes = res;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  ngAfterViewInit() {}
  showValuesEvent(value: boolean) {
    this.showValues = value;
    this.formIndicator.showValues = this.showValues;
  }
  isSummaryEvent(value: boolean) {
    this.isSummary = value;
    this.formIndicator.rowTypeId = this.isSummary
      ? FormRowType.Summary
      : FormRowType.Details;
  }
  openDimensionDialog(indicatorData: FormDesignerKPIDto) {
    if (this.IsContainDimensionType()) {
      return false;
    }

    let indicatorIndex = this.indicatorIndex;
    let dimensionDialog: BsModalRef;
    let excludedDimensionIds: number[] = [];
    if (
      indicatorData.dimensions != undefined &&
      indicatorData.dimensions.length > 0
    ) {
      excludedDimensionIds = indicatorData.dimensions
        .filter((e) => !e.isDeleted)
        .map(function (a) {
          return a.structureId;
        });
    }
    dimensionDialog = this._modalService.show(
      FormDesignerAddDimensionDialogComponent,
      {
        class: "modal-md",
        backdrop: "static",
        initialState: {
          formId: this.formId,
          excludedDimensionIds: excludedDimensionIds,
        },
      }
    );

    dimensionDialog.content.onSave.subscribe((result) => {
      this.selectedDimentionForBody.emit({ result, indicatorIndex });
    });
  }
  // sum dimensions modal
  openSumPopup() {
    if (!this.formIndicator) {
      abp.message.error(
        "Invalid Form Structure !",
        undefined,
        (result: boolean) => {}
      );
    } else {
      let SumModal: BsModalRef;
      SumModal = this._modalService.show(SumDimensionsDialogComponent, {
        class: "modal-xl modal-dialog-centered",
        backdrop: "static",
        initialState: {
          FormStructure: this.form,
          title: "Sum KPIS",
          columns: this.formColumns,
          sumDimension: false,
        },
      });

      SumModal.content.sumRes.subscribe((res: KPIDto[]) => {
        if (res) {
          if (!this.formIndicator?.referenceDimensionKpiSum) {
            this.formIndicator.referenceDimensionKpiSum = [];
          }
          this.formIndicator.referenceType = +KPIReferenceTypeEnum.SumKPI;
          this.formIndicator?.referenceDimensionKpiSum.push(...res);
          SumModal.hide();
        }
      });
    }
  }
  deleteKPI(indicatorId: number) {
    this.deleteKPIid.emit(indicatorId);
  }
  addWeekDimension() {
    if (this.IsContainDimensionType()) {
      return false;
    }

    let weeksLenght = this.formIndicator.weeks?.filter((x) => !x.isDeleted)
      ?.length;
    if (weeksLenght <= 4 || !weeksLenght) {
      let weekIndex = isNaN(weeksLenght) ? 1 : weeksLenght + 1;
      this.formIndicator.weeks = this.formIndicator.weeks
        ? this.formIndicator.weeks
        : [];
      let week = new FormDimensionWeekDto();
      week.rowTypeId = null;
      week.structureTypeId = 6;
      week.order = weekIndex;
      week.week = weekIndex;
      week.structureId = this.weekDimensionStructureId;
      week.cells = [];
      this.formIndicator?.weeks.push(week);
    } else {
      this.notify.warn("Cannot add more than 5 week dimensions!");
    }
  }
  fillCells() {
    let cells: FormStructerDataCellDto[] = [];
    if (this.formColumns) {
      this.formColumns.forEach((col) => {
        let cell = this.formIndicator.cells?.find(
          (x) => x.columnBindSource == col.bindSource
        );
        if (!cell) {
          cell = new FormStructerDataCellDto();
          cell.typeId = 1;
          cell.structureId = 0;
          cell.columnBindSource = col.bindSource;
          cell.formColumnId = col.id == null ? 0 : col.id;
          cell.isDeleted = col.isDeleted;
        }
        cells.push(cell);
      });
    }
    this.formIndicator.cells = cells;
  }
  assignCellType(typeId: number, i: number, sentCell) {
    let cell = this.formIndicator.cells[i];
    sentCell.typeId = typeId;
    cell = sentCell;
  }
  getCellTypeName(id: number) {
    return this.cellTypes.find((x) => x.id == id)?.type;
  }

  getdisabledSummary() {
    let condition =
      this.formIndicator.weeks?.filter((x) => !x.isDeleted)?.length > 0 ||
      this.formIndicator.dimensions?.filter((x) => !x.isDeleted)?.length > 0;
    return condition;
  }

  IsContainDimensionType(): boolean {
    if (!this.formIndicator.dimensions) {
      return false;
    }
    return this.formIndicator.dimensions.some((e) => e.dimTypeId > 0);
  }

  IsContainDimensionOrDimensionWeek(): boolean {
    return (
      this.formIndicator.dimensions.length > 0 ||
      (this.formIndicator.weeks != undefined &&
        this.formIndicator.weeks.length > 0)
    );
  }

  // getDimentionType()
  // { this.dimentionTypeList=new Array<DimentionTypeListDto>();
  //   this._dimentionTypeService.getAllDimentionTypes().subscribe(
  //     data=>{
  //       this.dimentionTypeList=data;
  //       this.formIndicator.dimentions.forEach(d=>

  //         this.dimentionTypeList.splice(this.dimentionTypeList.findIndex(x => x.id === d.dimentionTypeId),1)
  //      )
  //     }
  //   );

  // }
  // onCheckboxChange(event) {

  //   if (event.target.checked) {

  //     //this.dimentionTypeSelectedList.push(this.dimentionTypeList.find(d=>d.id==event.target.value));
  //     this.indicatorDimention=new FormIndicatorDimentionOutputDto();
  //     this.indicatorDimention.dimentionTitle=this.dimentionTypeList.find(d=>d.id==event.target.value).title;
  //     this.indicatorDimention.dimentionTypeId=this.dimentionTypeList.find(d=>d.id==event.target.value).id;
  //     this.indicatorDimentionOutputDto.push(this.indicatorDimention);
  //   } else {
  //      var selectedindex = this.indicatorDimentionOutputDto.find(x => x.dimentionTypeId == event.target.value);
  //      var index = this.indicatorDimentionOutputDto.indexOf(selectedindex,0);
  //      this.indicatorDimentionOutputDto.splice(index,1);
  //      console.log("ind  "+selectedindex+"  ");
  //   }
  // }
  onCheckAllChange(event) {
    //   this.checkAll=!this.checkAll;
    //   if(this.checkAll)
    //   { this.indicatorDimentionOutputDto=[];
    //     this.dimentionTypeList.forEach(d=>{
    //     this.indicatorDimention=new FormIndicatorDimentionOutputDto();
    //     this.indicatorDimention.dimentionTitle=d.title;
    //     this.indicatorDimention.dimentionTypeId=d.id;
    //     this.indicatorDimentionOutputDto.push(this.indicatorDimention);
    //     });
    //   }
    //   else{
    //     this.indicatorDimentionOutputDto=[];
    //   }
  }
  submit() {
    //this.addDimentionPlus= !this.addDimentionPlus;
    //    console.log(this.indicatorDimentionOutputDto);
    //    this.selectedDimentionForBody.emit(this.indicatorDimentionOutputDto);
    //    this.activeIndicator=false;
    //    this.checkAll=false;
    //    this.indicatorDimentionOutputDto.forEach(d=>
    //     this.dimentionTypeList.splice(this.dimentionTypeList.findIndex(x => x.id === d.dimentionTypeId),1)
    //  );
    //  this.indicatorDimentionOutputDto=[];
  }

  addDimentionPlusClicked(indicatorId) {
    // if(!this.activeIndicator)
    //   {
    //     this.activeIndicator=true;
    //     this.selectedIndicator.emit(indicatorId);
    //   }
    //   else
    //   { this.activeIndicator=false;
    //     this.selectedIndicator.emit(null);
    //   }
  }

  // switchChange = false;
  // onChange(value: boolean) {
  //   this.switchChange = value;
  // }
  addWeekDimensionForKpiDistribution() {
    // console.log('hellllooooooooooooooooooooooooooooooooooooooo');
    //   let x =new Array<number>(4);
    //   x.forEach((i) => {
    // });
    let weeksLenght = this.formIndicator.weeks?.filter((x) => !x.isDeleted)
      ?.length;
    if (weeksLenght <= 0 || !weeksLenght) {
      for (let i = 0; i < 4; i++) {
        this.addWeekDimension();
      }
    }
  }
  addDynamicDimension() {
    this.isDynamic = true;

    //let weekIndex = isNaN(weeksLenght) ? 1 : weeksLenght + 1;
    // this.formIndicator.weeks = this.formIndicator.weeks ? this.formIndicator.weeks : [];
    let week = new FormDesignerDynamicDimensionDto();
    week.cells = [];
    week.rowTypeId = null;
    week.structureTypeId = 7;
    this.formIndicator.dynamicDimension = [];
    this.formIndicator.dynamicDimension.push(week);
  }
  openDimensionTypesDialog() {
    if (
      this.IsContainDimensionOrDimensionWeek() ||
      this.IsContainDimensionType()
    ) {
      return false;
    }
    let dimensionDialog: BsModalRef;

    dimensionDialog = this._modalService.show(
      FormDesignerAddDimensiontypeDialogComponent,
      {
        class: "modal-md",
        backdrop: "static",
        initialState: {
          formId: this.formId,
          // excludedDimensionIds: excludedDimensionIds
        },
      }
    );
    dimensionDialog.content.DimentionTypeSelected.subscribe((result) => {
      this.SelectedDimentionType.emit({
        DimTypeId: result,
        KpiIndex: this.indicatorIndex,
        KpiId: this.formIndicator.id,
      });
    });
  }
}
