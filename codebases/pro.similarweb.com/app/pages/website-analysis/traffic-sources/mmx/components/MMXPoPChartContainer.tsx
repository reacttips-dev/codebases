import { Injector } from "common/ioc/Injector";
import * as _ from "lodash";
import { GrowthPoPCompareChart } from "pages/website-analysis/traffic-sources/mmx/components/GrowthPoPCompareChart/GrowthPoPCompareChart";
import * as React from "react";
import { FunctionComponent } from "react";
import { PeriodOverPeriodChart } from "../../../../../../.pro-features/components/Chart/src/components/PeriodOverPeriodChart/PeriodOverPeriodChart";
import { trafficSources as trafficSourcesDefinitons } from "../../../../../../scripts/Shared/utils";
import { WidgetState } from "../../../../../components/widget/widget-types/Widget";
import { i18nFilter, webSourceTextSlimFilter } from "../../../../../filters/ngFilters";

export const MMXPoPChartContainer: FunctionComponent<any> = ({ widget }) => {
    // show graph only when widget finished fetching data successfully
    const durationObj = widget.durationObject;
    const data = widget.originalData;
    const widgetState = widget.widgetState;
    if (!data || widgetState !== WidgetState.LOADED || !data.Data || !data.ComparedData) {
        return null;
    }

    const chosenSitesService = Injector.get("chosenSites") as any;
    const chosenSites = chosenSitesService.get();
    const getSiteColor = chosenSitesService.getSiteColor;
    const durations = [durationObj.forWidget[1], durationObj.forWidget[0]];
    return (
        <>
            {chosenSites.length === 1 ? (
                <PeriodOverPeriodChart
                    type="column"
                    data={parseSingleModeData(data) ?? null}
                    legendDurations={durations}
                    options={{ categoryXSeries: true, height: 230 }}
                />
            ) : (
                <GrowthPoPCompareChart
                    chartRawData={data}
                    chosenSites={chosenSites}
                    getSiteColor={getSiteColor}
                    durations={durations}
                />
            )}
        </>
    );
};
MMXPoPChartContainer.displayName = "MMXPoPChartContainer";

const parseSingleModeData = (data) => {
    const sourceFilter = webSourceTextSlimFilter()("Total");
    const regularData = _.get(data, ["Data", Object.keys(data.Data)[0]], null);
    const comparedData = _.get(data, ["ComparedData", Object.keys(data.ComparedData)[0]], null);

    if (!regularData || !comparedData) {
        return null;
    }

    // sorting and applying translations for bars
    const channels = _.union(Object.keys(regularData), Object.keys(comparedData))
        .filter((channel) => trafficSourcesDefinitons.hasOwnProperty(channel))
        .sort((ch1, ch2) => {
            return trafficSourcesDefinitons[ch1].priority - trafficSourcesDefinitons[ch2].priority;
        })
        .map((channel) => ({ key: channel, name: translateSourceText(channel) }));

    const allData = channels.reduce((acc, { key, name }) => {
        const regular = regularData[key] ?? 0;
        const compared = comparedData[key] ?? 0;

        acc.push({
            Values: [
                { Key: name, Value: regular },
                { Key: name, Value: compared },
            ],
            Change: compared === 0 ? [NaN] : [regular / compared - 1],
        });

        return acc;
    }, []);

    return {
        [sourceFilter]: allData,
    };
};

const translateSourceText = (source) => {
    return i18nFilter()(trafficSourcesDefinitons[source].title);
};
