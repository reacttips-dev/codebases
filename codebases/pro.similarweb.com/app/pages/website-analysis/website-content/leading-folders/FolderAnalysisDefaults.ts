import {
    abbrNumberVisitsFilter,
    i18nFilter,
    minVisitsAbbrFilter,
    percentageSignFilter,
    swNumberFilter,
    timeFilter,
} from "filters/ngFilters";
import biDailyIntervalConfig from "../../../../../.pro-features/components/Chart/src/configs/granularity/biDailyIntervalConfig";
import monthlyIntervalConfig from "../../../../../.pro-features/components/Chart/src/configs/granularity/monthlyIntervalConfig";
import weeklyIntervalConfig from "../../../../../.pro-features/components/Chart/src/configs/granularity/weeklyIntervalConfig";

export const CHART_NAME = "Folder Analysis";

export const granularityConfigs = {
    Daily: biDailyIntervalConfig,
    Weekly: weeklyIntervalConfig,
    Monthly: monthlyIntervalConfig,
};

export const tabsMeta = {
    Visits: {
        icon: "visits",
        title: "folderanalysis.tabs.visits",
        filter: [minVisitsAbbrFilter],
        yAxisFilter: [abbrNumberVisitsFilter],
        chartTitle: "folderanalysis.tabs.chart.title.visits",
        id: "Visits",
    },
    UniqueUsers: {
        icon: "monthly-unique-visitors",
        title: "folderanalysis.tabs.unique",
        filter: [minVisitsAbbrFilter],
        chartTitle: "folderanalysis.chart.title.unique",
        id: "UniqueUsers",
    },
    PagesViews: {
        icon: "impressions",
        title: "folderanalysis.tabs.pageviews",
        filter: [minVisitsAbbrFilter],
        yAxisFilter: [abbrNumberVisitsFilter],
        chartTitle: "folderanalysis.tabs.chart.title.pageviews",
        id: "PagesViews",
    },
    PagePerVisit: {
        icon: "pages-per-visit",
        title: "folderanalysis.tabs.pagespervisit",
        filter: [swNumberFilter, 2], // elem 0 = filter, elem[1] = filter params
        chartTitle: "folderanalysis.tabs.chart.title.pagespervisit",
        id: "PagePerVisit",
    },
    Duration: {
        icon: "avg-visit-duration",
        title: "folderanalysis.tabs.duration",
        filter: [timeFilter],
        chartTitle: "folderanalysis.tabs.chart.title.duration",
        id: "Duration",
    },
    BounceRate: {
        icon: "bounce-rate-2",
        title: "folderanalysis.tabs.bounce",
        filter: [percentageSignFilter],
        invertChange: true,
        chartTitle: "folderanalysis.tabs.chart.title.bounce",
        id: "BounceRate",
    },
    TrafficShare: {
        icon: "chart-pie",
        title: "segments.group.analysis.tab.trafficshare.title",
        filter: [percentageSignFilter, 2],
        chartTitle: "segments.group.analysis.tab.trafficshare.chart.title",
        id: "TrafficShare",
    },
};
