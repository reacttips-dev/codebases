import { colorsPalettes } from "@similarweb/styles";
import { swSettings } from "common/services/swSettings";
import combineConfigs from "components/Chart/src/combineConfigs";
import dailyIntervalConfig from "components/Chart/src/configs/granularity/dailyIntervalConfig";
import monthlyIntervalConfig from "components/Chart/src/configs/granularity/monthlyIntervalConfig";
import weeklyIntervalConfig from "components/Chart/src/configs/granularity/weeklyIntervalConfig";
import noLegendConfig from "components/Chart/src/configs/legend/noLegendConfig";
import xAxisCrosshair from "components/Chart/src/configs/xAxis/xAxisCrosshair";
import xAxisLabelsConfig from "components/Chart/src/configs/xAxis/xAxisLabelsConfig";
import yAxisLabelsConfig from "components/Chart/src/configs/yAxis/yAxisLabelsConfig";
import "components/Chart/styles/sharedTooltip.scss";
import { abbrNumberFilter } from "filters/ngFilters";
import dayjs from "dayjs";
import { changeTooltipFormatter } from "pages/website-analysis/traffic-sources/search/tabs/SearchOverviewGraph/Components/ChangeTooltip";
import ChangeBellWithoutTooltip from "components/Chart/src/configs/plotLines/ChangeBellWithoutTooltip";
import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";
import { IDataType } from "components/React/GraphTypeSwitcher/GraphTypeSwitcher";

export enum EGraphTabs {
    TrafficShare,
    AverageDuration,
    PagesPerVisit,
    BounceRate,
}

export interface ICategory {
    id: string;
    title: string;
}

const getIntervalConfig = (timeGranularity) => {
    if (timeGranularity === timeGranularityList.monthly) {
        return monthlyIntervalConfig;
    }
    if (timeGranularity === timeGranularityList.weekly) {
        return weeklyIntervalConfig;
    }
    return dailyIntervalConfig;
};

export const getBaseChartConfig = (
    filter,
    metricName,
    yFormatter,
    isPercents = false,
    contextProps,
    getChangeColor = null,
) => {
    const {
        isWindow,
        duration,
        granularity,
        durationObj,
        isMonthsToDateActive,
        webSource,
        rawData,
    } = contextProps;
    const timeGranularity = Object.values(timeGranularityList).find(
        ({ name }) => name === String(granularity),
    );
    const format = timeGranularity === timeGranularityList.monthly ? "MMM YY" : "DD MMM";
    const { to, from } = durationObj.forAPI;
    const lastSupportedDate = isMonthsToDateActive
        ? swSettings.current.lastSupportedDailyDate
        : to.replace(/\|/g, "/");
    const currentGranularity = getIntervalConfig(timeGranularity);
    const yAxisFormatter = ({ value }) => abbrNumberFilter()(value);
    const xAxisFormatter = ({ value }) => dayjs.utc(value).format(format);
    const newMMXAlgoStartDate = dayjs(swSettings.current.resources.NewAlgoMMX);
    return combineConfigs({ yAxisFormatter, xAxisFormatter }, [
        currentGranularity,
        noLegendConfig,
        yAxisLabelsConfig,
        xAxisLabelsConfig,
        xAxisCrosshair,
        webSource !== devicesTypes.DESKTOP &&
            rawData &&
            from !== newMMXAlgoStartDate.format("YYYY|MM|DD") &&
            ChangeBellWithoutTooltip(newMMXAlgoStartDate),
        {
            chart: {
                height: 295,
                spacingTop: 10,
                plotBackgroundColor: "transparent",
                events: {},
                style: {
                    fontFamily: "Roboto",
                },
            },
            tooltip: {
                followPointer: false,
                shared: true,
                useHTML: true,
                backgroundColor: undefined,
                borderWidth: 0,
                style: {
                    fontFamily: "Roboto",
                    margin: 0,
                },
                formatter: changeTooltipFormatter(
                    metricName,
                    yFormatter,
                    isWindow,
                    duration,
                    isPercents,
                    granularity,
                    lastSupportedDate,
                    getChangeColor,
                ),
            },
            plotOptions: {
                line: {
                    marker: {
                        enabled: timeGranularity !== timeGranularityList.daily,
                        symbol: "circle",
                    },
                    lineWidth: 2,
                    connectNulls: true,
                },
                area: {
                    marker: {
                        enabled: false,
                        symbol: "circle",
                    },
                    stacking: "normal",
                },
                series: {
                    fillOpacity: 1,
                    animation: false,
                },
            },
            yAxis: {
                min: 0,
                gridLineWidth: 0.5,
                showFirstLabel: true,
                showLastLabel: true,
                reversed: false,
                gridZIndex: 2,
                reversedStacks: true,
                tickPixelInterval: 50,
                plotLines: [
                    {
                        color: "#656565",
                        width: 2,
                        value: 0,
                    },
                ],
                labels: {
                    style: {
                        textTransform: "uppercase",
                        fontSize: "11px",
                        fontFamily: "Roboto",
                        color: "#919191",
                    },
                    formatter: yFormatter,
                },
            },
            xAxis: {
                gridLineWidth: 0,
                gridLineDashStyle: "dash",
                tickLength: 5,
                labels: {
                    style: {
                        textTransform: "capitalize",
                        fontSize: "11px",
                        color: "#919191",
                        fontFamily: "Roboto",
                    },
                },
                minPadding: 0,
                maxPadding: 0,
            },
        },
    ]);
};

