import { DefaultFetchService } from "services/fetchService";
import * as queryString from "query-string";

export default class AppEngagementServiceApi {
    private static _instance: AppEngagementServiceApi;
    protected fetchService: DefaultFetchService;

    constructor() {
        this.fetchService = DefaultFetchService.getInstance();
    }

    public static getInstance(): AppEngagementServiceApi {
        if (!AppEngagementServiceApi._instance) {
            AppEngagementServiceApi._instance = new AppEngagementServiceApi();
        }
        return AppEngagementServiceApi._instance;
    }

    public fetchAppEngagementDataAndroid(params) {
        return this.fetchService.get(
            "/widgetApi/AppEngagementOverviewAndroid/AppEngagementOverview/Data",
            params,
        );
    }

    public fetchAppEngagementDataIos(params) {
        return this.fetchService.get(
            "/widgetApi/AppEngagementOverviewIos/AppEngagementOverview/Data",
            params,
        );
    }

    public getEngagementGraphExcelUrl(appStore, params): string {
        const queryStringParams = queryString.stringify(params);

        let store;
        if (appStore === "Google") {
            store = "AppEngagementOverviewAndroid";
        } else if (appStore === "Apple") {
            store = "AppEngagementOverviewIos";
        }
        return `/widgetApi/${store}/AppEngagementOverviewRealNumbers/Excel?${queryStringParams}`;
    }

    public fetchAppEngagementTableData(params) {
        return this.fetchService.get(
            "/widgetApi/AppEngagementOverviewAndroid/AppEngagementOverviewRealNumbers/Table",
            params,
        );
    }
}
