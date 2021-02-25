import { Component, OnInit } from "@angular/core";
import {
  FormPreviewServiceProxy,
  FormSubsectionDto,
} from "@shared/service-proxies/service-proxies";
import { ActivatedRoute } from "@angular/router";
import { FormStructureType } from "@shared/enums/form-structure-type";

@Component({
  selector: "app-preview-subsection",
  templateUrl: "./preview-subsection.component.html",
  styleUrls: ["./preview-subsection.component.css"],
})
export class PreviewSubsectionComponent implements OnInit {
  subsection: FormSubsectionDto;
  formId: number;
  subSectionId: number;
  isLoading: boolean;
  isStructureLoaded: boolean;

  constructor(
    private formServiceProxy: FormPreviewServiceProxy,
    private route: ActivatedRoute
  ) {
    this.isLoading = false;
    this.isStructureLoaded = false;
  }

  ngOnInit(): void {
    this.handleParametersAndRequestForm(this.route);
    console.log("SubSectionID " + this.subSectionId);
  }

  handleParametersAndRequestForm(route: ActivatedRoute) {
    route.paramMap.subscribe((params) => {
      const formId = params.get("formId");
      this.formId = formId ? +formId : 0;

      const subSectionId = params.get("subsectionId");
      this.subSectionId = subSectionId ? +subSectionId : 0;

      if (this.formId > 0 && this.subSectionId > 0) {
        this.getFormPreviewStructure(this.formId, this.subSectionId);
      }
    });
  }

  getFormPreviewStructure(formId: number, subSectionId: number) {
    this.isLoading = true;
    this.formServiceProxy
      .getFormPreviewStructure(formId, subSectionId)
      .subscribe(
        (data) => {
          this.subsection = data;
          console.log("🚀 this.formSubsectionData", this.subsection);
          this.isStructureLoaded = true;
          this.isLoading = false;
        },
        (error) => {
          this.isStructureLoaded = false;
          this.isLoading = false;
        }
      );
  }

  get structureType() {
    return FormStructureType;
  }
}
