import { default as React } from "react";
import { i18nFilter } from "../../../../filters/ngFilters";
import {
    DefaultCellHeader,
    DefaultCellHeaderRightAlign,
} from "../../../../components/React/Table/headerCells";
import {
    ChangePercentage,
    DefaultCellRightAlign,
    LeadingSite,
    PercentageBarCellRoundedRight,
    SearchKeywordCell,
} from "../../../../components/React/Table/cells";
import { TrafficShareWithTooltip } from "../../../../../.pro-features/components/TrafficShare/src/TrafficShareWithTooltip";
import CoreTrendsBarCell from "../../../../../.pro-features/components/core cells/src/CoreTrendsBarCell/CoreTrendsBarCell";
import CoreNumberCell from "../../../../../.pro-features/components/core cells/src/CoreNumberCell/CoreNumberCell";
import { Injector } from "../../../../../scripts/common/ioc/Injector";
const i18n = i18nFilter();
const DEFAULT_SORT_FIELD = "share";
const DEFAULT_SORT_DIRECTION = "desc";
export const MarketingWorkspaceKeywordsGroupTableSettings = {
    defaultSortField: DEFAULT_SORT_FIELD,
    defaultSortDirection: DEFAULT_SORT_DIRECTION,
    searchFieldName: "Keyword",
    getColumns: (
        sortedColumn = { field: "share", sortDirection: "desc" },
        benchmark: boolean = false,
        isWindow?: boolean,
    ) => {
        const columns: any[] = [
            {
                field: "keyword",
                sortable: true,
                showTotalCount: true,
                cellComponent: (props) => {
                    const swNavigator = Injector.get<any>("swNavigator");
                    const params =
                        Injector.get<any>("$ngRedux").getState().marketingWorkspace
                            ?.selectedWorkspace?.filters ?? {};
                    return (
                        <SearchKeywordCell
                            {...props}
                            adsUrl={swNavigator.href("keywordAnalysis-ads", {
                                ...params,
                                keyword: props.value,
                            })}
                        />
                    );
                },
                displayName: i18nFilter()("workspaces.ppc.table.column.keyword"),
                tooltip: i18nFilter()("workspaces.ppc.table.column.keyword.tooltip"),
                width: 300,
            },
            {
                field: "share",
                sortable: true,
                cellComponent: ({ value }) => {
                    return <CoreNumberCell value={value * 100} format="0.00" suffix="%" />;
                },
                displayName: i18nFilter()("workspaces.ppc.table.column.trafficshare"),
                tooltip: i18nFilter()("workspaces.ppc.table.column.trafficshare.tooltip"),
                width: 162,
            },
            ...(!isWindow
                ? [
                      {
                          field: "change",
                          sortable: true,
                          cellComponent: ChangePercentage,
                          displayName: i18nFilter()("workspaces.ppc.table.column.change"),
                          tooltip: i18nFilter()("workspaces.ppc.table.column.change.tooltip"),
                          width: 162,
                      },
                  ]
                : []),
            {
                field: "volume",
                sortable: true,
                displayName: i18nFilter()("workspaces.ppc.table.column.volume"),
                tooltip: i18nFilter()("workspaces.ppc.table.column.volume.tooltip"),
                cellComponent: DefaultCellRightAlign,
                format: "swPosition",
                width: 135,
            },
            {
                field: "volumeTrend",
                displayName: i18nFilter()("workspaces.ppc.table.column.trend"),
                tooltip: i18nFilter()("workspaces.ppc.table.column.trend.tooltip"),
                cellComponent: CoreTrendsBarCell,
                width: 130,
            },
            {
                field: "zeroClicksShare",
                sortable: false,
                displayName: i18nFilter()("workspaces.ppc.table.column.zero.clicks"),
                tooltip: i18nFilter()("workspaces.ppc.table.column.zero.clicks.tooltip"),
                cellComponent: (props) => (
                    <PercentageBarCellRoundedRight
                        {...props}
                        value={props.value && [1 - props.value, props.value]}
                        percentageFilterFraction={0}
                        showTooltip={true}
                        tooltipTopLabel={
                            "workspaces.keywords.list.table.column.zero.clicks.tooltip.top"
                        }
                        tooltipBottomLabel={
                            "workspaces.keywords.list.table.column.zero.clicks.tooltip.bottom"
                        }
                    />
                ),
                width: 170,
            },
            {
                field: "cpc",
                sortable: true,
                displayName: i18nFilter()("workspaces.ppc.table.column.cpc"),
                tooltip: i18nFilter()("workspaces.ppc.table.column.cpc.tooltip"),
                cellComponent: ({ value }) => {
                    return <CoreNumberCell value={value} format="0.00" prefix="$" />;
                },
                headerComponent: DefaultCellHeaderRightAlign,
                width: 116,
            },
        ];
        if (benchmark) {
            columns.splice(1, 0, {
                field: "trafficDistribution",
                displayName: i18nFilter()("workspaces.ppc.table.column.trafficDistribution"),
                tooltip: i18nFilter()("workspaces.ppc.table.column.trafficDistribution.tooltip"),
                cellComponent: ({ value, tooltipTitle }) => {
                    return <TrafficShareWithTooltip data={value} title={tooltipTitle} />;
                },
                tooltipTitle: i18n("workspaces.marketing.trafficshare.tooltip.title"),
                width: 600,
            });
        } else {
            columns.push({
                width: 200,
                sortable: true,
                field: "leadingDomain",
                displayName: i18nFilter()("workspaces.ppc.table.column.leadingdomain"),
                tooltip: i18nFilter()("workspaces.ppc.table.column.leadingdomain.toolip"),
                cellComponent: LeadingSite,
            });
        }
        return columns.map((col: any) => {
            const isSorted = sortedColumn && col.field === sortedColumn.field;
            return {
                visible: true,
                headerComponent: DefaultCellHeader,
                isSorted,
                sortDirection: isSorted ? sortedColumn.sortDirection : DEFAULT_SORT_DIRECTION,
                ...col,
            };
        });
    },
};
