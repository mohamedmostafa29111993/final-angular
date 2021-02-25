import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import {
  BusinessRoleServiceProxy,
  BusinessUnitServiceProxy,
  BusinessRoleDto,
  FormStatusServiceProxy,
  BusinessUnitDto,
  FormPeriodTypeServiceProxy,
  FormTypeListDto,
  CreateFormDto,
  FormRoleListDto,
  FormServiceProxy,
  FormAddDto,
} from "@shared/service-proxies/service-proxies";
import { NotifyService } from "abp-ng2-module";
import { FormStatusType } from "@shared/enums/form-status-type";
import { FormDisplayType } from "@shared/enums/form-display-type";

@Component({
  selector: "app-add-new-form",
  templateUrl: "./add-new-form.component.html",
  styleUrls: ["./add-new-form.component.css"],
})
export class AddNewFormComponent implements OnInit {
  saving: boolean;
  filteredBusinessRoles: BusinessRoleDto[];
  selectedBusinessRole: number;
  businessRoleerrmsg: boolean = false;
  filteredBusinessUnits: BusinessUnitDto[];
  selectedBusinessUnits: number[];
  businessUniterrmsg: boolean = false;
  formTypeMsg: string;
  formCodeErrorMsg = false;
  formTypes: FormTypeListDto[];
  formDisplayType = true;
  disableDisplayToggle = false;

  public createOrUpdateForm: CreateFormDto;
  public businessUnitsIds: any[];
  public formEditDto: FormAddDto;
  public formRoleListDto: FormRoleListDto;
  public selectedFormTypeId: number = 0;

  @Output() formListParentComponent = new EventEmitter<any>();
  public roleValid = false;
  public buValid = false;
  public formTypeValid = false;

  constructor(
    private BusinessRoleServiceProxy: BusinessRoleServiceProxy,
    private _businessUnitServiceProxy: BusinessUnitServiceProxy,
    private FormTypeServiceProxy: FormPeriodTypeServiceProxy,
    private _formService: FormServiceProxy,
    private notify: NotifyService,
    private _formStatusService: FormStatusServiceProxy
  ) {
    this.saving = false;
    this.filteredBusinessRoles = new Array<BusinessRoleDto>();
    this.selectedBusinessRole = null;
    this.filteredBusinessUnits = new Array<BusinessUnitDto>();
    this.selectedBusinessUnits = new Array<number>();
    this.formTypes = new Array<FormTypeListDto>();
    this.createOrUpdateForm = new CreateFormDto();
    this.formEditDto = new FormAddDto();
    this.formRoleListDto = new FormRoleListDto();
    this.businessUnitsIds = new Array<any>();
  }

  ngOnInit(): void {
    this.getFormTypes();
  }
  SaveForm() {
    this.checkBusinessRoleValue();
    this.checkFormCodeValue();
    this.checkBusinessUnitValue();
    this.checkFormType();
    if (
      this.buValid &&
      this.roleValid &&
      this.formTypeValid &&
      !this.formCodeErrorMsg
    ) {
      this.businessUnitsIds = new Array<any>();
      this.formEditDto.businessUnitsIds = new Array<number>();
      if (this.formDisplayType == true) {
        this.formEditDto.displayTypeId = FormDisplayType.Summary;
      } else {
        this.formEditDto.displayTypeId = FormDisplayType.Details;
      }
      this.formEditDto.businessUnitsIds = this.selectedBusinessUnits;
      this.formEditDto.businessRoleId = this.selectedBusinessRole;
      this.formEditDto.formStatusId = FormStatusType.NotStarted;
      this.formEditDto.formTypeId = this.selectedFormTypeId;
      this.formEditDto.publishDate = null;
      this.createOrUpdateForm.form = this.formEditDto;
      this._formService.createForm(this.createOrUpdateForm).subscribe(
        (data) => {
          this.formRoleListDto = data;
          this.notify.success("Data Saved Successfully");
          this.selectedBusinessRole = null;
          this.selectedBusinessUnits = new Array<any>();
          this.selectedFormTypeId = 0;
          this.formDisplayType = true;
          this.disableDisplayToggle = false;
          this.formEditDto = new FormAddDto();
          this.formListParentComponent.emit(this.formRoleListDto);
        },
        (error) => {
          this.notify.error("Data Not Saved");
        }
      );
    }
  }

  getFilteredBusinessRoles(prefix: string) {
    if (prefix.trim() != "") {
      this.BusinessRoleServiceProxy.getAllBusinessRolesByPrefixText(
        prefix
      ).subscribe((res) => {
        this.filteredBusinessRoles = res;
      });
    }
  }

  checkBusinessRoleValue() {
    this.filteredBusinessRoles = new Array<BusinessRoleDto>();
    if (this.selectedBusinessRole == null) {
      this.businessRoleerrmsg = true;
      this.roleValid = false;
    } else {
      this.businessRoleerrmsg = false;
      this.roleValid = true;
    }
  }

  getFilteredBusinessUnits(prefix: string) {
    if (prefix.trim() != "") {
      this._businessUnitServiceProxy
        .getAllBusinessUnitsByPrefixText(prefix)
        .subscribe((res) => {
          this.filteredBusinessUnits = res;
        });
    }
  }

  checkBusinessUnitValue() {
    this.filteredBusinessUnits = new Array<BusinessUnitDto>();
    if (this.selectedBusinessUnits.length == 0) {
      this.businessUniterrmsg = true;
      this.buValid = false;
    } else {
      this.businessUniterrmsg = false;
      this.buValid = true;
    }
  }

  checkFormCodeValue() {
    if (
      this.formEditDto.formCode == "" ||
      this.formEditDto.formCode == undefined
    ) {
      this.formCodeErrorMsg = true;
    } else {
      this.formCodeErrorMsg = false;
    }
  }

  getFormTypes() {
    this.FormTypeServiceProxy.getFormTypesList().subscribe(
      (res) => {
        this.formTypes = res;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  public checkFormType() {
    this.formTypeMsg = "";
    if (this.selectedFormTypeId == 0) {
      this.formTypeMsg = "Select Period";
      this.formTypeValid = false;
    } else {
      this.formTypeValid = true;
    }
  }

  checkPeriodType(event) {
    if (event.target.value == 1) {
      // weekly
      this.disableDisplayToggle = true;
      this.formDisplayType = true;
    } else {
      this.disableDisplayToggle = false;
    }
  }
}
