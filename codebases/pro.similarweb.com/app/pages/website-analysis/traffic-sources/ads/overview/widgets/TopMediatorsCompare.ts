import { getTableBaseClass } from "components/widget/widgetUtils";

const getWidgetConfig = (params) => ({
    properties: {
        type: "Table",
        width: "4",
        title: "analysis.source.ads.overview.topmediators",
        tooltip: "analysis.source.ads.overview.topmediators.tooltip",
        height: "215px",
        apiController: "WebsiteDisplayAds",
        apiParams: {
            metric: "WebsiteAdsMediators",
            pageSize: "5",
            orderBy: "TotalShare desc",
        },
        options: {
            noBoxShadow: true,
            showTitle: true,
            showTitleTooltip: true,
            titlePaddingBottom: "0px",
            titleType: "text",
            showSubtitle: false,
            titleClass: "u-no-margin",
            showLegend: false,
            showSettings: false,
            showTopLine: false,
            showFrame: true,
            titleIcon: false,
            cssClass: "swTable--simple",
            dashboardSubtitleMarginBottom: "-4",
            hideBorders: true,
            overrideColumns: true,
            frameClass: "responsive",
        },
        columns: [
            {
                name: "Mediator",
                title: "",
                type: "string",
                format: "None",
                sortable: "False",
                isSorted: "False",
                sortDirection: "desc",
                groupable: "False",
                //"cellTemp": "website-tooltip-top-cell",
                headTemp: "",
                totalCount: "False",
                width: "",
            },
            {
                name: "ShareSplit",
                title: "Traffic Share",
                type: "string",
                format: "percentagesign",
                formatParameter: 2,
                headerCellClass: "ads-traffic-share-headercell",
                sortable: false,
                isSorted: false,
                isLink: true,
                sortDirection: "desc",
                groupable: false,
                cellTemp: "group-traffic-share",
                // headTemp: "",
                totalCount: false,
                tooltip: false,
                width: "53%",
            },
        ],
    },
});

export default getTableBaseClass(getWidgetConfig);
