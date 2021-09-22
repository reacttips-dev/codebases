export const tabs = [
    {
        name: "Visits",
        getTitle: (is28d) => (is28d ? "wa.ao.graph.avgvisitsdaily" : "wa.ao.graph.avgvisits"),
        iconName: "visits",
        format: "minVisitsAbbr",
        tooltip: "wa.ao.graph.avgvisits.tooltip",
    },
    {
        name: "UniqueUsers",
        getTitle: (is28d) => (is28d ? "Wa.Ao.Graph.Muv.Window" : "wa.ao.graph.muv"),
        iconName: "monthly-unique-visitors",
        format: "minVisitsAbbr",
        cache: false,
        tooltip: "wa.ao.graph.muv.tooltip",
        isAvailable: ({ isGa, duration }) => !isGa || duration !== "28d",
    },
    {
        name: "DeduplicatedAudience",
        title: "wa.ao.graph.dedup",
        iconName: "users-tab",
        format: "minVisitsAbbr",
        tooltip: "wa.ao.graph.dedup.tooltip",
        isLocked: false,
        labelText: "BETA",
        beta: true,
        isAvailable: ({ isOneWebSource, duration, showGAApprovedData }) =>
            !isOneWebSource && duration !== "28d" && !showGAApprovedData,
    },
    {
        name: "AvgVisitDuration",
        getTitle: (is28d) => (is28d ? "Wa.Ao.Graph.Avgduration" : "wa.ao.graph.avgduration"),
        iconName: "avg-visit-duration",
        format: "time",
        id: "AvgVisitDuration",
        apiController: "TrafficAndEngagement",
        tooltip: "wa.ao.graph.avgduration.tooltip",
        //Currently we want to hide this metric in case beta calculation is provided due to broken data in dag
        isAvailable: ({ showBetaBranchData }) => !showBetaBranchData,
    },
    {
        name: "PagesPerVisit",
        getTitle: (is28d) => (is28d ? "Wa.Ao.Graph.Pages" : "wa.ao.graph.pages"),
        iconName: "pages-per-visit",
        format: "decimalNumber",
        tooltip: "wa.ao.graph.pages.tooltip",
        //Currently we want to hide this metric in case beta calculation is provided due to broken data in dag
        isAvailable: ({ showBetaBranchData }) => !showBetaBranchData,
    },
    {
        name: "BounceRate",
        getTitle: (is28d) => (is28d ? "Wa.Ao.Graph.Bounce" : "wa.ao.graph.bounce"),
        iconName: "bounce-rate-2",
        format: "percentagesign:2",
        tooltip: "wa.ao.graph.bounce.tooltip",
        //Currently we want to hide this metric in case beta calculation is provided due to broken data in dag
        isAvailable: ({ showBetaBranchData }) => !showBetaBranchData,
    },
    {
        name: "PageViews",
        getTitle: (is28d) => (is28d ? "wa.ao.graph.PageViews" : "wa.ao.graph.PageViews"),
        iconName: "pages-per-visit",
        format: "minVisitsAbbr",
        tooltip: "wa.ao.graph.page.views.tooltip",
        //Currently we want to hide this metric in case beta calculation is provided due to broken data in dag
        isAvailable: ({ showBetaBranchData }) => !showBetaBranchData,
    },
].map((item) => {
    item["metric"] = item.name;
    return item;
});

export const initPOPItemsSingleMode = [
    {
        name: "Visits",
        title: "wa.ao.graph.avgvisits",
        iconName: "visits",
        format: "minVisitsAbbr",
        tooltip: "wa.ao.graph.avgvisits.tooltip",
    },
    {
        name: "AvgVisitDuration",
        title: "wa.ao.graph.avgduration",
        iconName: "avg-visit-duration",
        format: "time",
        tooltip: "wa.ao.graph.avgduration.tooltip",
    },
    {
        name: "PagesPerVisit",
        title: "wa.ao.graph.pages",
        iconName: "pages-per-visit",
        format: "decimalNumber",
        tooltip: "wa.ao.graph.pages.tooltip",
    },
    {
        name: "BounceRate",
        title: "wa.ao.graph.bounce",
        iconName: "bounce-rate-2",
        format: "percentagesign:2",
        tooltip: "wa.ao.graph.bounce.tooltip",
    },
].map((item) => ({
    ...item,
    metric: item.name,
}));

export const initPOPItemsCompareMode = [
    {
        name: "Visits",
        title: "wa.ao.graph.avgvisits",
        iconName: "visits",
        tooltip: "wa.ao.graph.avgvisits.tooltip",
    },
    {
        name: "UniqueUsers",
        title: "wa.ao.graph.muv",
        iconName: "monthly-unique-visitors",
        isAvailable: ({ isGa, duration }) => !isGa || duration !== "28d",
    },
    {
        name: "AvgVisitDuration",
        title: "wa.ao.graph.avgduration",
        iconName: "avg-visit-duration",
        tooltip: "wa.ao.graph.avgduration.tooltip",
    },
    {
        name: "PagesPerVisit",
        title: "wa.ao.graph.pages",
        iconName: "pages-per-visit",
        tooltip: "wa.ao.graph.pages.tooltip",
    },
    {
        name: "BounceRate",
        title: "wa.ao.graph.bounce",
        iconName: "bounce-rate-2",
        tooltip: "wa.ao.graph.bounce.tooltip",
    },
].map((item) => ({
    ...item,
    metric: item.name,
    value: " ",
    format: "NoneFilter",
}));
