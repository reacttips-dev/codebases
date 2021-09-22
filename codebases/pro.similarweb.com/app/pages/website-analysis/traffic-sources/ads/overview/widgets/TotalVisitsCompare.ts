import { createBaseClassFrom } from "components/widget/widgetUtils";
import { TablePieTotalVisitsWidget } from "components/widget/widget-types/TablePieTotalVisitsWidget";
import TopPublishersDomainHOC from "../../components/topPublishersDomainHOC";
import { DefaultCellHeaderRightAlign } from "../../../../../../components/React/Table/headerCells/DefaultCellHeaderRightAlign";
import { NumberCommaCell, TablePieCell } from "../../../../../../components/React/Table/cells";
import {
    DefaultCellHeader,
    ToggleHeaderCellRightAlign,
} from "../../../../../../components/React/Table/headerCells";

const getWidgetConfig = (params) => ({
    properties: {
        type: "Table",
        family: "Website",
        width: "4",
        title: "analysis.source.ads.overview.totalvisits",
        tooltip: "analysis.source.ads.overview.totalvisits",
        height: "215px",
        loadingHeight: "202px",
        apiController: "WebsiteDisplayAds",
        apiParams: {
            metric: "WebsiteAdsVisitsOverview",
        },
        options: {
            noBoxShadow: true,
            showTitle: true,
            showTitleTooltip: true,
            titlePaddingBottom: "0px",
            titleClass: "u-no-margin",
            titleType: "text",
            showSubtitle: false,
            showLegend: false,
            preserveLegendSpace: false,
            showSettings: false,
            showTopLine: false,
            showFrame: true,
            hideBorders: true,
            titleIcon: false,
            dashboardSubtitleMarginBottom: "-4",
            titleTemplate:
                "/app/components/widget/widget-templates/widget-title-mobile-desktop.html",
            frameClass: "responsive",
            cssClass: "swTable--simple",
            trackName: "Total Visits",
        },
        columns: [
            {
                field: "SearchTotal",
                cellComponent: TablePieCell,
                headerComponent: ToggleHeaderCellRightAlign,
                format: "abbrNumber",
                fields: [
                    {
                        symbol: "widget-toggle-rank",
                        field: "SearchTotal",
                        format: "abbrNumber",
                        isActive: true,
                    },
                    {
                        symbol: "widget-toggle-percentage",
                        field: "ShareOfVisits",
                        format: "percentagesign:2",
                        isActive: false,
                    },
                ],
            },
        ],
        chartOptions: {
            legend: {
                enabled: false,
            },
            chart: {
                spacing: [0, 0, 0, 0],
            },
        },
    },
});

const getMetricTypeConfig = (params) => ({
    properties: {
        options: {
            showLegend: false,
            preserveLegendSpace: true,
        },
    },
    columns: [
        {
            name: "Domain",
            title: "Domain",
            columnClass: "column-pad-left",
            type: "string",
            format: "None",
            sortable: false,
            isSorted: false,
            sortDirection: "desc",
            groupable: true,
            // cellTemp: "website-tooltip-top-cell",
            cellComponent: TopPublishersDomainHOC,
            headerComponent: DefaultCellHeader,
            totalCount: false,
            tooltip: "",
            width: "",
        },
        {
            name: "SearchTotal",
            title: "Total Visits",
            type: "double",
            format: "None",
            sortable: false,
            isSorted: false,
            sortDirection: "desc",
            groupable: true,
            cellComponent: NumberCommaCell,
            headerComponent: DefaultCellHeaderRightAlign,
            totalCount: false,
            tooltip: "",
            width: "",
        },
    ],
    filters: {},
});

export default createBaseClassFrom(TablePieTotalVisitsWidget, getWidgetConfig, getMetricTypeConfig);
