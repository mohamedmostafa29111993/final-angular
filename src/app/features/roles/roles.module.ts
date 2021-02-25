import { NgModule } from "@angular/core";

import { RolesRoutingModule } from "./roles-routing.module";
import { CreateRoleDialogComponent } from "./components/roles/create-role/create-role-dialog.component";
import { EditRoleDialogComponent } from "./components/roles/edit-role/edit-role-dialog.component";
import { RolesComponent } from "./components/roles/roles.component";
import { SharedModule } from "@shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ModalModule } from "ngx-bootstrap/modal";

@NgModule({
  declarations: [
    RolesComponent,
    CreateRoleDialogComponent,
    EditRoleDialogComponent,
  ],
  imports: [
    RolesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ModalModule.forChild(),
  ],
  entryComponents: [CreateRoleDialogComponent, EditRoleDialogComponent],
})
export class RolesModule {}
