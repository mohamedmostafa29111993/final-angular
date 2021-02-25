import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import {
  BusinessUnitListDto,
  DimensionFormDesignerListDto,
  FormDesignerServiceProxy,
} from "@shared/service-proxies/service-proxies";
import * as _ from "lodash";
import { BsModalRef } from "ngx-bootstrap/modal";

@Component({
  selector: "app-form-designer-add-dimension-dialog",
  templateUrl: "./form-designer-add-dimension-dialog.component.html",
  styleUrls: ["./form-designer-add-dimension-dialog.component.css"],
})
export class FormDesignerAddDimensionDialogComponent implements OnInit {
  saving = false;
  formId: number;
  excludedDimensionIds: number[];
  selectedDimensionGroupId: number = 0;
  selectedBusinessUnitId: number = 0;
  dimensionPrefixTitle: string = "";
  showMsgDimensionGroupId: boolean = false;
  showMsgBusinessUnitId: boolean = false;
  defaultDimensionDataCheckedStatus: boolean = false;
  checkedDimensionDataMap: DimensionFormDesignerListDto[] = [];
  allFormBusinessUnits: BusinessUnitListDto[] = [];
  allDimensionsData: DimensionFormDesignerListDto[] = [];
  allDimensionGroups: DimensionFormDesignerListDto[] = [];

  @Output() onSave = new EventEmitter<any>();

  constructor(
    public _formDesignerService: FormDesignerServiceProxy,
    public bsModalRef: BsModalRef
  ) {}

  ngOnInit(): void {
    this.getAllDimensionGroups();
    this.getAllFormBusinessUnits();
  }

  getAllDimensionGroups() {
    this._formDesignerService.getAllDimensionGroup().subscribe((result) => {
      this.allDimensionGroups = result;
      console.log("check this resultttt Group", this.allDimensionGroups);
    });
  }

  getAllFormBusinessUnits() {
    this._formDesignerService
      .getFormBusinessUnits(this.formId)
      .subscribe((result) => {
        this.allFormBusinessUnits = result;
        console.log("check this resultttt BU", this.allFormBusinessUnits);
      });
  }

  getFilteredDimensionsData() {
    if (this.selectedDimensionGroupId == 0) {
      this.showMsgDimensionGroupId = true;
    }
    if (this.selectedBusinessUnitId == 0) {
      this.showMsgBusinessUnitId = true;
    } else {
      this.showMsgDimensionGroupId = false;
      this.showMsgBusinessUnitId = false;
      this.getDimensionsData();
    }
  }

  getDimensionsData() {
    this.allDimensionsData = [];
    if (this.dimensionPrefixTitle != "") {
      this._formDesignerService
        .getDimensionsData(
          this.selectedDimensionGroupId,
          this.selectedBusinessUnitId,
          this.excludedDimensionIds,
          this.dimensionPrefixTitle
        )
        .subscribe((result) => {
          this.allDimensionsData = result;
        });
    }
  }

  isDimensionDataChecked(dimDataId): boolean {
    const result = this.checkedDimensionDataMap.find((x) => x.id === dimDataId);
    if (result == undefined) {
      this.defaultDimensionDataCheckedStatus = false;
    } else {
      this.defaultDimensionDataCheckedStatus = true;
    }
    return this.defaultDimensionDataCheckedStatus;
  }

  onDimensionGroupsOrBusinessUnitsChange() {
    if (this.selectedDimensionGroupId > 0 && this.selectedBusinessUnitId > 0) {
      this.getDimensionsData();
    }
  }

  onDimensionDataChange(dimData: DimensionFormDesignerListDto, $event) {
    if ($event.target.checked) {
      this.checkedDimensionDataMap.push(dimData);
    } else {
      const index = this.checkedDimensionDataMap.findIndex(
        (x) => x.id === dimData.id
      );
      this.checkedDimensionDataMap.splice(index, 1);
    }
  }

  onCheckAllChange($event) {
    this.defaultDimensionDataCheckedStatus = !this
      .defaultDimensionDataCheckedStatus;
    this.checkedDimensionDataMap = [];
    if ($event.target.checked) {
      this.checkedDimensionDataMap = this.allDimensionsData;
    }
  }

  save(): void {
    if (this.checkedDimensionDataMap.length > 0) {
      this.saving = true;
      this.bsModalRef.hide();
      this.onSave.emit(this.checkedDimensionDataMap);
    }
  }
}
