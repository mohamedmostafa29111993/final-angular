import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { AdminCodeEffectComponent } from "./admin/admin-code-effect/admin-code-effect.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: "",
        component: AppComponent,
        children: [
          { path: "", redirectTo: "business-form", pathMatch: "full" },
          {
            path: "home",
            component: HomeComponent,
          },
          {
            path: "users",
            loadChildren: () =>
              import("./features/users/users.module").then(
                (m) => m.UsersModule
              ),
            data: { permission: "Pages.Users" },
          },
          {
            path: "roles",
            loadChildren: () =>
              import("./features/roles/roles.module").then(
                (m) => m.RolesModule
              ),
            data: { permission: "Pages.Roles" },
          },
          {
            path: "tenants",
            loadChildren: () =>
              import("./features/tenants/tenants.module").then(
                (m) => m.TenantsModule
              ),
            data: { permission: "Pages.Tenants" },
          },
          {
            path: "business-form",
            loadChildren: () =>
              import("app/features/form-view/form.module").then(
                (m) => m.FormModule
              ),
          },
          {
            path: "admin-code-effect",
            component: AdminCodeEffectComponent,
            data: { permission: "Pages.CodeEffect" },
          },
          {
            path: "form-assignment",
            loadChildren: () =>
              import(
                "app/features/form-assignment/form-assignment.module"
              ).then((m) => m.FormAssignmentModule),
            data: { permission: "Pages.FormAssignment" },
          },
          {
            path: "formsList",
            loadChildren: () =>
              import("app/features/form-list/form-list.module").then(
                (m) => m.FormListModule
              ),
            data: { permission: "Pages.FormList" },
          },
          {
            path: "form-design/:formId",
            loadChildren: () =>
              import("app/features/form-designer/form-designer.module").then(
                (m) => m.FormDesignerModule
              ),
            data: { permission: "Pages.FormList" },
          },
          {
            path: "preview-subsection/:formId/:subsectionId",
            loadChildren: () =>
              import("app/features/form-preview/form-preview.module").then(
                (m) => m.FormPreviewModule
              ),
            data: { permission: "Pages.FormList" },
          },
        ],
      },
    ]),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
