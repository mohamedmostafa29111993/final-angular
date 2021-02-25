import { Component, HostListener, OnInit } from "@angular/core";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import {
  BusinessRoleDto,
  BusinessRoleServiceProxy,
  BusinessUnitDto,
  BusinessUnitListDto,
  FormRoleListDto,
  FormRoleListDtoPagedResultDto,
  FormServiceProxy,
  FormStatusListDto,
  FormStatusServiceProxy,
  BusinessUnitServiceProxy,
  UpdateFormDto,
  FormEditDto,
  UpdateFormStatusDto,
  FormListServiceProxy,
  FormInput,
  CreateFormDto,
  CopyFormServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";
import { NotifyService } from "abp-ng2-module";
import { AppConsts } from "@shared/AppConsts";
import { FormStatusType } from "@shared/enums/form-status-type";
import { FormDisplayType } from "@shared/enums/form-display-type";

@Component({
  selector: "app-forms-list",
  templateUrl: "./forms-list.component.html",
  styleUrls: ["./forms-list.component.css"],
  animations: [appModuleAnimation()],
})
export class FormsListComponent implements OnInit {
  statusId = 0;
  skipCount = 0;
  maxResultCount = 20;
  innerHeight: any;
  roleId: number | null | undefined;
  sorting: string | null | undefined;
  advancedFiltersVisible: boolean = false;
  isTableLoading: boolean = false;
  filteredBusinessRoles: BusinessRoleDto[] = [];
  formStatusList: FormStatusListDto[] = [];
  allForms: FormRoleListDto[] = [];
  BusinessUnit: BusinessUnitListDto;
  editMode: boolean = false;
  filteredBusinessUnits: BusinessUnitDto[];
  selectedBusinessUnits: number[];
  singleBusinessUnits: BusinessUnitDto;
  oldSelectedBusinessUnits: number[];
  newSelectedBusinessUnits: number[];
  updataSelectedBusinessUnits: number[];
  fId: number = 0;
  public buValid = false;
  businessUniterrmsg: string;
  updateFormDto: UpdateFormDto;
  editFormDto: FormEditDto;
  BusinessUnitList: BusinessUnitListDto[] = [];
  enumFormStatus = FormStatusType;
  enumFormDisplayType = FormDisplayType;
  public createOrUpdateForm: CreateFormDto;
  public formRoleListDto: FormRoleListDto;

  constructor(
    private _businessRoleService: BusinessRoleServiceProxy,
    private _formStatusService: FormStatusServiceProxy,
    private _formervice: FormServiceProxy,
    private _businessUnitServiceProxy: BusinessUnitServiceProxy,
    private notify: NotifyService,
    private _copyFormServiceProxy: CopyFormServiceProxy,
    private formListServiceProxy: FormListServiceProxy
  ) {
    this.filteredBusinessUnits = new Array<BusinessUnitDto>();
    this.createOrUpdateForm = new CreateFormDto();
    this.formRoleListDto = new FormRoleListDto();
  }

  ngOnInit(): void {
    this.getAllFormsList();
    this.getFormStatus();
    this.innerHeight = window.innerHeight / 2;
  }

  getAllFormsList() {
    this.isTableLoading = true;
    this._formervice
      .getAllFormsList(
        this.roleId,
        this.statusId,
        this.sorting,
        this.maxResultCount,
        this.skipCount
      )
      .pipe(
        finalize(() => {
          this.isTableLoading = false;
        })
      )
      .subscribe((result: FormRoleListDtoPagedResultDto) => {
        this.allForms = this.allForms.concat(result.items);
      });
  }

  onScrollDown() {
    this.skipCount = this.skipCount + this.maxResultCount;
    this.getAllFormsList();
  }

  getFilteredBusinessRoles(prefix: string) {
    if (prefix.trim() != "") {
      this._businessRoleService
        .getAllBusinessRolesByPrefixText(prefix)
        .subscribe((res) => {
          this.filteredBusinessRoles = res;
        });
    }
  }

  getFormStatus() {
    this._formStatusService
      .getAllFormsStatus()
      .subscribe((result: FormStatusListDto[]) => {
        this.formStatusList = result;
      });
  }

  clearFilters(): void {
    this.roleId = undefined;
    this.statusId = 0;
    this.getSearchData();
  }

  getSearchData() {
    this.allForms = [];
    this.skipCount = 0;
    this.getAllFormsList();
  }
  updateFormList(data: FormRoleListDto) {
    this.allForms.unshift(data);
  }

  getFilteredBusinessUnits(prefix: string) {
    this._businessUnitServiceProxy
      .getAllBusinessUnitsByPrefixText(prefix)
      .subscribe((res) => {
        this.filteredBusinessUnits = res;
      });
  }

  checkBusinessUnitValue() {
    this.businessUniterrmsg = "";
    if (this.selectedBusinessUnits.length == 0) {
      this.businessUniterrmsg = "Business Units are required";
      this.buValid = false;
    } else {
      this.buValid = true;
    }
  }
  editBusinessUnits(formId: number) {
    this.selectedBusinessUnits = new Array<number>();
    this.oldSelectedBusinessUnits = new Array<number>();
    this.newSelectedBusinessUnits = new Array<number>();

    this.allForms
      .find((f) => f.formId == formId)
      .businessUnits.forEach((b) => {
        this.singleBusinessUnits = new BusinessUnitDto();
        this.singleBusinessUnits.id = b.businessUnitId;
        this.singleBusinessUnits.shortTitle = b.businessUnitTitle;
        this.filteredBusinessUnits.push(this.singleBusinessUnits);
        this.selectedBusinessUnits.push(b.businessUnitId);
        this.oldSelectedBusinessUnits.push(b.businessUnitId);
      });
    this.fId = formId;

    this.editMode = true;
  }
  saveEditingBusinessUnits(form: FormRoleListDto) {
    this.fillListofSelectedBusinessUnits();

    if (this.buValid) {
      form.businessUnits = new Array<BusinessUnitListDto>();
      form.businessUnits = [];
      this.updateFormDto = new UpdateFormDto();
      this.editFormDto = new FormEditDto();
      this.editFormDto.businessUnitsNewIds = this.newSelectedBusinessUnits;
      this.editFormDto.businessUnitsUpdatedIds = this.updataSelectedBusinessUnits;
      this.editFormDto.id = form.formId;
      this.updateFormDto.form = this.editFormDto;
      this._formervice.updateForm(this.updateFormDto).subscribe(
        (data) => {
          this._businessUnitServiceProxy
            .getBusinessUnitlistDto(this.selectedBusinessUnits)
            .subscribe((data) => (form.businessUnits = data));
          this.notify.success("Form Upated Successfully");
        },
        (error) => {
          this.notify.error("Data Not Updated");
        }
      );
      this.fId = 0;
    }
  }
  cancelEditingBusinessUnits() {
    this.fId = 0;
  }

  fillListofSelectedBusinessUnits() {
    this.newSelectedBusinessUnits = new Array<number>();
    this.updataSelectedBusinessUnits = new Array<number>();
    this.selectedBusinessUnits.forEach((s) => {
      if (!this.oldSelectedBusinessUnits.find((o) => o == s)) {
        this.newSelectedBusinessUnits.push(s);
      }
    });

    this.oldSelectedBusinessUnits.forEach((o) => {
      if (!this.selectedBusinessUnits.find((s) => o == s)) {
        this.updataSelectedBusinessUnits.push(o);
      }
    });
  }
  design(formId: number, formStatusId: number) {
    let url = AppConsts.appBaseUrl + "/app/form-design/" + formId;
    if (formStatusId == 1) {
      let updateDto = new UpdateFormStatusDto();
      updateDto.formId = formId;
      updateDto.formStatusId = 2;
      this._formervice.updateFormStatus(updateDto).subscribe((status) => {
        let form = this.allForms.find((x) => x.formId == formId);
        form.formStatusId = 2;
        form.formStatus = status;
        window.open(url);
      });
    } else if (formStatusId == 2) {
      window.open(url);
    }
  }
  ReSendActivation(formId: number) {
    let finput = new FormInput();
    finput.formId = formId;
    finput.activateExisting = true;
    this.skipCount = 0;
    this.maxResultCount = 20;
    this.allForms = [];
    this.formListServiceProxy.activateForm(finput).subscribe((res) => {
      this.getAllFormsList();
    });
  }
  Activate(formId: number, ActivateExisting: boolean | null) {
    let finput = new FormInput();
    finput.formId = formId;
    finput.activateExisting = ActivateExisting;
    this.formListServiceProxy.activateForm(finput).subscribe((res) => {
      if (res.key == null) {
        abp.message.confirm(res.value, undefined, (result: boolean) => {
          if (result) {
            this.ReSendActivation(formId);
          }
        });
      } else {
        if (res.key == true) {
          this.skipCount = 0;
          this.maxResultCount = 20;
          this.allForms = [];
          this.getAllFormsList();
          this.notify.success(res.value, "");
        } else {
          this.notify.error(res.value, "");
        }
      }
    });
  }
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.innerHeight = window.innerHeight / 2;
  }

  open_closeFilter() {
    this.advancedFiltersVisible = !this.advancedFiltersVisible;
    if (this.advancedFiltersVisible == true) {
      this.innerHeight = this.innerHeight - 150;
    } else {
      this.innerHeight = this.innerHeight + 150;
    }
  }

  checkFormStatus(formStatusId: number) {
    debugger;
    if (formStatusId == this.enumFormStatus.Active) {
      return true;
    } else {
      return false;
    }
  }

  copyAndEdit(formId: number) {
    // this.global.isAllLoading = true;
    this.isTableLoading = true;
    this._copyFormServiceProxy.copyForm(formId).subscribe((data) => {
      this.formRoleListDto = data;
      // this.global.isAllLoading = false;
      this.isTableLoading = false;
      this.notify.success("Form Was Copied Successfully");
      this.allForms.unshift(data);
    });
  }
}
