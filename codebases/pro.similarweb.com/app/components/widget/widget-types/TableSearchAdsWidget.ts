/**
 * Created by Eran.Shain on 5/24/2017.
 */
import { TableWidget } from "./TableWidget";
import { SearchPageAdsTableFetcher } from "components/widget/widget-fetchers/searchPageAdsTableFetcher";
import { Injector } from "common/ioc/Injector";
import autobind from "autobind-decorator";
import { allTrackers } from "../../../services/track/track";
/**
 * Created by Eran.Shain on 4/4/2017.
 */
export const availableAdTypes = [
    {
        value: "all",
        label: "All",
    },
    {
        value: "text",
        label: "Text",
    },
    {
        value: "shopping",
        label: "Shopping",
    },
];
export class TableSearchAdsWidget extends TableWidget {
    public availableAdTypes = availableAdTypes;
    @autobind
    public onAdTypeSelected(adtype) {
        this.page = 1;
        this.apiParams = {
            page: 1,
            atype: adtype,
        };
        allTrackers.trackEvent("ads type filter", "switch", adtype);
        return adtype;
    }

    transformResponse(response: any) {
        // transform the records to the structure we need
        const { Data, ...rest } = response;
        return {
            ...rest,
            Data: Data.map((record) => {
                const { Keywords, Position, NumberOfKeywords, ...AdDetails } = record;
                return {
                    AdDetails,
                    Keywords,
                    NumberOfKeywords,
                    Position: typeof Position === "number" ? Math.round(Position) : Position,
                    DestUrl: record.DestUrl,
                };
            }),
        };
    }

    callbackOnGetData(response: any) {
        const modifiedResponse = this.transformResponse(response); // factor out the transform business logic so it can be easily tested.
        return super.callbackOnGetData(modifiedResponse);
    }
    public getFetcherFactory() {
        return this;
    }
    create(widgetConfig) {
        const injector = Injector;
        const widgetResource = injector.get("widgetResource");
        return new SearchPageAdsTableFetcher(widgetResource, widgetConfig);
    }
    get templateUrl() {
        return `/app/pages/website-analysis/traffic-sources/search/ads-table.html`;
    }
}

TableSearchAdsWidget.register();
