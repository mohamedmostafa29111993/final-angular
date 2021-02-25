import {
  BusinessFormListDto,
  FormBusinessUnitServiceProxy,
  BusinessUnitDto,
  BusinessUnitServiceProxy,
  CreateOrUpdateUserFormDto,
  CustomUserDtoList,
  DeleteUserFormsDto,
  FormListDto,
  FormUsersGroupDto,
  UserBusinessFormsGroupDto,
  UserFormsEditDto,
} from "@shared/service-proxies/service-proxies";
import { Component, OnInit } from "@angular/core";

import {
  FormServiceProxy,
  UserServiceProxy,
  UserFormServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
  selector: "app-form-assignment",
  templateUrl: "./form-assignment.component.html",
  styleUrls: ["./form-assignment.component.css"],
})
export class FormAssignmentComponent implements OnInit {
  formUserGroup: FormUsersGroupDto[];
  isFormsUsersLoading: boolean = false;
  innerHeight: any;
  formSearchQuery: string;
  userSearchQuery: string;
  searchFormId: number = null;
  searchUserId: number = null;
  skipCount: number = 0;
  maxResultCount = 5;
  isLastPage: boolean = false;
  advancedFiltersVisible: boolean = false;
  userEditId: number;
  formEditId: number;
  formEditBusinessUnits: BusinessFormListDto[];
  businessUniterrmsg: string;
  userFormEditIds: number[];
  usersSearch: CustomUserDtoList[];
  formsSearch: FormListDto[];

