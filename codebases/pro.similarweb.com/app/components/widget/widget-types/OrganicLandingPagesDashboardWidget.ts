import { tableColumns } from "pages/website-analysis/traffic-sources/organic-landing-pages/OrganicLandingPagesColumnsConfig";
import { DashboardTableWidget } from "components/widget/widget-types/DashboardTableWidget";

export class OrganicLandingPagesDashboardWidget extends DashboardTableWidget {
    constructor() {
        super();
    }
    public isPptSupported = () => {
        return false;
    };

    static getWidgetMetadataType() {
        return "OrganicLandingPagesDashboard";
    }

    callbackOnGetData(response: any) {
        const dataAfterTransform = response.Data.map((record) => ({
            ...record,
            url: this.generateUrl(record.TopSearchTerm),
        }));
        super.callbackOnGetData({ ...response, Data: dataAfterTransform });
    }
    generateUrl(keyword: string, state = "keywordAnalysis_overview") {
        const queryParams = { ...this._params, keyword };
        return this._swNavigator.href(state, queryParams);
    }
    public getProUrl(rowParams) {
        const queryParams = { ...this._params };
        return this._swNavigator.href(
            "competitiveanalysis_website_organiclandingpages",
            queryParams,
        );
    }

    getColumnsConfig() {
        return tableColumns
            .getColumns(this._params, false)
            .filter(({ hideInDashboard }) => !hideInDashboard)
            .map((column) => ({
                ...column,
                title: column.displayName,
                cellCls: column.cellClass
                    ? `${column.cellClass} ${column.cellClass}-dashboard`
                    : "organic-landing-page-call",
            }));
    }
}

OrganicLandingPagesDashboardWidget.register();
