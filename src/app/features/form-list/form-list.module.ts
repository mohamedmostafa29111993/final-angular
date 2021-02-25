import { AddNewFormComponent } from "./components/add-new-form/add-new-form.component";
import { FormsListComponent } from "./components/forms-list/forms-list.component";
import { NgModule } from "@angular/core";

import { FormListRoutingModule } from "./form-list-routing.module";
import { SharedModule } from "@shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ModalModule } from "ngx-bootstrap/modal";

@NgModule({
  declarations: [FormsListComponent, AddNewFormComponent],
  imports: [
    FormListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class FormListModule {}
