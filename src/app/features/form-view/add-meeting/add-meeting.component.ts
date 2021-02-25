import {
  Component,
  Injector,
  OnInit,
  EventEmitter,
  Output,
} from "@angular/core";
import {
  ActivityModel,
  ActivityAssigneeModel,
  ActivityFollowerModel,
  ActivityUpdateCountDto,
  ActivityOutputDto,
} from "@shared/custom-dtos/activities-Dto";
import { FormGroup, FormControl } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import {
  BusinessUnitListDto,
  BusinessUnitListDtoPagedResultDto,
  ActivityFormDataServiceProxy,
  UsersResultOutput,
  BUResultOutput,
  CreateOrUpdateActivityFormDto,
  ActivityFormEditDto,
  ActivityCountDto,
} from "@shared/service-proxies/service-proxies";
import { BsModalRef } from "ngx-bootstrap/modal";
import { AppSessionService } from "@shared/session/app-session.service";
import * as moment from "moment";
import { NotifyService } from "abp-ng2-module";
import * as _ from "lodash";
import { AppComponentBase } from "@shared/app-component-base";

export enum PriorityEnum {
  High = 2,
  Medium = 3,
  Low = 4,
}

@Component({
  selector: "app-add-meeting",
  templateUrl: "./add-meeting.component.html",
  styleUrls: ["./add-meeting.component.css"],
})
export class AddMeetingComponent extends AppComponentBase implements OnInit {
  // modalRef: BsModalRef;

  public Activity: ActivityModel = new ActivityModel();
  public formData: FormData = new FormData();
  public addTaskForm: FormGroup;
  public BusinessUnitListDtoPagedResultDto: BusinessUnitListDtoPagedResultDto;
  public businessUnitList: BusinessUnitListDto[];
  public Users: UsersResultOutput[] = new Array<UsersResultOutput>();

  public BusinessUnitList: BUResultOutput[] = new Array<BUResultOutput>();
  public AssigneesList: ActivityAssigneeModel[] = new Array<ActivityAssigneeModel>();
  public FollowerList: ActivityFollowerModel[] = new Array<ActivityFollowerModel>();
  public createOrUpdateActivityFormDto: CreateOrUpdateActivityFormDto = new CreateOrUpdateActivityFormDto();

  private priorityEnum = PriorityEnum;
  public taskTypeOptions = [];

  public myControl: FormControl;
  display = "none";
  errMsg: string;
  Organizer: number;
  MeetingRequiredAttendees = [];
  AllRequiredAttendees = [];
  MeetingOptionalAttendees = [];
  AllOptionalAttendees = [];
  MeetingRequiredErrorMsg = "";
  orgnizererrmsg = "";
  BusinessUnitErrorMsg = "";
  saving = false;
  TimeError = false;
  meetingAdded = new BehaviorSubject<boolean>(false);
  activityDto = new ActivityOutputDto();
  // @Output() updateMeetingsCount = new EventEmitter<ActivityUpdateCountDto>();
  @Output() onSave = new EventEmitter<any>();
  activityCount = new ActivityCountDto();

  constructor(
    public modalRef: BsModalRef,
    private ActivityFormServiceProxy: ActivityFormDataServiceProxy,
    private appSessionService: AppSessionService,
    public notify: NotifyService,
    injector: Injector
  ) {
    super(injector);
    this.createOrUpdateActivityFormDto.activityForm = new ActivityFormEditDto();
    this.createOrUpdateActivityFormDto.activityForm.businessUnitId = 0;

    this.taskTypeOptions = Object.keys(this.priorityEnum);
  }

  ngOnInit(): void {
    this.prepareMeetingObj(this.activityDto);
    this.getBusinessUnitlist();
  }

  prepareMeetingObj(ActivityOutput: ActivityOutputDto) {
    this.createOrUpdateActivityFormDto.activityForm = new ActivityFormEditDto();
    this.createOrUpdateActivityFormDto.activityForm.cells =
      ActivityOutput.cells;
    this.createOrUpdateActivityFormDto.activityForm.rowId =
      ActivityOutput.RowId;
    this.createOrUpdateActivityFormDto.activityForm.activityType =
      ActivityOutput.activityTypeId;
    this.createOrUpdateActivityFormDto.activityForm.week = ActivityOutput.Week;
    this.createOrUpdateActivityFormDto.activityForm.month =
      ActivityOutput.Month;
    this.createOrUpdateActivityFormDto.activityForm.year = ActivityOutput.Year;
    this.createOrUpdateActivityFormDto.activityForm.businessUnitId = 0;
    this.errMsg = "";
    this.Organizer = null;
    this.MeetingRequiredAttendees = [];
    this.MeetingOptionalAttendees = [];
    this.AllRequiredAttendees = [];
    this.AllOptionalAttendees = [];
    this.Users = [];
    this.MeetingRequiredErrorMsg = "";
    this.orgnizererrmsg = "";
    this.BusinessUnitErrorMsg = "";
  }

