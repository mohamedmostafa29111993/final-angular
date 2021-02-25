import { ActivitiesCellDto } from "@shared/service-proxies/service-proxies";


//--------------------------------ActivityModel---------------------------------
export class ActivityAssigneeModel {
    public SID: string;
    public Name?: string;
    public Title?: string;
    public Company?: string;
    public Login?:string;
    public Id?: number;
    public UserId?: number;
    public TaskId?: number;
    public IsDeleted: boolean;
    public ManagerSID?: string;
    public ManagerName?: string;
    public ManagerTitle?: string;
    public ManagerLogin?:string;

    constructor() {
        this.SID = '';
        this.Id = 0;
        this.UserId = 0;
        this.Name = '';
        this.Title = '';
        this.Company = '';
        this.Login = '';
        this.TaskId = 0;
        this.IsDeleted = false;
        this.ManagerSID = '';
        this.ManagerName = '';
        this.ManagerTitle = '';
        this.ManagerLogin = '';
    }

}
export class ActivityFollowerModel {
    public SID: string;
    public Name?: string;
    public Title?: string;
    public Login?:string;
    public Id?: number;
    public UserId?: number;
    public TaskId?: number;
    public IsDeleted: boolean;
    public ManagerSID?: string;
    public ManagerName?: string;
    public ManagerTitle?: string;
    public ManagerLogin?:string;

    constructor() {
        this.SID = '';
        this.Id = 0;
        this.UserId = 0;
        this.Name = '';
        this.Title = '';
        this.Login = '';
        this.TaskId = 0;
        this.IsDeleted = false;
        this.ManagerSID = '';
        this.ManagerName = '';
        this.ManagerTitle = '';
        this.ManagerLogin = '';
    }

}
export class BusinessUnitModel {
    public BusinessUnitId: number;
    public DisplayName: string;
}
export class ActivityModel {
    constructor() { }
    public ActivityId: number;
    public ActivityTitle: string;
    public ActivityDescription: string;
    public CreatedDate: Date;
    public DueDate: Date;
    public StartDate: Date;
    public EndDate: Date;
    public Progress;
    public IsRaisedBefore: boolean;
    public StatueId: number;
    public PriorityId: number;
    public PriorityName: string;
    public ActivityTypeId: number;
    public ActivityTypeName: string;
    public ProjectCategoryId;
    public ProjectCategoryName;
    public ProjectNameString;
    public ListStatusData: any[];
    public BusinessUnitDepartmentId: number;
    public StatusName: string;
    public ReminderDate: Date;
    public ReminderTimeInt: number;
    public ReminderTimeString: string;
    public ListBusinessUnits: BusinessUnitModel[];
    public ListBusinessUnitsSource = [];
    public BusinessUnitDepartmentList: BusinessUnitDepartmentModel[];
    public BusinessUnitDepartmentListSource: BusinessUnitDepartmentModel[];
    public ActivityAssigneesList: ActivityAssigneeModel[];
    public ActivityFollowersList: ActivityFollowerModel[];
    public ListPriorities: any[];
    public ListActivityTypes: any[];
    public ListProjectCategories: any[];
    public ListProjectNames: any[];
    public ListAttachments: any[];
    public PriorityCode: number;
    public IsOnbehalf: boolean;
    public HasPermission: boolean;
    public HasOnbehalfPermission: boolean;
    public ListSubActivities: any[];
    public ListRaisedBefore: any[];
    public RaisedBeforesList: any[];
    public IsSubActivity: boolean;
    public IsSubIssue:boolean;
    public ParentStartDate: Date;
    public ParentDueDate: Date;
    public ParentTitle: string;
    public ParentActivityId: number;
    public IsSend: boolean;
    public ActivityStateId: number = 0;
    public ActivityStateName: string;
    public IsClose: number;
    public ProjectId: number;
    public ProjectName: string;
    public IsProjectServer: string;
    public ActivityStateList: any[];
    public BusinessUnitIds: number[];
    public BusinessUnitDepartmentIds: number[];
    public ReminderJobConfiguredTime: string;
    public CreatorName: string;
    public onBehalfCreatorName: string;
    public CreatorPosition: string;
    public HaveRelatedTasks: boolean;
    public ButtonClicked: number;
    public ListActivityTasks;
    public ParentActivityClose;
    public TotalNoRelatedTask: number;
    public TotalNoComment: number;
    public IssueType: any;
    public UpdatedByName: string;
    public IsHold: boolean;
    public ActivityServerId: number;
    public IsReminded: boolean;
    public DeletedListBusinessUnits:string;
    public DeletedBusinessUnitDepartmentList:string;
    public DeletedProjectCategoryName;
    public DeletedProjectNameString;
    public AssigneeTaskId;
    public IsAssignee;
    public ProjectLink;
    public TaskAssigneeLink;
    public IsQuickActivityFromDashBoard: boolean;
    public DashboardId: number;


    //issue properties
    public IssueID;
    public IsOnlyRelatedTask;
    public IsRelatedTask;
    public IssueDueDate;
    public UpdateIssueDueDate;
    public RaisedBeforeCustomModelList: any[];
    public IsSelected: number;
    public ListIssueTypes: any[];
    public IssueTypeId: number;
    public IssueTypeName: string;

    //Meeting properties
    public MeetingActivityItemIsPlanned:boolean;
    public IsMeetingActivityItem:boolean;
    public RaisedByLogin:string;
    public SubActivity:ActivityModel;
}


export class QuickActivityModel{
    public    quickActivityTitle= "";
    public    quickActivityDueDate= "";
    public    quickActivityAssigneList= [];
    public    quickActivityRaisedBy= "";

}

export class BusinessUnitDepartmentModel {
    public BusinessUnitDepartmentID: number;
    public BusinessUnitDepartmentName: string;
    public BusinessUnitID: number;
    public DepartmentID: number;
}

export class ActivityOutputDto {
  public cells: ActivitiesCellDto[];
  public activityTypeId: number;
  public RowId: number;
  public Week: number;
  public Month: number;
  public Year: number;

}
export class ActivityUpdateCountDto {
    public dataRowId: number;
    public isAdded: boolean;
  }



