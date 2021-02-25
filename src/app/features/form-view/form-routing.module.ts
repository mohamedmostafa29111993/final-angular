import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { BusinessFormComponent } from "./business-form/business-form.component";
import { FormDataViewEditComponent } from "./form-data-view-edit/form-data-view-edit.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "data/view-edit",
    pathMatch: "full",
  },
  {
    path: ":type",
    component: BusinessFormComponent,
    children: [
      {
        path: "view-edit",
        component: FormDataViewEditComponent,
      },
      {
        path: "view-edit/:formId",
        component: FormDataViewEditComponent,
      },
      {
        path: "view-edit/:formId/:businessUnitId/:yearId/:month/:weeks",
        component: FormDataViewEditComponent,
      },
    ],
  },
];
@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormRoutingModule {}
