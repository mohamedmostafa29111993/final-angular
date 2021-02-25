import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { ColumnMeasureComponent } from "./components/form-designer-body/column-measure/column-measure.component";
import { NgModule } from "@angular/core";

import { FormDesignerRoutingModule } from "./form-designer-routing.module";
import { CopyKpisComponent } from "./components/copy-kpis-dialog/copy-kpis-dialog.component";
import { FormDesignDimensionComponent } from "./components/form-design-dimension/form-design-dimension.component";
import { FormDesignKpiComponent } from "./components/form-design-kpi/form-design-kpi.component";
import { FormDesignComponent } from "./components/form-design/form-design.component";
import { FormDesignerAddDimensionDialogComponent } from "./components/form-designer-add-dimension-dialog/form-designer-add-dimension-dialog.component";
import { FormDesignerAddDimensiontypeDialogComponent } from "./components/form-designer-add-dimensiontype-dialog/form-designer-add-dimensiontype-dialog.component";
import { FormDesignerAddKpiDialogComponent } from "./components/form-designer-add-kpi-dialog/form-designer-add-kpi-dialog.component";
import { FormDesignerAddMeasureDialogComponent } from "./components/form-designer-add-measure-dialog/form-designer-add-measure-dialog.component";
import { FormDesignerAddSectionDialogComponent } from "./components/form-designer-add-section-dialog/form-designer-add-section-dialog.component";
import { FormDesignerAddSubsectionDialogComponent } from "./components/form-designer-add-subsection-dialog/form-designer-add-subsection-dialog.component";
import { FormDesignerBodyComponent } from "./components/form-designer-body/form-designer-body.component";
import { FormDesignerPivotControlDialogComponent } from "./components/form-designer-pivot-control-dialog/form-designer-pivot-control-dialog.component";
import { FormDesignerRowComponent } from "./components/form-designer-row/form-designer-row.component";
import { FormDesignerSectionComponent } from "./components/form-designer-section/form-designer-section.component";
import { SumDimensionsDialogComponent } from "./components/sum-dimensions-dialog/sum-dimensions-dialog.component";
import { SharedModule } from "@shared/shared.module";
import { ModalModule } from "ngx-bootstrap/modal";

@NgModule({
  declarations: [
    FormDesignComponent,
    FormDesignKpiComponent,
    FormDesignerSectionComponent,
    FormDesignerBodyComponent,
    FormDesignDimensionComponent,
    FormDesignerAddKpiDialogComponent,
    FormDesignerRowComponent,
    FormDesignerAddSectionDialogComponent,
    FormDesignerAddDimensionDialogComponent,
    FormDesignerAddMeasureDialogComponent,
    FormDesignerAddSubsectionDialogComponent,
    FormDesignerPivotControlDialogComponent,
    CopyKpisComponent,
    SumDimensionsDialogComponent,
    ColumnMeasureComponent,
    FormDesignerAddDimensiontypeDialogComponent,
  ],
  imports: [
    FormDesignerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class FormDesignerModule {}