  // saveMeeting() {
  //   console.log("submit cliced");
  //   this.sendMeeting();
  //
  // }

  saveMeeting() {
    this.saving = true;
    let currentuserLoginName = this.appSessionService.getShownLoginName();
    this.createOrUpdateActivityFormDto.activityForm.userLoginName = currentuserLoginName;
    this.createOrUpdateActivityFormDto.activityForm.meetingOrganizerId = this.Organizer;
    this.createOrUpdateActivityFormDto.activityForm.meetingRequiredAttendees = this.MeetingRequiredAttendees;
    this.createOrUpdateActivityFormDto.activityForm.meetingOptionalAttendees = this.MeetingOptionalAttendees;

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
    let activityUpdateCountDto = new ActivityUpdateCountDto();
    console.log(this.createOrUpdateActivityFormDto);
    this.ActivityFormServiceProxy.createOrUpdateActivityForm(
      this.createOrUpdateActivityFormDto
    ).subscribe(
      (res) => {
        console.log(res);

        this.saving = false;
        if (res.activitiesIds.length > 0) {
          this.modalRef.hide();
          this.notify.success("Data Saved Successfully");
          this.activityCount.meetingCount = 1;
          this.onSave.emit(this.activityCount);
        }
      },
      (err) => {
        this.errMsg = " * An Error Occured *";
        this.notify.error("Data not Saved");
        this.activityCount.meetingCount = 0;
        this.onSave.emit(this.activityCount);
      }
    );
  }

  getBusinessUnitlist() {
    this.ActivityFormServiceProxy.getBUFromEMS().subscribe((res) => {
      this.BusinessUnitList = res;
    });
  }

  getUserslist(prefix: string) {
    this.Users = [];
    if (prefix.trim() != "") {
      this.ActivityFormServiceProxy.getUsersFromEMS(prefix).subscribe((res) => {
        this.Users = res;
      });
    }
  }

  bindStructure(buID: number) {
    console.log(buID);
    this.BusinessUnitErrorMsg = "";
    if (buID > 0) {
      this.createOrUpdateActivityFormDto.activityForm.businessUnitId = buID;
    } else {
      this.BusinessUnitErrorMsg = "This field is required";
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

  setAssigneeValue(AssigneeId: number) {
    this.createOrUpdateActivityFormDto.activityForm.meetingOrganizerId = AssigneeId;
  }

  bindStructureper(per: number) {
    console.log(per);
    this.createOrUpdateActivityFormDto.activityForm.priorityId = per;
  }

  onChangeEvent(event: any) {
    this.getUserslist(event.target.value);
  }

  GetMeetingRequiredAttendees(prefix: string) {
    this.AllRequiredAttendees = [];
    if (prefix.trim() != "") {
      this.ActivityFormServiceProxy.getUsersFromEMS(prefix).subscribe((res) => {
        this.AllRequiredAttendees = res;
      });
    }
  }

  GetMeetingOptionalAttendees(prefix: string) {
    this.AllOptionalAttendees = [];
    if (prefix.trim() != "") {
      this.ActivityFormServiceProxy.getUsersFromEMS(prefix).subscribe((res) => {
        this.AllOptionalAttendees = res;
      });
    }
  }

  checkValue() {
    this.MeetingRequiredErrorMsg = "";
    console.log(this.MeetingRequiredAttendees.length);
    if (this.MeetingRequiredAttendees.length == 0) {
      this.MeetingRequiredErrorMsg = "This field is required";
      this.AllRequiredAttendees = [];
    }
  }
  checkValue2() {
    this.orgnizererrmsg = "";
    if (this.Organizer == null || this.Organizer == undefined) {
      this.orgnizererrmsg = "This field is required";
      this.Users = [];
    }
  }

  TimeValidation() {
    if (
      this.createOrUpdateActivityFormDto.activityForm.meetingTimeFrom !=
        undefined &&
      this.createOrUpdateActivityFormDto.activityForm.meetingTimeFrom != "" &&
      this.createOrUpdateActivityFormDto.activityForm.meetingTimeTo !=
        undefined &&
      this.createOrUpdateActivityFormDto.activityForm.meetingTimeTo != ""
    ) {
      if (
        this.createOrUpdateActivityFormDto.activityForm.meetingTimeTo <=
        this.createOrUpdateActivityFormDto.activityForm.meetingTimeFrom
      ) {
        this.TimeError = true;
      } else {
        this.TimeError = false;
      }
    }
  }
}
