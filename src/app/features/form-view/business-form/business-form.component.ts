import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FormHeaderComponent } from "../form-header/form-header.component";

@Component({
  selector: "app-business-form",
  templateUrl: "./business-form.component.html",
  styleUrls: [
    "./business-form.component.css",
    "../../../../assets/style/form.css",
  ],
})
export class BusinessFormComponent implements OnInit {
  @ViewChild(FormHeaderComponent) header: FormHeaderComponent;
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.route.firstChild.paramMap.subscribe((params) => {
      const formId = +params.get("formId");
      const businessUnitId = +params.get("businessUnitId");
      const yearId = +params.get("yearId");
      const monthId = +params.get("month");
      const weekId = +params.get("weeks");

      if (formId && formId > 0) {
        this.header.selectedFormId = formId;
      }
      if (businessUnitId && businessUnitId > 0) {
        this.header.selectedBuId = businessUnitId;
      }
      if (yearId && yearId > 0) {
        this.header.selectedYearValueId = yearId;
      }
      if (monthId && monthId > 0) {
        this.header.selectedMonthValueId = monthId;
      }

      if (weekId && weekId > 0) {
        this.header.selectedWeekValueId = weekId;
      }
    });
  }
}
