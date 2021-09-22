import * as React from "react";
import { ShareBarCell, AnalyzeFolderCell } from "components/React/Table/cells";
import { FolderAnalysisExpanded } from "./FolderAnalysis";
import { Injector } from "common/ioc/Injector";
import { AnalyzeFolderHeaderCell } from "../../../../components/React/Table/headerCells";
import { SwTrack } from "services/SwTrack";

const allWidgets = (hasFolderAnalysis) => {
    const swNavigator = Injector.get("swNavigator") as any;
    const params = swNavigator.getApiParams();
    const isFiltersSupported = params.webSource === "Desktop";

    function createTableConfig(metric, apiController, tableSearchColumn, compare, columnSettings) {
        return {
            metric: metric,
            type: "LeadingFoldersTable",
            properties: {
                metric: metric,
                apiController: apiController,
                family: "Website",
                type: "LeadingFoldersTable",
                height: "auto",
                width: "12",
                ignoreCompareMode: compare,
                apiParams: {
                    includeSubDomains: false,
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
                    get EnrichedRowComponent() {
                        return hasFolderAnalysis ? FolderAnalysisExpanded : null;
                    },
                    get enrichedRowComponentHeight() {
                        const width = window.innerWidth;
                        if (width < 1200 && width > 320) {
                            return 625;
                        }
                        if (width <= 320) {
                            return 685;
                        } else return 580;
                    },
                    shouldEnrichRow: (props, index) => {
                        const { tableData } = props;
                        return (
                            index > -1 &&
                            isFiltersSupported &&
                            tableData[index].IsFolderAnalysisSupported
                        );
                    },
                    isFiltersSupported,
                    onEnrichedRowClick: (isOpen, rowIndex, row) => {
                        SwTrack.all.trackEvent(
                            "analyze leading folders",
                            isOpen ? "open" : "close",
                            `table/${rowIndex + 1}/${row.Folder}`,
                        );
                    },
                    customTableClass: "leading-folders-table",
                },
                columns: columnSettings,
            },
            utilityGroups: [
                {
                    properties: {
                        className: "tableBottomLeft",
                    },
                    utilities: [
                        {
                            id: "table-search",
                            properties: {
                                column: tableSearchColumn,
                            },
                        },
                        compare
                            ? {
                                  id: "domain-selector",
                                  properties: {},
                              }
                            : {},
                    ],
                },
                {
                    properties: {
                        className: "tableBottomRight u-right-padding-50",
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
    }

    const leadingFoldersColumns: any[] = [
        {
            cellTemp: "index",
            sortable: false,
            width: 65,
            disableHeaderCellHover: true,
        },
        {
            name: "Folder",
            title: "analysis.content.pop.folders.table.columns.folder.title",
            type: "string",
            format: "None",
            sortable: true,
            isSorted: false,
            sortDirection: "desc",
            groupable: false,
            cellTemp: "CellSite",
            totalCount: true,
            tooltip: "analysis.common.content.pop.folders.tooltip",
            minWidth: 390,
        },
        {
            name: "Share",
            title: "analysis.content.pop.pages.table.columns.share.title",
            type: "string",
            format: "percentagesign",
            sortable: true,
            isSorted: true,
            sortDirection: "desc",
            groupable: false,
            cellComponent: ShareBarCell,
            cellCls: hasFolderAnalysis ? "u-flex-row SWLeadingFoldersShareCell" : "",
            totalCount: false,
            tooltip: "analysis.content.pop.folders.table.columns.share.title.tooltip",
            width: 400,
        },
    ];

    if (hasFolderAnalysis) {
        leadingFoldersColumns.push({
            name: "Analysis",
            title: "analysis.content.pop.pages.table.columns.analysis.title",
            cellComponent: AnalyzeFolderCell,
            headerComponent: AnalyzeFolderHeaderCell,
            sortable: false,
            width: 110,
        });
    }

    return {
        single: [
            createTableConfig(
                "LeadingFolders",
                "LeadingFolders",
                "Folder",
                false,
                leadingFoldersColumns,
            ),
        ],
        compare: [
            createTableConfig(
                "LeadingFolders",
                "LeadingFolders",
                "Folder",
                true,
                leadingFoldersColumns,
            ),
        ],
    };
};

export const LeadingFoldersWidgets = allWidgets;
