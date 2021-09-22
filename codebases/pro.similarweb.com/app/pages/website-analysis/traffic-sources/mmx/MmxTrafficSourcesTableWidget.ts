import * as _ from "lodash";
import { TableWidget } from "components/widget/widget-types/TableWidget";
/**
 * Created by Eran.Shain on 12/6/2016.
 */

export class MmxTrafficSourcesTableWidget extends TableWidget {
    getMetricColumnsConfig() {
        return super
            .getMetricColumnsConfig()
            .filter((col) => col.name !== "HasAdsense")
            .map((col) => {
                switch (col.name) {
                    case "Domain":
                        return _.merge({}, col, {
                            cellTemp: "mmx-traffic-source",
                        });
                    default:
                        return col;
                }
            });
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/table.html`;
    }

    protected _getExcelEndPoint() {
        return `/widgetApi/MarketingMix/TrafficSourcesOverviewData/Excel?`;
    }
}

MmxTrafficSourcesTableWidget.register();
