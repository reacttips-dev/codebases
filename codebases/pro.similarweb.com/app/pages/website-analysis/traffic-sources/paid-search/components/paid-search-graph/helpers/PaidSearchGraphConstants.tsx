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
    AdSpend,
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
    daily: { title: "D", disabled: false, name: "Daily", index: 0 },
    weekly: { title: "W", disabled: false, name: "Weekly", index: 1 },
    monthly: { title: "M", disabled: false, name: "Monthly", index: 2 },
};

export interface IPaidSearchMetricsConfig {
    name: string;
    title: string;
    iconName: string;
    format: string;
    tooltip: string;
    identifier: EGraphTabs;
    channel: string;
    beta?: boolean;
}

export const paidSearchMetricsConfig = [
    {
        name: "Ad Spend",
        title: "analysis.search.adspend.metrics.title",
        iconName: "revenue",
        format: "abbrNumberWithPrefix:$",
        tooltip: "analysis.search.adspend.metrics.tooltip",
        identifier: EGraphTabs.AdSpend,
        channel: "Usd Spend",
        beta: true,
    },
    {
        name: "TrafficShare",
        title: "search.channelanalysis.traffic-share.paid.title",
        iconName: "chart-pie",
        format: "minAbbrNumber",
        tooltip: "wa.ao.graph.trafficshare.tooltip",
        identifier: EGraphTabs.TrafficShare,
        channel: "Paid Search",
    },
    {
        name: "AverageDuration",
        title: "wa.ao.graph.avgduration",
        iconName: "avg-visit-duration",
        format: "time",
        tooltip: "wa.ao.graph.avgduration.tooltip",
        identifier: EGraphTabs.AverageDuration,
        channel: "Paid Search",
    },
    {
        name: "PagesPerVisit",
        title: "wa.ao.graph.pages",
        iconName: "pages-per-visit",
        format: "decimalNumber",
        tooltip: "wa.ao.graph.pages.tooltip",
        identifier: EGraphTabs.PagesPerVisit,
        channel: "Paid Search",
    },
    {
        name: "BounceRate",
        title: "wa.ao.graph.bounce",
        iconName: "bounce-rate-2",
        format: "percentageSign:2",
        tooltip: "wa.ao.graph.bounce.tooltip",
        identifier: EGraphTabs.BounceRate,
        channel: "Paid Search",
    },
].map((item, index) => {
    item["metric"] = item.name;
    item["id"] = index;
    item["value"] = 0;
    item["key"] = "tab-" + index;
    return item;
});

export const legendsAndChannelsObjects = {
    "Paid Search": {
        color: colorsPalettes.blue["400"],
        text: "analysis.source.search.overview.filters.paid",
    },
    "Usd Spend": {
        color: colorsPalettes.blue["400"],
        text: "analysis.source.search.overview.filters.paid",
    },
};

export enum EMetrics {
    OTHER = "other",
    ADSPEND = "Ad Spend",
}

export enum EErrorTypes {
    NODATA,
    TIMEFRAME,
    ERROR,
    USSTATEֹ,
}
