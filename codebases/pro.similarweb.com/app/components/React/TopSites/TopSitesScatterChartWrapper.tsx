import React from "react";
import { TopSitesScatterChart } from "components/React/TopSites/TopSitesScatterChart";
import {
    changeFilter,
    i18nFilter,
    minVisitsAbbrFilter,
    percentageSignFilter,
    swNumberFilter,
    timeFilter,
} from "filters/ngFilters";
import SWReactRootComponent from "decorators/SWReactRootComponent";

const percentageSign = percentageSignFilter();
const minVisitsAbbr = minVisitsAbbrFilter();
const time = timeFilter();
const change = changeFilter();
const swNumber = swNumberFilter();
const columnsMD = [
    {
        name: "Monthly Visits",
        id: "AvgMonthVisits",
        formatter: (val) => minVisitsAbbr(val),
    },

    {
        name: "Visits Duration",
        id: "AvgVisitDuration",
        formatter: (val) => time(val, null),
    },
    {
        name: "Unique Visitors",
        id: "UniqueUsers",
        formatter: (val) => minVisitsAbbr(val),
    },
    {
        name: "Bounce Rate",
        id: "BounceRate",
        formatter: (val) => percentageSign(val, 2),
    },
    {
        name: "Traffic Share",
        id: "Share",
        disableBenchMark: true,
        formatter: (val) => percentageSign(val, 2),
    },
    {
        name: "Change",
        id: "Change",
        formatter: (val) => (val > 0 ? change(Math.abs(val)) : "-" + change(Math.abs(val))),
    },
    {
        name: "Pages/Visits",
        id: "PagesPerVisit",
        formatter: (val) => swNumber(val, 2),
    },
];

export const TopSitesScatterChartWrapper = ({ tableData = [] }) => {
    const i18n = i18nFilter();
    return (
        <TopSitesScatterChart
            columnsMD={columnsMD}
            columns={columnsMD}
            graphHeadline={i18n("industryanalysis.topwebsites.scatter.plot.title")}
            scatterPlotInfo={i18n("industryanalysis.topwebsites.scatter.plot.info")}
            benchmarkInfoTooltipText={i18n(
                "industry.analysis.top.websites.scatter.plot.benchmark.info",
            )}
            disabledBenchmarkInfoText={i18n(
                "industry.analysis.top.websites.scatter.plot.benchmark.info.disabled",
            )}
            tableData={tableData}
        />
    );
};

SWReactRootComponent(TopSitesScatterChartWrapper, "TopSitesScatterChartWrapper");
