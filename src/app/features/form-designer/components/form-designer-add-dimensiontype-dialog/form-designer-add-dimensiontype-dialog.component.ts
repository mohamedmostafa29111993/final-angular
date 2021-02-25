import { EventEmitter, Output } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import {
  DimetionTypeDropdownDto,
  StructureServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { BsModalRef } from "ngx-bootstrap/modal";

@Component({
  selector: "app-form-designer-add-dimensiontype-dialog",
  templateUrl: "./form-designer-add-dimensiontype-dialog.component.html",
  styleUrls: ["./form-designer-add-dimensiontype-dialog.component.css"],
})
export class FormDesignerAddDimensiontypeDialogComponent implements OnInit {
  DimentionTypes: DimetionTypeDropdownDto[];
  selectedDimentionTypeId: number = 0;
  IsValidForm: boolean = true;
  @Output() DimentionTypeSelected = new EventEmitter<any>();

  constructor(
    private _formDesignerService: StructureServiceProxy,
    public bsModalRef: BsModalRef
  ) {}

  ngOnInit(): void {
    this._formDesignerService.getDimentionsType().subscribe((result) => {
      this.DimentionTypes = result;
    });
  }

  save(): void {
    if (this.selectedDimentionTypeId) {
      this.DimentionTypeSelected.emit(this.selectedDimentionTypeId);
      this.bsModalRef.hide();
    } else {
      this.IsValidForm = false;
    }
  }
}
