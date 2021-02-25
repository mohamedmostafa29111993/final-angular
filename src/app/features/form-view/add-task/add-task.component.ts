import {
  Component,
  OnInit,
  Injector,
  ViewChild,
  TemplateRef,
  Output,
  EventEmitter,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { ActivityType } from "@shared/enums/activity-type";
import {
  ActivityFormDataServiceProxy,
  UsersResultOutput,
  BUResultOutput,
  CreateOrUpdateActivityFormDto,
  ActivityFormEditDto,
  SubActivityFormDto,
  ActivityCountDto,
} from "@shared/service-proxies/service-proxies";
import { BsModalRef } from "ngx-bootstrap/modal";
import { AppSessionService } from "@shared/session/app-session.service";
import * as moment from "moment";
import { NotifyService } from "abp-ng2-module";
import { AppComponentBase } from "@shared/app-component-base";
import { BehaviorSubject } from "rxjs";
import {
  ActivityOutputDto,
  ActivityUpdateCountDto,
} from "@shared/custom-dtos/activities-Dto";

export enum PriorityEnum {
  High = 2,
  Medium = 3,
  Low = 4,
}

@Component({
  selector: "app-add-task",
  templateUrl: "./add-task.component.html",
  styleUrls: ["./add-task.component.css"],
})
export class AddTaskComponent extends AppComponentBase implements OnInit {
  //  modalRef: BsModalRef;
  @ViewChild("template", { static: false }) template: TemplateRef<any>;
  @Output() onSave = new EventEmitter<any>();

  public filteredActivityAssignees: UsersResultOutput[] = new Array<UsersResultOutput>();
  public filteredSubTaskAssignees: UsersResultOutput[] = new Array<UsersResultOutput>();
  public filteredActivityFollowers: UsersResultOutput[] = new Array<UsersResultOutput>();
  public BusinessUnitList: BUResultOutput[] = new Array<BUResultOutput>();
  public createOrUpdateActivityFormDto: CreateOrUpdateActivityFormDto = new CreateOrUpdateActivityFormDto();
  public subActivityFormList: SubActivityFormDto[] = new Array<SubActivityFormDto>();
  public subActivityAssignees: UsersResultOutput[] = new Array<UsersResultOutput>();
  public SubTaskObj: SubActivityFormDto = new SubActivityFormDto();
  public SubTaskData: SubActivityFormDto = new SubActivityFormDto();

  private priorityEnum = PriorityEnum;
  public taskTypeOptions = [];

  public myControl: FormControl;
  display = "none";
  errMsg: string;
  selectedFollowersArray = [];
  selectedAssigneesArray = [];
  selectedSubTaskAssigneesArray = [];
  followupErrMsg = "";
  BusinessUnitErrorMsg = "";
  orgnizererrmsg = "";
  saving = false;
  activityTypeFlag: number;
  subTaskIndex: number = -1;
  activityAdded = new BehaviorSubject<boolean>(false);
  formDataId: number;
  activityDto = new ActivityOutputDto();
  activityCount = new ActivityCountDto();
  DueDateError = false;
  ReminderDateError = false;
  ReminderDueDateError = false;

  constructor(
    public modalRef: BsModalRef,
    private ActivityFormServiceProxy: ActivityFormDataServiceProxy,
    private appSessionService: AppSessionService,
    public notify: NotifyService,
    injector: Injector,
    public ModalRef: BsModalRef
  ) {
    super(injector);
    this.createOrUpdateActivityFormDto.activityForm = new ActivityFormEditDto();
    this.createOrUpdateActivityFormDto.activityForm.businessUnitId = 0;
    this.taskTypeOptions = Object.keys(this.priorityEnum);
  }

  ngOnInit(): void {
    //this.myControl = new FormControl();
    // this.prepareActivityObj(this.activityDto.cells,this.activityDto.activityTypeId ,this.activityDto.RowId);
    this.prepareActivityObj(this.activityDto);
    this.getBusinessUnitlist();
  }

  prepareActivityObj(ActivityOutput: ActivityOutputDto) {
    this.subTaskIndex = -1;
    this.activityTypeFlag = ActivityOutput.activityTypeId;
    this.createOrUpdateActivityFormDto.activityForm.activityDescription = "";
    this.createOrUpdateActivityFormDto.activityForm = new ActivityFormEditDto();
    this.createOrUpdateActivityFormDto.activityForm.subActivities = new Array<SubActivityFormDto>();
    this.createOrUpdateActivityFormDto.activityForm.cells =
      ActivityOutput.cells;
    this.createOrUpdateActivityFormDto.activityForm.rowId =
      ActivityOutput.RowId;
    this.createOrUpdateActivityFormDto.activityForm.week = ActivityOutput.Week;
    this.createOrUpdateActivityFormDto.activityForm.month =
      ActivityOutput.Month;
    this.createOrUpdateActivityFormDto.activityForm.year = ActivityOutput.Year;
    //this.formDataId=rowId;
    this.createOrUpdateActivityFormDto.activityForm.activityType =
      ActivityOutput.activityTypeId;
    this.createOrUpdateActivityFormDto.activityForm.businessUnitId = 0;
    //  this.modalRef = this.modalService.show(this.template, { backdrop: 'static', keyboard: false });
    //   document.querySelector(".modal-dialog").classList.add("modal-lg");
    this.createOrUpdateActivityFormDto.activityForm.priorityId = 2;
    this.selectedFollowersArray = [];
    this.selectedAssigneesArray = [];
    this.filteredActivityAssignees = [];
    this.filteredActivityFollowers = [];
    this.filteredSubTaskAssignees = [];
    this.selectedSubTaskAssigneesArray = [];
    this.subActivityFormList = [];
    this.SubTaskData = new SubActivityFormDto();
    this.orgnizererrmsg = "";
    this.followupErrMsg = "";
    this.BusinessUnitErrorMsg = "";
    this.errMsg = "";
  }

  addSubTask() {
    if (this.subTaskIndex == -1) {
      //Add Mode
      this.SubTaskData.subActivityAssignees = this.selectedSubTaskAssigneesArray;
      this.subActivityFormList.push(this.SubTaskData);
      this.SubTaskData = new SubActivityFormDto();
      this.selectedSubTaskAssigneesArray = [];
    } else {
      //Update Mode
      this.subActivityFormList[
        this.subTaskIndex
      ].subActivityTitel = this.SubTaskData.subActivityTitel;
      this.subActivityFormList[
        this.subTaskIndex
      ].subActivityDueDate = this.SubTaskData.subActivityDueDate;
      this.subActivityFormList[
        this.subTaskIndex
      ].subActivityAssignees = this.selectedSubTaskAssigneesArray;
      this.subTaskIndex = -1;
      this.SubTaskData = new SubActivityFormDto();
      this.selectedSubTaskAssigneesArray = [];
    }
  }

  pushSubActivities() {
    this.subActivityFormList.forEach((subTask) => {
      this.SubTaskObj.subActivityTitel = subTask.subActivityTitel;
      this.SubTaskObj.subActivityAssignees = subTask.subActivityAssignees;
      this.SubTaskObj.subActivityDueDate = this.formateUTCDate(
        subTask.subActivityDueDate
      );
      this.createOrUpdateActivityFormDto.activityForm.subActivities.push(
        this.SubTaskObj
      );
      this.SubTaskObj = new SubActivityFormDto();
    });
  }

  deleteSubActivities(subActivityIndex: any) {
    this.subActivityFormList.splice(subActivityIndex, 1);
  }

  editSubActivity(subActivity: SubActivityFormDto, subActivityIndex: any) {
    this.filteredSubTaskAssignees = subActivity.subActivityAssignees;
    this.SubTaskData.subActivityTitel = subActivity.subActivityTitel;
    this.SubTaskData.subActivityDueDate = subActivity.subActivityDueDate;
    this.selectedSubTaskAssigneesArray = subActivity.subActivityAssignees;
    this.subTaskIndex = subActivityIndex;
  }

  savetask() {
    this.saving = true;
    let currentuserLoginName = this.appSessionService.getShownLoginName();
    this.createOrUpdateActivityFormDto.activityForm.userLoginName = currentuserLoginName;
    this.createOrUpdateActivityFormDto.activityForm.activityFollowersID = this.selectedFollowersArray;
    this.createOrUpdateActivityFormDto.activityForm.activityAssigneesID = this.selectedAssigneesArray;

    let startDate = this.createOrUpdateActivityFormDto.activityForm.startDate?.toString();
    let dueDate = this.createOrUpdateActivityFormDto.activityForm.dueDate?.toString();
    let reminderDate = this.createOrUpdateActivityFormDto.activityForm.reminderDate?.toString();
    let newStartDate = new Date(startDate);
    let newDueDate = new Date(dueDate);
    let newReminderDate = new Date(reminderDate);

    var momenStarttObj = moment(newStartDate);

    var momentDueObj = moment(newDueDate);
    var momentReminderObj = moment(newReminderDate);

    this.createOrUpdateActivityFormDto.activityForm.startDate = momenStarttObj;
    this.createOrUpdateActivityFormDto.activityForm.dueDate = momentDueObj;
    this.createOrUpdateActivityFormDto.activityForm.reminderDate = momentReminderObj;

    // this.SubTaskObj.subActivityAssignees = this.selectedSubTaskAssigneesArray;
    this.pushSubActivities();

    let activityUpdateCountDto = new ActivityUpdateCountDto();
    this.ActivityFormServiceProxy.createOrUpdateActivityForm(
      this.createOrUpdateActivityFormDto
    ).subscribe(
      (res) => {
        this.saving = false;
        if (res.activitiesIds.length > 0) {
          this.modalRef.hide();
          this.notify.success("Data Saved Successfully");
          this.activityCount.taskCount = 0;
          this.activityCount.issueCount = 0;
          if (
            this.createOrUpdateActivityFormDto.activityForm.activityType == 1
          ) {
            //Task
            this.activityCount.taskCount = 1;
          } else {
            this.activityCount.issueCount = 1;
            if (
              this.createOrUpdateActivityFormDto.activityForm.subActivities &&
              this.createOrUpdateActivityFormDto.activityForm.subActivities
                .length > 0
            ) {
              this.activityCount.taskCount = this.createOrUpdateActivityFormDto.activityForm.subActivities.length;
            }
          }
          this.onSave.emit(this.activityCount);
        }
      },
      (err) => {
        this.errMsg = " * An Errror Occured *";
        this.notify.error("Data not Saved");
        this.activityCount.taskCount = 0;
        this.activityCount.issueCount = 0;
        this.onSave.emit(this.activityCount);
      }
    );
  }

  getBusinessUnitlist() {
    this.ActivityFormServiceProxy.getBUFromEMS().subscribe((res) => {
      this.BusinessUnitList = res;
    });
  }

  getFilteredActivityAssignees(prefix: string) {
    this.filteredActivityAssignees = [];
    if (prefix.trim() != "") {
      this.ActivityFormServiceProxy.getUsersFromEMS(prefix).subscribe((res) => {
        this.filteredActivityAssignees = res;
      });
    }
  }

  getFilteredSubTaskAssignees(prefix: string) {
    this.filteredSubTaskAssignees = [];
    if (prefix.trim() != "") {
      this.ActivityFormServiceProxy.getUsersFromEMS(prefix).subscribe((res) => {
        this.filteredSubTaskAssignees = res;
      });
    }
  }

  getFilteredActivityFollowers(prefix: string) {
    this.filteredActivityFollowers = [];
    if (prefix.trim() != "") {
      this.ActivityFormServiceProxy.getUsersFromEMS(prefix).subscribe((res) => {
        this.filteredActivityFollowers = res;
      });
    }
  }

  BUvalidation(buID: number) {
    this.BusinessUnitErrorMsg = "";
    if (buID > 0) {
      this.createOrUpdateActivityFormDto.activityForm.businessUnitId = buID;
    } else {
      this.BusinessUnitErrorMsg = "This field is required";
    }
  }

  bindStructureper(per: number) {
    console.log(per);
    this.createOrUpdateActivityFormDto.activityForm.priorityId = per;
  }

  checkfollowupValue() {
    this.followupErrMsg = "";
    if (this.selectedFollowersArray.length == 0) {
      this.filteredActivityFollowers = [];
      this.followupErrMsg = "This field is required";
    }
  }

  checkValue2() {
    this.orgnizererrmsg = "";
    if (this.selectedAssigneesArray.length == 0) {
      this.filteredActivityAssignees = [];
      this.orgnizererrmsg = "This field is required";
    }
  }

  formateUTCDate(momentDate: moment.Moment) {
    return moment(new Date(momentDate.toString()));
  }

  get activityType() {
    return ActivityType;
  }

  DateValidation() {
    if (
      this.createOrUpdateActivityFormDto.activityForm.startDate != undefined &&
      this.createOrUpdateActivityFormDto.activityForm.startDate.toString() !=
        "" &&
      this.createOrUpdateActivityFormDto.activityForm.dueDate != undefined &&
      this.createOrUpdateActivityFormDto.activityForm.dueDate.toString() != ""
    ) {
      if (
        this.createOrUpdateActivityFormDto.activityForm.dueDate <
        this.createOrUpdateActivityFormDto.activityForm.startDate
      ) {
        this.DueDateError = true;
      } else {
        this.DueDateError = false;
      }
    }

    if (
      this.createOrUpdateActivityFormDto.activityForm.startDate != undefined &&
      this.createOrUpdateActivityFormDto.activityForm.startDate.toString() != ""
    ) {
      if (
        this.createOrUpdateActivityFormDto.activityForm.reminderDate !=
          undefined &&
        this.createOrUpdateActivityFormDto.activityForm.reminderDate.toString() !=
          ""
      ) {
        if (
          this.createOrUpdateActivityFormDto.activityForm.reminderDate <
          this.createOrUpdateActivityFormDto.activityForm.startDate
        ) {
          this.ReminderDateError = true;
        } else {
          this.ReminderDateError = false;
        }
      }
    }

    if (
      this.createOrUpdateActivityFormDto.activityForm.dueDate != undefined &&
      this.createOrUpdateActivityFormDto.activityForm.dueDate.toString() != ""
    ) {
      if (
        this.createOrUpdateActivityFormDto.activityForm.reminderDate !=
          undefined &&
        this.createOrUpdateActivityFormDto.activityForm.reminderDate.toString() !=
          ""
      ) {
        if (
          this.createOrUpdateActivityFormDto.activityForm.dueDate <
          this.createOrUpdateActivityFormDto.activityForm.reminderDate
        ) {
          this.ReminderDueDateError = true;
        } else {
          this.ReminderDueDateError = false;
        }
      }
    }
  }
}
