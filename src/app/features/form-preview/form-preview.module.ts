import { NgModule } from "@angular/core";

import { FormPreviewRoutingModule } from "./form-preview-routing.module";
import { PreviewSubsectionComponent } from "./components/preview-subsection/preview-subsection.component";
import { FormPreviewRowComponent } from "./components/form-preview-row/form-preview-row.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@shared/shared.module";
import { ModalModule } from "ngx-bootstrap/modal";

@NgModule({
  declarations: [PreviewSubsectionComponent, FormPreviewRowComponent],
  imports: [
    FormPreviewRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class FormPreviewModule {}
