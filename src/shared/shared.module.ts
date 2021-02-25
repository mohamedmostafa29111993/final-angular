import { AbpValidationSummaryComponent } from "./components/validation/abp-validation.summary.component";
import { CommonModule } from "@angular/common";
import { NgModule, ModuleWithProviders } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgxPaginationModule } from "ngx-pagination";

import { AppSessionService } from "./session/app-session.service";
import { AppUrlService } from "./nav/app-url.service";
import { AppAuthService } from "./auth/app-auth.service";
import { AppRouteGuard } from "./auth/auth-route-guard";

import { AbpPaginationControlsComponent } from "./components/pagination/abp-pagination-controls.component";
import { AbpModalHeaderComponent } from "./components/modal/abp-modal-header.component";
import { AbpModalFooterComponent } from "./components/modal/abp-modal-footer.component";
import { LayoutStoreService } from "./layout/layout-store.service";

import { BusyDirective } from "./directives/busy.directive";
import { EqualValidator } from "./directives/equal-validator.directive";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { HttpClientModule, HttpClientJsonpModule } from "@angular/common/http";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatRadioModule } from "@angular/material/radio";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { TabsModule } from "ngx-bootstrap/tabs";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import { UiSwitchModule } from "ngx-ui-switch";
import { ServiceProxyModule } from "./service-proxies/service-proxy.module";
import { FilterationPipe } from "./pipes/filteration.pipe";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { LocalizePipe } from "./pipes/localize.pipe";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgSelectModule,
    HttpClientModule,
    HttpClientJsonpModule,
    BsDropdownModule,
    CollapseModule,
    TabsModule,
    ServiceProxyModule,
    NgxPaginationModule,
    InfiniteScrollModule,
    UiSwitchModule,
    DragDropModule,
    NgbModule,
    MatExpansionModule,
    MatMenuModule,
    MatButtonModule,
    MatListModule,
    NgxSkeletonLoaderModule,
    MatRadioModule,
    MatCheckboxModule,
    TooltipModule,
  ],
  declarations: [
    AbpPaginationControlsComponent,
    AbpModalHeaderComponent,
    AbpModalFooterComponent,
    BusyDirective,
    EqualValidator,
    FilterationPipe,
    AbpValidationSummaryComponent,
    LocalizePipe,
  ],
  exports: [
    AbpPaginationControlsComponent,
    AbpModalHeaderComponent,
    AbpModalFooterComponent,
    BusyDirective,
    EqualValidator,
    NgSelectModule,
    HttpClientModule,
    HttpClientJsonpModule,
    BsDropdownModule,
    CollapseModule,
    TabsModule,
    ServiceProxyModule,
    NgxPaginationModule,
    InfiniteScrollModule,
    UiSwitchModule,
    DragDropModule,
    NgbModule,
    MatExpansionModule,
    MatMenuModule,
    MatButtonModule,
    MatListModule,
    NgxSkeletonLoaderModule,
    MatRadioModule,
    MatCheckboxModule,
    TooltipModule,
    CommonModule,
    FilterationPipe,
    AbpValidationSummaryComponent,
    LocalizePipe,
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        AppSessionService,
        AppUrlService,
        AppAuthService,
        AppRouteGuard,
        LayoutStoreService,
      ],
    };
  }
}
