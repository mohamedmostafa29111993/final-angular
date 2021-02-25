import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FormsListComponent } from "./components/forms-list/forms-list.component";

const routes: Routes = [
  {
    path: "",
    component: FormsListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormListRoutingModule {}
