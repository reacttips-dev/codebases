import { IndustryAnalysisTopKeywordsBase } from "pages/industry-analysis/top-keywords/widgets/IndustryAnalysisTopKeywordsBase";
import { addFilter, IndustryAnalysisTopKeywordsAll } from "./IndustryAnalysisTopKeywordsAll";
import { Injector } from "../../../../../scripts/common/ioc/Injector";
import { IRootScopeService } from "angular";
import * as _ from "lodash";
import NaiveColorStack from "../../../../components/colorsStack/NaiveColorStack";
import { ETopKeywordsTable } from "../widgets/IndustryAnalysisTopKeywordsAll";

export class IndustryAnalysisTopKeywordsPaid extends IndustryAnalysisTopKeywordsBase {
    static getWidgetMetadataType() {
        return "Table";
    }

    static getWidgetResourceType() {
        return "Table";
    }

    static getAllConfigs(params) {
        const config = _.cloneDeep(
            IndustryAnalysisTopKeywordsAll.getAllConfigs(params, ETopKeywordsTable.paid),
        );
        config.metricConfig.state = "keywordAnalysis-paid";
        const { apiParams } = config.widgetConfig.properties;
        const newApiParams = addFilter(apiParams)("OP;==;1");
        config.widgetConfig.properties.apiParams = newApiParams;
        return config;
    }

    public cleanup() {}
    public forceCleanup() {
        super.cleanup();
    }

    initWidgetWithConfigs(config, context) {
        super.initWidgetWithConfigs(config, context);
        this.tableColors = new NaiveColorStack("#4996e7");
    }

    canAddToDashboard() {
        return true;
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/table.html`;
    }

    getWidgetModel() {
        const model = super.getWidgetModel();
        model.type = "IndustryKeywordsDashboardTable";
        model.metric = "TopKeywordsPaid";
        return model;
    }

    onSort(column: any, setSortedColumn?: boolean) {
        const $rootScope = Injector.get<IRootScopeService>("$rootScope");
        $rootScope.$evalAsync(() => {
            this._swNavigator.updateParams({ orderBy: `${column.field} ${column.sortDirection}` });
        });
    }
}
