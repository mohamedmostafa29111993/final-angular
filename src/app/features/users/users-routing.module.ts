import { UsersComponent } from "./components/users/users.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ChangePasswordComponent } from "./components/users/change-password/change-password.component";

const routes: Routes = [
  {
    path: "",
    component: UsersComponent,
  },
  { path: "update-password", component: ChangePasswordComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