export const searchTrafficGraphTabsConfig = [
    {
        name: "TrafficShare",
        title: "search.channelanalysis.traffic-share.title",
        iconName: "chart-pie",
        format: "minVisitsAbbr",
        tooltip: "wa.ao.graph.trafficshare.tooltip",
        identifier: EGraphTabs.TrafficShare,
    },
    {
        name: "AverageDuration",
        title: "search.channelanalysis.duration.title",
        iconName: "avg-visit-duration",
        format: "time",
        tooltip: "wa.ao.graph.avgduration.tooltip",
        identifier: EGraphTabs.AverageDuration,
    },
    {
        name: "PagesPerVisit",
        title: "search.channelanalysis.page-visits.title",
        iconName: "pages-per-visit",
        format: "decimalNumber",
        tooltip: "wa.ao.graph.pages.tooltip",
        identifier: EGraphTabs.PagesPerVisit,
    },
    {
        name: "BounceRate",
        title: "search.channelanalysis.bounce-rate.title",
        iconName: "bounce-rate-2",
        format: "percentagesign:2",
        tooltip: "wa.ao.graph.bounce.tooltip",
        identifier: EGraphTabs.BounceRate,
    },
].map((item, index) => {
    item["metric"] = item.name;
    item["id"] = index;
    item["value"] = 0;
    item["key"] = "tab-" + index;
    return item;
});

export const timeGranularityList = {
    daily: { title: "D", disabled: false, name: "Daily", index: 0 },
    weekly: { title: "W", disabled: false, name: "Weekly", index: 1 },
    monthly: { title: "M", disabled: false, name: "Monthly", index: 2 },
};
export const organicPaid = "organicPaid";
export const brandedNonBranded = "brandedNonBranded";
export const searchType = "searchType";
export const mobileSearchTraffic = "mobileSearchTraffic";
export const organicPaidCategory = {
    id: organicPaid,
    title: "analysis.source.search.overview.filters.organicpaid",
};
export const brandedNonBrandedCategory = {
    id: brandedNonBranded,
    title: "analysis.source.search.overview.filters.brandednonbranded",
};
export const searchTypeCategory = {
    id: searchType,
    title: "analysis.source.search.overview.filters.searchType",
};

export const mobileSearchTrafficCategory = {
    id: mobileSearchTraffic,
    title: "analysis.source.search.overview.filters.mobileweb",
};

export const availableCategories = [
    mobileSearchTrafficCategory,
    organicPaidCategory,
    brandedNonBrandedCategory,
    searchTypeCategory,
];
export enum legendTypes {
    OrganicSearch = "Organic Search",
    PaidSearch = "Paid Search",
    AllChannels = "All Channels",
    Branded = "Branded",
    NonBranded = "Non Branded",
    RegularSearch = "Regular Search",
    NewsSearch = "News Search",
    ImageSearch = "Image Search",
    VideoSearch = "Video Search",
    ShoppingSearch = "Shopping Search",
    MapsSearch = "Maps Search",
    SearchTraffic = "Search Traffic",
}

