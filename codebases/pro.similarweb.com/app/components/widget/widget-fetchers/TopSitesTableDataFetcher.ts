/**
 * Created by yoav.shmaria on 12/11/2017.
 */
import { IPromise } from "angular";
import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import { DefaultDataFetcher } from "./DefaultDataFetcher";
import { IWidget } from "components/widget/widget-types/Widget";

export class TopSitesTableDataFetcher extends DefaultDataFetcher<any> {
    private mode: any;

    constructor(widgetResource, widgetConfig) {
        super(widgetResource, widgetConfig);
        this.mode = swSettings.allowedCountry(
            this.widget.apiParams.country,
            "IndustryAnalysisGeneral",
        )
            ? "extended"
            : "basic";
    }

    getParams(params = this.widget.apiParams) {
        const metric = this.mode === "extended" ? "TopSitesExtended" : "TopSites";
        this.widget.apiParams.metric = metric;
        const {
            _widgetConfig: { properties },
        } = this.widget as IWidget<TopSitesTableDataFetcher> & {
            _widgetConfig: { properties };
        };
        return {
            ...params,
            metric,
            ...(!!properties.funcFlag && {
                funcFlag: properties.funcFlag,
            }),
        };
    }

    fetch(params = this.widget.apiParams): IPromise<any> {
        return super.fetch(this.getParams(params));
    }

    protected getResource() {
        const metric = this.mode === "extended" ? "TopSitesExtended" : "TopSites";
        const controller = this.mode === "extended" ? "TopSitesExtended" : "TopSitesNew";
        return this.widgetResource.resourceByController(controller, metric)["Table"];
    }

    canAddToDashboard() {
        return true;
    }
}
