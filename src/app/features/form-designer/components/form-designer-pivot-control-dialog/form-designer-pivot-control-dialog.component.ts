import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Injector,
  Output,
  ViewChild,
} from "@angular/core";
import { AppComponentBase } from "@shared/app-component-base";
import {
  CreateOrUpdatePivotQueryDto,
  CubeMemberSchema,
  CubeSchema,
  Dimension,
  GetPivotTableInput,
  MdxQueryWithParamsDto,
  Measure,
  PivotConfiguration,
  PivotControlServiceProxy,
  PivotTableBuilder,
  PivotTableReportConfig,
} from "@shared/service-proxies/service-proxies";
import { NotifyService } from "abp-ng2-module";
import * as _ from "lodash";
import { BsModalRef } from "ngx-bootstrap/modal";

@Component({
  selector: "app-form-designer-pivot-control-dialog",
  templateUrl: "./form-designer-pivot-control-dialog.component.html",
  styleUrls: ["./form-designer-pivot-control-dialog.component.css"],
})
export class FormDesignerPivotControlDialogComponent
  extends AppComponentBase
  implements AfterViewInit {
  formId: number;
  formStructureRowId: number;
  currentQueryId: number;
  mdxQuery: string = "";
  currentMdxQuery: string = "";
  currentQueryFilter: string = "";
  columns: string[] = [];
  private _$pivotTable: JQuery;
  listPivotData: CubeSchema[] = [];
  allMeasures: CubeMemberSchema[] = [];
  pivotData = new PivotTableBuilder();
  dimensionsHierarchy: { [key: string]: string[] };

  @ViewChild("pivotTableBuilder", { static: false }) pivotTable: ElementRef;
  @Output() savePivotConfig = new EventEmitter<any>();

  constructor(
    injector: Injector,
    private _pivotControlServiceProxy: PivotControlServiceProxy,
    public bsModalRef: BsModalRef,
    public notify: NotifyService
  ) {
    super(injector);
  }

  ngAfterViewInit(): void {
    const self = this;
    this._$pivotTable = $(this.pivotTable.nativeElement);
    this.getPivotList((pivotList) => {
      this.listPivotData = pivotList;
      this._$pivotTable.pivotdataWebPivotBuilder({
        onLoadCubes: function (callback) {
          callback(pivotList);
        },
        onLoadPivotHtml: function (cubeId, pvtConfiguration, callback) {
          pvtConfiguration.CubeName = cubeId;
          self.getPivotData(pvtConfiguration, (pivotBuilder) => {
            callback(pivotBuilder);
          });
        },
        renderOnCubeChange: true,
        drillDown: true,
      });
    });
  }

  private getPivotList(callback: (ous: CubeSchema[]) => void): void {
    let input = new GetPivotTableInput();
    input.formId = this.formId;
    input.formStructureRowId = this.formStructureRowId;
    this._pivotControlServiceProxy
      .pivotDataBuilder(input)
      .subscribe((result: CubeSchema[]) => {
        const pivotList = result;
        this.allMeasures = result[0].measures;
        this.currentMdxQuery = result[0].mdxQuery;
        this.currentQueryFilter = result[0].mdxQueryFilter;
        this.currentQueryId = result[0].currentQueryId;
        callback(pivotList);
      });
  }

  private getPivotData(
    pvtConfiguration,
    callback: (ous: PivotTableBuilder) => void
  ): void {
    this._pivotControlServiceProxy
      .pivotTableHtml(pvtConfiguration)
      .subscribe((result: PivotTableBuilder) => {
        const pivotBuilder = result;
        this.mdxQuery = result.mdxQuery;
        this.dimensionsHierarchy = result.dimensionsHierarchy;
        this.columns = result.configuration.columns;
        callback(pivotBuilder);
      });
  }

  applyPivotChange() {
    this._$pivotTable.pivotdataWebPivotBuilder("render");
  }

  save() {
    let configuration = this._$pivotTable.pivotdataWebPivotBuilder(
      "getPivotTableConfig"
    );
    if (
      this.currentMdxQuery != this.mdxQuery ||
      this.columns != configuration.Measures ||
      this.currentQueryFilter != configuration.Filter
    ) {
      if (configuration.Measures != null && configuration.Measures.length > 0) {
        let pivotConfig = new PivotTableReportConfig();
        let createOrUpdatePivotQuery = new CreateOrUpdatePivotQueryDto();
        pivotConfig = this.getPivotConfiguration(configuration);
        createOrUpdatePivotQuery = this.prepareCreateOrUpdatePivotQuery(
          configuration,
          pivotConfig
        );
        this._pivotControlServiceProxy
          .savePivotQuery(createOrUpdatePivotQuery)
          .subscribe((res) => {
            if (res) {
              console.log("SAVE PIVOT RESPONSE", res);
              this.notify.info(this.l("SavedSuccessfully"));
              this.bsModalRef.hide();
              this.savePivotConfig.emit(createOrUpdatePivotQuery);
              console.log("Emitter!!", createOrUpdatePivotQuery);
            } else {
              this.notify.error(this.l("ErrorOccured"));
            }
          });
      }
    } else {
      this.notify.info(this.l("NoDataChanges"));
      this.bsModalRef.hide();
    }
  }

  getPivotConfiguration(configuration: any) {
    let pivotConfig = new PivotTableReportConfig();
    pivotConfig.measures = [];
    pivotConfig.rows = [];
    pivotConfig.columns = [];
    let measuresIndexes = _.map(configuration.Measures, (x) => x.Name);
    let selectedMeasures = _.filter(this.allMeasures, (x) =>
      _.includes(measuresIndexes, x.name)
    );
    pivotConfig.measures = selectedMeasures.map(function (obj) {
      let measure = new Measure();
      measure.name = obj.mainText;
      return measure;
    });
    pivotConfig.rows = configuration.Rows.map(function (obj) {
      let row = new Dimension();
      row.name = obj.Name;
      return row;
    });
    pivotConfig.columns = configuration.Columns.map(function (obj) {
      let col = new Dimension();
      col.name = obj.Name;
      return col;
    });
    return pivotConfig;
  }

  prepareCreateOrUpdatePivotQuery(
    configuration: any,
    pivotConfig: PivotTableReportConfig
  ) {
    let createOrUpdatePivotQuery = new CreateOrUpdatePivotQueryDto();
    createOrUpdatePivotQuery.mdxQueryWithParams = new MdxQueryWithParamsDto();
    createOrUpdatePivotQuery.pivotConfig = new PivotConfiguration();
    createOrUpdatePivotQuery.formId = this.formId;
    createOrUpdatePivotQuery.formStructureRowId = this.formStructureRowId;
    createOrUpdatePivotQuery.mdxQueryWithParams.mdxQuery = this.mdxQuery;
    createOrUpdatePivotQuery.currentQueryId = this.currentQueryId;
    createOrUpdatePivotQuery.mdxQueryWithParams.mdxQueryFilter =
      configuration.Filter;
    createOrUpdatePivotQuery.pivotConfig.measures = pivotConfig.measures;
    createOrUpdatePivotQuery.pivotConfig.rows = pivotConfig.rows;
    createOrUpdatePivotQuery.pivotConfig.columns = pivotConfig.columns;
    createOrUpdatePivotQuery.dimensionsHierarchy = this.dimensionsHierarchy;
    return createOrUpdatePivotQuery;
  }
}
