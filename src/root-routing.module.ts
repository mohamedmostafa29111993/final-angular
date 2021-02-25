import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppRouteGuard } from "@shared/auth/auth-route-guard";

const routes: Routes = [
  { path: "", redirectTo: "app", pathMatch: "full" },
  {
    path: "account",
    loadChildren: () =>
      import("account/account.module").then((m) => m.AccountModule), // Lazy load account module
    data: { preload: true },
    canActivate: [AppRouteGuard],
  },
  {
    path: "app",
    loadChildren: () => import("app/app.module").then((m) => m.AppModule), // Lazy load account module
    data: { preload: true },
    canActivate: [AppRouteGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
})
export class RootRoutingModule {}
