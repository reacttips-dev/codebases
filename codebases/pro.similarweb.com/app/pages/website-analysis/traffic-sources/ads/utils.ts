import { createBaseClassFrom } from "components/widget/widgetUtils";
import * as _ from "lodash";

export const getEngagementBaseClass = (EngagementBaseClass, getWidgetConfig, getMetricConfig?) => {
    const BaseClass = createBaseClassFrom(EngagementBaseClass, getWidgetConfig, getMetricConfig);
    return class EngagementMetricsBase extends BaseClass {
        private _params;
        public get excelUrl() {
            let newParams: any = _.merge({}, this._params);
            return (
                "/widgetApi/WebsiteDisplayAds/WebsiteAdsOverTimeOverview/Excel?" +
                _.trimEnd(
                    _.reduce(
                        _.omit(newParams, ["metric"]),
                        (paramString, paramVal: any, paramKey) =>
                            `${paramString}${paramKey}=${encodeURIComponent(paramVal)}&`,
                        "",
                    ),
                    "&",
                )
            );
        }
        onTabChanged(from, to) {}
    };
};
