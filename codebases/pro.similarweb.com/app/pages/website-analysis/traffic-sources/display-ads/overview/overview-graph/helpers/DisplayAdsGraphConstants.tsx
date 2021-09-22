import "components/Chart/styles/sharedTooltip.scss";
import { colorsPalettes } from "@similarweb/styles";
import { IDataType } from "components/React/GraphTypeSwitcher/GraphTypeSwitcher";

export interface ITimeGranularity {
    title: string;
    disabled: boolean;
    name: string;
    index: number;
}

export enum EGraphTabs {
    TrafficShare,
    AverageDuration,
    PagesPerVisit,
    BounceRate,
}

export const numbers = "numbers";
export const percents = "percents";
export const allChannels = "All Channels";

export const availableDataTypes: IDataType[] = [
    { title: "#", value: numbers, disabled: false },
    { title: "%", value: percents, disabled: false },
];

export const timeGranularityObjects = {
    daily: { title: "D", disabled: true, name: "Daily", index: 0 },
    weekly: { title: "W", disabled: true, name: "Weekly", index: 1 },
    monthly: { title: "M", disabled: false, name: "Monthly", index: 2 },
};

export interface IDisplayAdsGraphConfig {
    name: string;
    title: string;
    iconName: string;
    format: string;
    tooltip: string;
    identifier: EGraphTabs;
    channel: string;
    beta?: boolean;
}

export const displayAdsGraphConfig = [
    {
        name: "TrafficShare",
        title: "wa.ao.graph.trafficshare",
        iconName: "chart-pie",
        format: "minAbbrNumber",
        tooltip: "display.ads.overview.graph.trafficshare.tooltip",
        identifier: EGraphTabs.TrafficShare,
        channel: "Display Ads",
    },
    {
        name: "AverageDuration",
        title: "wa.ao.graph.avgduration",
        iconName: "avg-visit-duration",
        format: "time",
        tooltip: "wa.ao.graph.avgduration.tooltip",
        identifier: EGraphTabs.AverageDuration,
        channel: "Display Ads",
    },
    {
        name: "PagesPerVisit",
        title: "wa.ao.graph.pages",
        iconName: "pages-per-visit",
        format: "decimalNumber",
        tooltip: "wa.ao.graph.pages.tooltip",
        identifier: EGraphTabs.PagesPerVisit,
        channel: "Display Ads",
    },
    {
        name: "BounceRate",
        title: "wa.ao.graph.bounce",
        iconName: "bounce-rate-2",
        format: "percentageSign:2",
        tooltip: "wa.ao.graph.bounce.tooltip",
        identifier: EGraphTabs.BounceRate,
        channel: "Display Ads",
    },
].map((item, index) => {
    item["metric"] = item.name;
    item["id"] = index;
    item["value"] = 0;
    item["key"] = "tab-" + index;
    return item;
});

export const legendsAndChannelsObjects = {
    "Display Ads": {
        color: colorsPalettes.blue["400"],
        text: "Display Ads",
    },
};

export enum EMetrics {
    DISPLAY_ADS = "other",
}

export enum EErrorTypes {
    NODATA,
    TIMEFRAME,
    ERROR,
    US_STATE,
}