  constructor(
    private businessFormService: FormBusinessUnitServiceProxy,
    private userFormService: UserFormServiceProxy,
    private userService: UserServiceProxy,
    private formService: FormServiceProxy
  ) {
    this.formUserGroup = [];
    this.formEditBusinessUnits = [];
  }
  ngOnInit(): void {
    this.getAllUsersFormsByPage();
    this.innerHeight = window.innerHeight / 2;
  }
  onScrollDown() {
    debugger;
    if (!this.isLastPage) {
      this.getAllUsersFormsByPage();
    }
  }
  getAllUsersFormsByPage() {
    this.isFormsUsersLoading = true;
    let formId = this.searchFormId ? this.searchFormId : 0;
    let userId = this.searchUserId ? this.searchUserId : 0;
    this.userFormService
      .getAllUsersForms(formId, userId, this.maxResultCount, this.skipCount)
      .pipe(
        finalize(() => {
          debugger;
          this.isFormsUsersLoading = false;
        })
      )
      .subscribe(
        (res) => {
          debugger;
          let prevFormsIds = this.formUserGroup.map((f) => f.formId);
          let foundIds = res.items.filter(
            (x) => prevFormsIds.indexOf(x.formId) > -1
          );
          if (foundIds.length > 0) {
            foundIds.forEach((id) => {
              let index = res.items.indexOf(id);
              if (index > -1) {
                res.items.splice(index, 1);
              }
            });
          }
          this.formUserGroup = this.formUserGroup.concat(res.items);
          this.skipCount += this.maxResultCount;
          this.isLastPage = this.skipCount >= res.totalCount ? true : false;
        },
        (error) => {
          abp.notify.error(
            "An error occurred while retrieving user form assignment"
          );
        }
      );
  }
  deleteUserForms(
    form: FormUsersGroupDto,
    user: UserBusinessFormsGroupDto
  ): void {
    debugger;
    let message =
      "Form assigment for " + user.userName + " on " + form.formName;
    abp.message.confirm(
      message + " will be deleted.",
      undefined,
      (result: boolean) => {
        if (result) {
          debugger;
          let ids = user.userForms.map((x) => x.id);
          let input = new DeleteUserFormsDto();
          input.formId = form.formId;
          input.userId = user.userId;
          input.userFormsIds = ids;
          this.userFormService.deleteUserForms(input).subscribe(
            (x) => {
              debugger;
              let formAssigment = this.formUserGroup.find(
                (x) => x.formId == form.formId
              );
              if (formAssigment.users.length == 1) {
                let formUsersGroupIndex = this.formUserGroup.findIndex(
                  (x) => x.formId == form.formId
                );
                if (formUsersGroupIndex > -1) {
                  this.formUserGroup.splice(formUsersGroupIndex, 1);
                }
              } else {
                let userIndex = formAssigment.users.findIndex(
                  (x) => x.userId == user.userId
                );
                if (userIndex > -1) {
                  formAssigment.users.splice(userIndex, 1);
                }
              }
              abp.notify.success(message + " successfully deleted");
            },
            (error) => {
              abp.notify.error(error.message);
            }
          );
        }
      }
    );
  }
  updateformUserGroupList(formUsersGroup: FormUsersGroupDto) {
    debugger;
    let formUsersGroupIndex = this.formUserGroup.findIndex(
      (x) => x.formId == formUsersGroup.formId
    );
    if (formUsersGroupIndex > -1) {
      this.formUserGroup.splice(formUsersGroupIndex, 1);
      this.formUserGroup.unshift(formUsersGroup);
    } else {
      this.formUserGroup.unshift(formUsersGroup);
    }
  }
  open_closeFilter() {
    this.advancedFiltersVisible = !this.advancedFiltersVisible;
    if (this.advancedFiltersVisible == true) {
      this.innerHeight = this.innerHeight - 150;
    } else {
      this.innerHeight = this.innerHeight + 150;
    }
  }
  getFormBusinessUnits() {
    this.businessFormService
      .getAllBusinessUnitsByForm(this.formEditId)
      .subscribe((res) => {
        debugger;
        this.userFormEditIds = this.getUserFormBusinessUnitIds(
          this.formEditId,
          this.userEditId
        );
        let userFormBusinessUnits = res.filter(
          (x) => this.userFormEditIds.indexOf(x.businessUnitId) > -1
        );
        this.formEditBusinessUnits = res;
      });
  }
  getUserFormBusinessUnitIds(formId: number, userId: number): number[] {
    return this.formUserGroup
      .find((x) => x.formId == formId)
      ?.users.find((x) => x.userId == userId)
      ?.userForms.map((x) => x.businessUnitId);
  }
  checkBusinessUnitValue(): boolean {
    let isValid = false;
    this.businessUniterrmsg = "";
    if (this.userFormEditIds.length == 0) {
      this.businessUniterrmsg = "Business Units are required";
      isValid = false;
    } else {
      isValid = true;
    }
    return isValid;
  }
  showUserAssignmentEdit(formId: number, userId: number) {
    this.userEditId = userId;
    this.formEditId = formId;
    this.getFormBusinessUnits();
  }
  resetUserAssigmentEdit() {
    this.userEditId = 0;
    this.formEditId = 0;
    this.formEditBusinessUnits = [];
    this.businessUniterrmsg = "";
  }
  editUserForms() {
    if (this.checkBusinessUnitValue()) {
      let prevFormUserGroup = this.formUserGroup.find(
        (x) => x.formId == this.formEditId
      );
      let prevFormUserGroupIndex = this.formUserGroup.indexOf(
        prevFormUserGroup
      );
      let prevUserForms = prevFormUserGroup?.users.find(
        (x) => x.userId == this.userEditId
      )?.userForms;
      let userFormAssignment = new CreateOrUpdateUserFormDto();
      userFormAssignment.userForms = new UserFormsEditDto();
      userFormAssignment.userForms.formId = this.formEditId;
      userFormAssignment.userForms.formUserId = this.userEditId;
      userFormAssignment.userForms.businessFormList = this.userFormEditIds;
      userFormAssignment.userForms.prevUserForms = prevUserForms;
      this.userFormService.createUpdateUserForm(userFormAssignment).subscribe(
        (res) => {
          debugger;
          if (res?.formId > 0) {
            this.formUserGroup[prevFormUserGroupIndex] = res;
            abp.notify.success("Data Saved Successfully");
          } else {
            debugger;
            let prevBusinessUnits = prevUserForms.map((x) => x.businessUnitId);
            if (
              JSON.stringify(prevBusinessUnits) ===
              JSON.stringify(this.userFormEditIds)
            ) {
              console.log("They are equal!");
              abp.notify.warn("No Data Changed");
            } else {
              debugger;
              let user = prevFormUserGroup.users.find(
                (x) => x.userId == this.userEditId
              );
              let userIndex = prevFormUserGroup.users.indexOf(user);
              prevBusinessUnits.forEach((id) => {
                if (this.userFormEditIds.indexOf(id) === -1) {
                  let buIndex = user.userForms.findIndex(
                    (x) => x.businessUnitId == id
                  );
                  this.formUserGroup[prevFormUserGroupIndex].users[
                    userIndex
                  ].userForms.splice(buIndex, 1);
                }
              });
              abp.notify.success("Data Saved Successfully");
            }
          }
          this.resetUserAssigmentEdit();
        },
        (err) => {
          abp.notify.error("Data not Saved");
        }
      );
    }
  }
  getUserslist(prefix: string) {
    if (prefix.trim() != "") {
      this.userService.getAllUsersByPrefix(prefix).subscribe((res) => {
        this.usersSearch = res;
      });
    }
  }
  getFormslist(prefix: string) {
    if (prefix.trim() != "") {
      this.formService.getAllFormsByName(prefix).subscribe((res) => {
        this.formsSearch = res;
      });
    }
  }
  getSearchData() {
    this.resetList();
    this.getAllUsersFormsByPage();
  }
  clearFilters() {
    this.searchUserId = null;
    this.searchFormId = null;
    this.usersSearch = [];
    this.formsSearch = [];
    this.resetList();
    this.getAllUsersFormsByPage();
  }
  resetList() {
    this.formUserGroup = [];
    this.skipCount = 0;
    this.isLastPage = false;
  }
}
