import { NgModule } from "@angular/core";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AbpHttpInterceptor } from "abp-ng2-module";

import * as ApiServiceProxies from "./service-proxies";

@NgModule({
    providers: [
        ApiServiceProxies.RoleServiceProxy,
        ApiServiceProxies.SessionServiceProxy,
        ApiServiceProxies.TenantServiceProxy,
        ApiServiceProxies.UserServiceProxy,
        ApiServiceProxies.TokenAuthServiceProxy,
        ApiServiceProxies.AccountServiceProxy,
        ApiServiceProxies.ConfigurationServiceProxy,
        ApiServiceProxies.FormServiceProxy,
        ApiServiceProxies.FormViewServiceProxy,
        ApiServiceProxies.FormBusinessUnitServiceProxy,
        //ApiServiceProxies.SectionServiceProxy,
        ApiServiceProxies.FormDataServiceProxy,
        ApiServiceProxies.BusinessUnitServiceProxy,
        //ApiServiceProxies.FormColumnServiceProxy,
        //ApiServiceProxies.CodeEffectsServiceProxy,
        //ApiServiceProxies.ActivityFormServiceProxy,
        ApiServiceProxies.UserFormServiceProxy,
        //ApiServiceProxies.PermissionRoleFormServiceProxy,
        //ApiServiceProxies.PermissionUserRoleServiceProxy,
        ApiServiceProxies.BusinessRoleServiceProxy,
        ApiServiceProxies.FormStatusServiceProxy,
        ApiServiceProxies.FormPeriodTypeServiceProxy,
        ApiServiceProxies.FormDesignerServiceProxy,
        //ApiServiceProxies.IndicatorTypeServiceProxy,
        //ApiServiceProxies.FormRowServiceProxy,
        //ApiServiceProxies.DimentionTypeServiceProxy,
        ApiServiceProxies.ActivityFormDataServiceProxy,
        ApiServiceProxies.PivotControlServiceProxy,
        ApiServiceProxies.PivotQueryServiceProxy,
        ApiServiceProxies.FormDesignerReferenceServiceProxy,
        ApiServiceProxies.FormPreviewServiceProxy,
        ApiServiceProxies.CalenderServiceProxy,
        ApiServiceProxies.CopyFormServiceProxy,
        ApiServiceProxies.FormListServiceProxy,
        ApiServiceProxies.StructureServiceProxy,
        { provide: HTTP_INTERCEPTORS, useClass: AbpHttpInterceptor, multi: true }
    ]
})
export class ServiceProxyModule {}
