import { DefaultCellHeaderRightAlign } from "../../../components/React/Table/headerCells/DefaultCellHeaderRightAlign";

const geographyTable = {
    type: "GeographyTable",
    properties: {
        metric: "GeographyExtended",
        excelMetric: "GeographyExtended",
        apiController: "WebsiteGeographyExtended",
        type: "GeographyTable",
        width: "12",
        height: "auto",
        title: "",
        apiParams: {
            webSource: "Desktop",
        },
        options: {
            cssClass: "widgetTable",
            showIndex: true,
            showTitle: false,
            showSubtitle: false,
            showLegend: false,
            showSettings: false,
            showTopLine: false,
            showFrame: false,
            loadingSize: 20,
            showCompanySidebar: true,
            stickyHeader: true,
            overrideColumns: true,
            useNewLegends: true,
            useBulletLegends: true,
            canAddToDashboard: true,
        },
        columns: [
            {
                fixed: true,
                cellTemp: "index",
                sortable: false,
                width: 65,
                disableHeaderCellHover: true,
            },
            {
                name: "Country",
                title: "analysis.audience.geo.table.columns.country.title",
                type: "string",
                format: "None",
                sortable: true,
                isSorted: false,
                sortDirection: "desc",
                groupable: false,
                cellTemp: "country-cell",
                headTemp: "",
                totalCount: true,
                tooltip: "analysis.audience.geo.table.columns.country.title.tooltip",
                width: 230,
                ppt: {
                    // override the table column format when rendered in ppt
                    overrideFormat: "Country",
                },
            },
            {
                name: "Share",
                title: "analysis.audience.geo.table.columns.share.title",
                type: "string",
                format: "percentagesign",
                sortable: false,
                isSorted: false,
                isLink: true,
                sortDirection: "desc",
                groupable: false,
                cellTemp: "traffic-share",
                headTemp: "",
                totalCount: false,
                tooltip: "analysis.audience.geo.table.columns.share.title.tooltip",
                minWidth: 132,
                width: 132,
            },
            {
                name: "Change",
                title: "analysis.audience.geo.table.columns.change.title",
                type: "double",
                format: "percentagesign",
                sortable: "True",
                isSorted: "False",
                sortDirection: "desc",
                groupable: "False",
                cellTemp: "change-percentage",
                headerComponent: DefaultCellHeaderRightAlign,
                totalCount: "False",
                tooltip: "widget.table.tooltip.topsites.change",
                width: 110,
            },
            {
                name: "Rank",
                title: "wa.ao.ranks.country",
                type: "long",
                format: "swRank",
                sortable: "True",
                isSorted: "False",
                sortDirection: "asc",
                groupable: "False",
                cellTemp: "rank-cell",
                headerComponent: DefaultCellHeaderRightAlign,
                totalCount: "False",
                tooltip: "widget.table.tooltip.topsites.rank",
                width: 180,
                inverted: "True",
            },
        ],
    },
    utilityGroups: [
        {
            properties: {
                className: "tableBottomLeft",
            },
            utilities: [
                {
                    id: "dropdown",
                    properties: {
                        param: "filter",
                        column: "country",
                        operator: "==",
                        type: "number",
                        placeholder: "forms.country.placeholder",
                        showSearch: true,
                        emptySelect: true,
                        trackingName: "Country",
                    },
                },
            ],
        },
        {
            properties: {
                className: "tableBottomRight",
            },
            utilities: [
                {
                    id: "table-export",
                    properties: {},
                },
                {
                    id: "columns-toggle",
                    properties: {},
                },
            ],
        },
        {
            properties: {
                className: "tableBottom",
            },
            utilities: [
                {
                    id: "table-pager",
                    properties: {},
                },
            ],
        },
    ],
};
export default geographyTable;
