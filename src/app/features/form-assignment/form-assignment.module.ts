import { CreatFormAssignmentComponent } from "./components/creat-form-assignment/creat-form-assignment.component";
import { NgModule } from "@angular/core";

import { FormAssignmentRoutingModule } from "./form-assignment-routing.module";
import { SharedModule } from "@shared/shared.module";
import { FormAssignmentComponent } from "./components/form-assignment/form-assignment.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ModalModule } from "ngx-bootstrap/modal";

@NgModule({
  declarations: [FormAssignmentComponent, CreatFormAssignmentComponent],
  imports: [
    FormAssignmentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class FormAssignmentModule {}
