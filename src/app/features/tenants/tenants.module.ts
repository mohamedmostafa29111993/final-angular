import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { TenantsRoutingModule } from "./tenants-routing.module";
import { CreateTenantDialogComponent } from "./components/tenants/create-tenant/create-tenant-dialog.component";
import { EditTenantDialogComponent } from "./components/tenants/edit-tenant/edit-tenant-dialog.component";
import { TenantsComponent } from "./components/tenants/tenants.component";
import { SharedModule } from "@shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ModalModule } from "ngx-bootstrap/modal";

@NgModule({
  declarations: [
    TenantsComponent,
    CreateTenantDialogComponent,
    EditTenantDialogComponent,
  ],
  imports: [
    TenantsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ModalModule.forChild(),
  ],
  entryComponents: [
    // tenants
    CreateTenantDialogComponent,
    EditTenantDialogComponent,
  ],
})
export class TenantsModule {}
