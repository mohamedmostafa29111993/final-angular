import { NgModule } from "@angular/core";
import { FormRoutingModule } from "./form-routing.module";
import { FormHeaderComponent } from "./form-header/form-header.component";
import { BusinessFormComponent } from "./business-form/business-form.component";
import { FormDataRowComponent } from "./form-data-row/form-data-row.component";
import {
  FormServiceProxy,
  FormBusinessUnitServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { FormDataViewEditComponent } from "./form-data-view-edit/form-data-view-edit.component";
import { FormsModule } from "@angular/forms";
import { AddTaskComponent } from "./add-task/add-task.component";
import { ReactiveFormsModule } from "@angular/forms";
import { AddMeetingComponent } from "./add-meeting/add-meeting.component";
import { SharedModule } from "@shared/shared.module";
import { FormDataBodyComponent } from "./form-data-body/form-data-body.component";
import { ModalModule } from "ngx-bootstrap/modal";

@NgModule({
  declarations: [
    FormHeaderComponent,
    FormDataViewEditComponent,
    BusinessFormComponent,
    FormDataRowComponent,
    AddTaskComponent,
    AddMeetingComponent,
    FormDataBodyComponent,
  ],
  imports: [
    FormRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ModalModule.forChild(),
  ],

  providers: [FormServiceProxy, FormBusinessUnitServiceProxy],
})
export class FormModule {}
