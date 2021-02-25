import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  FormSectionDto,
  FormStructureDataDto,
  FormViewServiceProxy,
  FormSubsectionDto,
  FormSubsectionDtoPagedResultDto,
  CalenderServiceProxy,
  CalenderDto,
} from "@shared/service-proxies/service-proxies";
import { AppConsts } from "@shared/AppConsts";
@Component({
  selector: "app-form-data-view-edit",
  templateUrl: "./form-data-view-edit.component.html",
  styleUrls: [
    "./form-data-view-edit.component.css",
    "../../../../assets/style/form.css",
  ],
})
export class FormDataViewEditComponent implements OnInit {
  formId: number;
  sectionId: number;
  formTypeId: number;
  businessUnitId: number;
  yearId: number;
  month: number;
  weeks: number[];
  formSubsectionDto: FormSubsectionDto[];
  formStructureData: FormStructureDataDto;
  formSections: FormSectionDto[];
  showSelectForm: boolean;
  showSelectBusinessUnit: boolean;
  isStructureLoaded: boolean;
  isDataLoaded: boolean;
  isLoading: boolean;
  maxResultCount = 1;
  targetSection = 0;
  weeksCalender: CalenderDto[];
  // start coding -By Meska-
  noBusinessForm: boolean = true;
  // end coding -By Meska-

  // private _todos: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  // public readonly todos: Observable<any> = this._todos.asObservable();
  // @ViewChild(AddTaskComponent) addTaskAndIssueComponent: AddTaskComponent;
  // @ViewChild(AddMeetingComponent) addMeetingComponent: AddMeetingComponent;
  // updateActivitiesCountEventsSubject: Subject<ActivityUpdateCountDto> = new Subject<ActivityUpdateCountDto>();

  constructor(
    private formViewServiceProxy: FormViewServiceProxy,
    private calenderServiceProxy: CalenderServiceProxy,
    private route: ActivatedRoute
  ) {
    this.formSections = [];
    this.isStructureLoaded = false;
    this.isDataLoaded = false;
    this.isLoading = false;
    this.weeksCalender = [];
  }
  ngOnInit(): void {
    this.handleParametersAndRequestForm(this.route);
  }
  handleParametersAndRequestForm(route: ActivatedRoute) {
    debugger;
    route.paramMap.subscribe((params) => {
      const formId = params.get("formId");
      this.formId = formId ? +formId : 0;
      const businessUnitId = params.get("businessUnitId");
      this.businessUnitId = businessUnitId ? +businessUnitId : 0;

      const yearId = params.get("yearId");
      this.yearId = yearId ? +yearId : 0;

      const monthId = params.get("month");
      this.month = monthId ? +monthId : 0;

      const weekId = params.get("weeks");
      this.weeks = weekId && +weekId > 0 ? [+weekId] : [0];

      if (this.formId > 0 && this.businessUnitId > 0) {
        //this.getFormStructureData(this.formId, this.businessUnitId,this.weeks ,this.month , this.yearId);
        this.getFormStructureAndData(
          this.formId,
          this.businessUnitId,
          this.weeks,
          this.month,
          this.yearId,
          "",
          this.maxResultCount,
          0
        );
      }
      if (this.month > 0) {
        this.getWeeksCalender(this.month);
      }
    });
  }
  async getFormStructureAndData(
    formId: number,
    businessUnitId: number,
    weeks: number[],
    month: number,
    year: number,
    sorting: string,
    maxResultCount: number,
    skipCount: number
  ) {
    debugger;
    // start coding -By Meska-
    this.noBusinessForm = false;
    // end coding -By Meska-
    this.isLoading = true;
    this.formViewServiceProxy
      .getAllFormSections(formId, businessUnitId, weeks, month, year)
      .subscribe(
        async (data) => {
          this.formStructureData = data;
          this.formSections = this.formStructureData.sections;

          for (let x = 0; x < this.formSections.length; x++) {
            await this.GetSubSectionData(
              this.formSections[x].id,
              formId,
              businessUnitId,
              weeks,
              month,
              year,
              sorting,
              maxResultCount,
              skipCount
            );
          }
          // await this.GetSubSectionData(
          //     this.formSections[1].id,
          //     formId,
          //     businessUnitId,
          //     weeks,
          //     month,
          //     year,
          //     sorting,
          //     maxResultCount,
          //     skipCount
          //   )
          this.isLoading = false;

          // this.formSections?.forEach((x) => {
          // (this.GetSubSectionData(x.id, formId, businessUnitId, weeks, month, year, sorting, maxResultCount, skipCount));
          // });
          debugger;
          console.log(this.formStructureData.sections);
          //this.isStructureLoaded = true;
        },
        (error) => {
          this.isStructureLoaded = false;
          this.isLoading = false;
        }
      );
  }