export const singleModeLegends = {
    organicPaid: [legendTypes.OrganicSearch, legendTypes.PaidSearch, legendTypes.AllChannels],
    brandedNonBranded: [legendTypes.Branded, legendTypes.NonBranded, legendTypes.AllChannels],
    searchType: [
        legendTypes.RegularSearch,
        legendTypes.NewsSearch,
        legendTypes.ImageSearch,
        legendTypes.VideoSearch,
        legendTypes.ShoppingSearch,
        legendTypes.MapsSearch,
        legendTypes.AllChannels,
    ],
    mobileSearchTraffic: [legendTypes.SearchTraffic],
};

export const legendsAndChannelsObjects = {
    [legendTypes.AllChannels]: {
        color: colorsPalettes.bluegrey["600"],
        text: "analysis.source.search.overview.filters.all.channels",
    },
    "All Duration": {
        color: colorsPalettes.bluegrey["600"],
        text: "analysis.source.search.overview.filters.all.duration",
    },
    "All page visits": {
        color: colorsPalettes.bluegrey["600"],
        text: "analysis.source.search.overview.filters.all.page.visits",
    },
    "Organic Search": {
        color: colorsPalettes.bluegrey["600"],
        text: "analysis.source.search.overview.filters.organic",
    },
    "Search Traffic": {
        color: colorsPalettes.bluegrey["600"],
        text: "analysis.source.search.overview.filters.mobileweb_legend",
    },
    "Paid Search": {
        color: colorsPalettes.torquoise["300"],
        text: "analysis.source.search.overview.filters.paid",
    },
    Branded: {
        color: colorsPalettes.bluegrey["600"],
        text: "analysis.source.search.overview.filters.branded",
    },
    "Non Branded": {
        color: colorsPalettes.torquoise["300"],
        text: "analysis.source.search.overview.filters.non-branded",
    },
    "Regular Search": {
        color: colorsPalettes.bluegrey["600"],
        text: "analysis.source.search.overview.filters.regular-search",
    },
    "Image Search": {
        color: colorsPalettes.orange["300"],
        text: "analysis.source.search.overview.filters.image-search",
    },
    "Maps Search": {
        color: colorsPalettes.teal["400"],
        text: "analysis.source.search.overview.filters.maps-search",
    },
    "News Search": {
        color: colorsPalettes.torquoise["300"],
        text: "analysis.source.search.overview.filters.news-search",
    },
    "Shopping Search": {
        color: colorsPalettes.yellow["400"],
        text: "analysis.source.search.overview.filters.shopping-search",
    },
    "Video Search": {
        color: colorsPalettes.red["400"],
        text: "analysis.source.search.overview.filters.video-search",
    },
};

export const numbers = "numbers";
export const percents = "percents";
export const allChannels = "All Channels";

export const availableDataTypes: IDataType[] = [
    { title: "#", value: numbers },
    { title: "%", value: percents },
];

export interface IChannel {
    id: string;
    text: string;
    tooltip?: string;
}
export const organicPaidChannels: IChannel[] = [
    {
        id: allChannels,
        text: "analysis.source.search.overview.filters.organicpaid",
    },
    {
        id: "Organic Search",
        text: "analysis.source.search.overview.filters.organic",
    },
    {
        id: "Paid Search",
        text: "analysis.source.search.overview.filters.paid",
    },
];

export const brandedNonBrandedChannels: IChannel[] = [
    {
        id: allChannels,
        text: "analysis.source.search.overview.filters.brandednonbranded",
    },
    {
        id: "Branded",
        text: "analysis.source.search.overview.filters.branded",
    },
    {
        id: "Non Branded",
        text: "analysis.source.search.overview.filters.non-branded",
    },
];

export const SearchTypesChannels = [
    {
        id: allChannels,
        text: "analysis.source.search.overview.filters.all-channels",
    },
];
