import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import {
  FormServiceProxy,
  UserServiceProxy,
  FormListDto,
  CustomUserDtoList,
  UserFormServiceProxy,
  CreateOrUpdateUserFormDto,
  UserFormsEditDto,
  FormUsersGroupDto,
  FormBusinessUnitServiceProxy,
  BusinessFormListDto,
} from "@shared/service-proxies/service-proxies";
import { NotifyService } from "abp-ng2-module";
@Component({
  selector: "app-creat-form-assignment",
  templateUrl: "./creat-form-assignment.component.html",
  styleUrls: ["./creat-form-assignment.component.css"],
})
export class CreatFormAssignmentComponent implements OnInit {
  public FormList: FormListDto[] = new Array<FormListDto>();
  public Users: CustomUserDtoList[] = new Array<CustomUserDtoList>();
  BusinessUnitsList: BusinessFormListDto[] = new Array<BusinessFormListDto>();
  public roleId: number;
  //filteredBusinessUnits:BusinessFormListDto[];
  businessUnitValid = true;
  FromValid = true;
  UserValid = true;
  userFormAssignment = new CreateOrUpdateUserFormDto();
  userErorrMsg: string;
  public userFormList: FormListDto[] = new Array<FormListDto>();
  @Output()
  appendFormAssigment: EventEmitter<FormUsersGroupDto> = new EventEmitter();
  constructor(
    private _formService: FormServiceProxy,
    private _UserService: UserServiceProxy,
    private _userFormService: UserFormServiceProxy,
    private _BusinessFormService: FormBusinessUnitServiceProxy,
    public notify: NotifyService
  ) {}

  ngOnInit(): void {
    this.getFormsList();
    this.userFormAssignment.userForms = new UserFormsEditDto();
    this.userFormAssignment.userForms.businessFormList = new Array<number>();
  }

  public getFormsList(): void {
    this._formService
      .getAllFormsWithoutUser()
      .pipe()
      .subscribe((result: FormListDto[]) => {
        this.FormList = result;
      });
  }

  getUserslist(prefix: string) {
    if (prefix.trim() != "") {
      this._UserService.getAllUsersByPrefix(prefix).subscribe((res) => {
        this.Users = res;
      });
    }
  }

  getFilteredBusinessUnits(formId: number) {
    this.userFormAssignment.userForms.formUserId = null;
    this.Users = new Array<CustomUserDtoList>();
    this.UserValid = true;
    this.userErorrMsg = "";
    this.userFormAssignment.userForms.businessFormList = [];
    this._BusinessFormService
      .getAllBusinessUnitsByForm(formId)
      .subscribe((res) => {
        this.BusinessUnitsList = res;
      });
  }

  checkBusinessUnitValue() {
    if (
      this.userFormAssignment.userForms.businessFormList.length == 0 &&
      this.userFormAssignment.userForms.formId
    )
      this.businessUnitValid = false;
    else this.businessUnitValid = true;
  }

  checkFormValue() {
    console.log(this.userFormAssignment.userForms.formId);
    if (
      this.userFormAssignment.userForms.formId == undefined ||
      this.userFormAssignment.userForms.formId == null
    )
      this.FromValid = false;
    else this.FromValid = true;
  }

  checkUserValue() {
    if (
      this.userFormAssignment.userForms.formUserId == undefined ||
      this.userFormAssignment.userForms.formUserId == null
    ) {
      this.UserValid = false;
      this.userErorrMsg = "User is required";
    } else {
      if (this.userFormAssignment.userForms.formId) {
        this._formService
          .getAllForms(this.userFormAssignment.userForms.formUserId)
          .subscribe((result: FormListDto[]) => {
            this.userFormList = result;
            if (
              this.userFormList.find(
                (f) => f.formId == this.userFormAssignment.userForms.formId
              )
            ) {
              this.UserValid = false;
              this.userErorrMsg = "User is Already assigned";
            } else {
              this.UserValid = true;
              this.userErorrMsg = "";
            }
          });
      }
    }
  }

  SaveFormAssignment() {
    this.checkBusinessUnitValue();
    this.checkFormValue();
    this.checkUserValue();

    if (this.UserValid && this.FromValid && this.businessUnitValid) {
      this.Users = new Array<CustomUserDtoList>();
      //this.userFormAssignment.userForms.isCompleted = true;
      this._userFormService
        .createUpdateUserForm(this.userFormAssignment)
        .subscribe(
          (res) => {
            if (res) {
              this.notify.success("Data Saved Successfully");
              this.userFormAssignment.userForms = new UserFormsEditDto();
              this.appendFormAssigment.emit(res);
            }
          },
          (err) => {
            this.notify.error("Data not Saved");
          }
        );
    }
  }
}