  async GetSubSectionData(
    sectionId: number,
    formId: number,
    businessUnitId: number,
    weeks: number[],
    month: number,
    year: number,
    sorting: string,
    maxResultCount: number,
    skipCount: number
  ) {
    //this.isLoading = true;
    this.formViewServiceProxy
      .getCompressedSubSectionStructureAndData(
        sectionId,
        formId,
        businessUnitId,
        weeks,
        month,
        year,
        sorting,
        maxResultCount,
        skipCount
      )
      .subscribe((data) => {
        let decompressedData = this.decompressData(data);
        let res: FormSubsectionDtoPagedResultDto = JSON.parse(decompressedData);
        if (res && res.items?.length > 0) {
          let section = this.formSections.find(
            (x) => x.id == res.items[0].parentId
          );
          if (!section.subsections) {
            section.subsections = [];
          }
          section.subsections = section.subsections.concat(res.items);
          //debugger;
          let skipCount = section.subsections.length;
          //+ this.maxResultCount;
          let isLastPage = skipCount >= res.totalCount ? true : false;
          if (!isLastPage) {
            // debugger;
            this.GetSubSectionData(
              sectionId,
              formId,
              businessUnitId,
              weeks,
              month,
              year,
              sorting,
              maxResultCount,
              skipCount
            );
          }
        }
      });
    // res.items.forEach(s => {
    //   let section = this.formSections.find(x => x.id == s.parentId);
    //   if (section) {
    //     if (!section.subsections) {
    //       section.subsections = [];
    //     }
    //     section.subsections.push(s);
    //     // this.skipCount += this.maxResultCount;
    //     // this.isLastPage = this.skipCount >= res.totalCount ? true : false;
    //     let skipCount = section.subsections.length + this.maxResultCount;
    //     let isLastPage = skipCount >= res.totalCount ? true : false;
    //     if (!isLastPage) {
    //       debugger;
    //       this.GetSubSectionData(sectionId, formId, businessUnitId, weeks, month, year, sorting, maxResultCount,skipCount);
    //     }
    //     else{
    //       this.isLoading = false;
    //     }

    //   }
    // })
  }
  // getFormStructureData(formId: number, businessUnitId: number,weeks: number[], month: number,year: number) {
  // debugger
  //   this.isLoading = true;
  //   this.formServiceProxy.getCompressedFormStructureAndData(formId, businessUnitId,weeks,month,year).subscribe(
  //     data => {
  //       let decompressedData = this.decompressData(data);
  //       this.formStructureData = JSON.parse(decompressedData);;
  //        debugger
  //       this.formSections = this.formStructureData.sections;
  //       console.log(this.formStructureData.sections)
  //       this.isStructureLoaded = true;
  //       this.isLoading = false;
  //     }, error => {
  //       this.isStructureLoaded = false;
  //       this.isLoading = false;
  //     });
  // }

  isValidFormStructure(): boolean {
    let isValid = false;
    if (this.formStructureData?.sections?.length > 0) {
      isValid = true;
    }
    return isValid;
  }
  getExportUrl() {
    debugger;
    let url = AppConsts.remoteServiceBaseUrl + "/ExcelExportFile/index?";
    url =
      url +
      "FormId=" +
      this.formId +
      "&BusinessUnitId=" +
      this.businessUnitId +
      "&MonthId=" +
      this.month +
      "&year=2020";
    window.open(url);
  }
  decompressData(data: string): string {
    var pako = require("pako");
    try {
      const result = pako.inflate(atob(data), { to: "string" });
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  // start coding -By Meska-
  toggleTableContent($event) {
    var tableContent = $event.target.parentNode.getElementsByClassName(
      "table-content"
    )[1];
    var icon = $event.target.firstChild;

    if (icon?.classList?.contains("fa-chevron-down") == true) {
      icon.classList.remove("fa-chevron-down");
      icon.classList.add("fa-chevron-up");
    } else {
      icon.classList.remove("fa-chevron-up");
      icon.classList.add("fa-chevron-down");
    }

    if (tableContent?.classList?.contains("hidden") == true) {
      tableContent.classList.remove("hidden");
    } else {
      tableContent.classList.add("hidden");
    }
  }
  // end coding -By Meska-

  getWeeksCalender(month: number) {
    this.calenderServiceProxy.getMonthCalender(month).subscribe((data) => {
      debugger;
      this.weeksCalender = data;
    });
  }
}
