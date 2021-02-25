import { NgModule } from "@angular/core";

import { UsersRoutingModule } from "./users-routing.module";
import { CreateUserDialogComponent } from "./components/users/create-user/create-user-dialog.component";
import { EditUserDialogComponent } from "./components/users/edit-user/edit-user-dialog.component";
import { ResetPasswordDialogComponent } from "./components/users/reset-password/reset-password.component";
import { UsersComponent } from "./components/users/users.component";
import { SharedModule } from "@shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AbpValidationSummaryComponent } from "@shared/components/validation/abp-validation.summary.component";
import { ModalModule } from "ngx-bootstrap/modal";
import { ChangePasswordComponent } from "./components/users/change-password/change-password.component";

@NgModule({
  declarations: [
    UsersComponent,
    CreateUserDialogComponent,
    EditUserDialogComponent,
    ResetPasswordDialogComponent,
    ChangePasswordComponent,
  ],
  imports: [
    UsersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ModalModule.forChild(),
  ],
  entryComponents: [
    CreateUserDialogComponent,
    EditUserDialogComponent,
    ResetPasswordDialogComponent,
    AbpValidationSummaryComponent,
  ],
})
export class UsersModule {}
