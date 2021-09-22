/* eslint-disable react/display-name */
import dayjs from "dayjs";
import {
    ChangePercentage,
    DefaultCellRightAlign,
    IndexCell,
    LeadingSite,
    OrganicPaid,
    SearchKeywordCell,
    TrafficShareWithVisits,
} from "components/React/Table/cells";
import {
    DefaultCellHeader,
    DefaultCellHeaderRightAlign,
    HeaderCellBlank,
} from "components/React/Table/headerCells";
import { i18nFilter, abbrNumberFilter } from "filters/ngFilters";
import CoreTrendsBarCell from "components/core cells/src/CoreTrendsBarCell/CoreTrendsBarCell";
import { Injector } from "common/ioc/Injector";
import DurationService from "services/DurationService";
import _ from "lodash";
import { RowSelectionConsumer } from "components/React/Table/cells/RowSelection";
import { SelectAllRowsHeaderCellConsumer } from "components/React/Table/headerCells/SelectAllRowsHeaderCell";

enum ETopKeywordsTable {
    all = 0,
    organic = 1,
    paid = 2,
}

export const DEFAULT_SORT = "TotalShare";
export const DEFAULT_SORT_DIRECTION = "desc";

const dateFormat = (date) => dayjs(date).format("MMM, YYYY");

const columns = (duration, tabIndex) => {
    const showOrganicColumn = tabIndex === ETopKeywordsTable.all;

    const durationTooltip = _.mapValues(
        DurationService.getDurationData(duration || "", "", "").forTooltip,
        (v) => {
            return decodeURIComponent(v);
        },
    );

    const durationParams = {
        currentMonth: durationTooltip.to,
        lastMonth: durationTooltip.from,
    };

    return [
        {
            fixed: true,
            cellComponent: RowSelectionConsumer,
            headerComponent: SelectAllRowsHeaderCellConsumer,
            sortable: false,
            isResizable: false,
            width: 40,
            disableHeaderCellHover: true,
        },
        {
            fixed: true,
            cellComponent: IndexCell,
            headerComponent: HeaderCellBlank,
            disableHeaderCellHover: true,
            sortable: false,
            isResizable: false,
            width: 60,
        },
        {
            field: "SearchTerm",
            sortable: true,
            showTotalCount: true,
            displayName: i18nFilter()("ia.topkeywords.table.column.searchTerm"),
            minWidth: 150,
            tooltip: i18nFilter()(
                "analysis.source.search.all.table.columns.searchterms.title.tooltip",
            ),
            cellComponent: (props) => {
                const swNavigator = Injector.get<any>("swNavigator");
                return (
                    <SearchKeywordCell
                        {...props}
                        adsUrl={swNavigator.href("keywordAnalysis-ads", {
                            ...swNavigator.getParams(),
                            keyword: props.value,
                        })}
                    />
                );
            },
        },
        {
            field: "TotalShare",
            displayName: i18nFilter()("ia.topkeywords.table.column.trafficsharewithvisits"),
            sortable: true,
            cellComponent: TrafficShareWithVisits,
            tooltip: i18nFilter()("keywords.seasonality.table.columns.traffic.share.tooltip"),
            width: 148,
        },
        {
            field: "Organic",
            trackingName: "Organic",
            displayName: i18nFilter()("analysis.source.search.all.table.columns.Org/Paid.title"),
            tooltip: i18nFilter()("analysis.source.search.all.table.columns.vs.title.tooltip"),
            cellComponent: OrganicPaid,
            width: 105,
            sortable: false,
            visible: showOrganicColumn,
        },
        {
            field: "Change",
            format: "percentagesign",
            displayName: i18nFilter()("ia.topkeywords.table.column.change"),
            sortable: true,
            isSorted: false,
            cellComponent: ChangePercentage,
            headerComponent: DefaultCellHeaderRightAlign,
            sortDirection: "desc",
            tooltip: i18nFilter()(
                "analysis.source.search.all.table.columns.change.title.tooltip",
                durationParams,
            ),
            width: 95,
            visible: true,
        },
        {
            field: "Volume",
            displayName: i18nFilter()("ia.topkeywords.table.column.volume"),
            type: "double",
            format: "abbrNumber",
            sortable: false,
            isSorted: false,
            cellComponent: DefaultCellRightAlign,
            headerComponent: DefaultCellHeaderRightAlign,
            sortDirection: "desc",
            tooltip: i18nFilter()("widget.table.tooltip.searchkeywordsabb.volume"),
            width: 81,
            visible: true,
        },
        {
            field: "VolumeTrend",
            displayName: i18nFilter()("ia.topkeywords.table.column.trend"),
            type: "double",
            format: "None",
            sortable: false,
            isSorted: false,
            headerComponent: DefaultCellHeaderRightAlign,
            width: 130,
            visible: true,
            tooltip: i18nFilter()("keyword.generator.tool.table.column.volumetrend.tooltip"),
            cellComponent: ({ value }) => {
                if (value) {
                    const data = Object.keys(value)
                        .sort()
                        .map((item) => ({
                            value: value[item],
                            tooltip: (
                                <span>
                                    <strong>{`${abbrNumberFilter()(value[item])}`}</strong>
                                    {` searches in ${dateFormat(item)}`}
                                </span>
                            ),
                        })) as [];
                    return <CoreTrendsBarCell value={data} />;
                } else {
                    return "N/A";
                }
            },
        },
        {
            field: "Cpc",
            displayName: i18nFilter()("ia.topkeywords.table.column.cpc"),
            type: "double",
            format: "CPC",
            sortable: false,
            isSorted: false,
            cellComponent: DefaultCellRightAlign,
            headerComponent: DefaultCellHeaderRightAlign,
            sortDirection: "desc",
            width: 65,
            visible: true,
            tooltip: i18nFilter()("widget.table.tooltip.searchkeywordsabb.cpc"),
        },
        {
            field: "LeadingSite",
            sortable: false,
            cellComponent: ({ row }) => (
                <LeadingSite value={row.LeadingSite} row={{ favicon: row.Favicon }} />
            ),
            displayName: i18nFilter()("keywords.seasonality.table.leader.name"),
            tooltip: i18nFilter()("keywords.seasonality.table.leader.name.tooltip"),
            sortDirection: "desc",
            width: 150,
            visible: true,
        },
    ]
        .filter((col) => col)
        .map((col: any) => {
            const isSorted = col.field === DEFAULT_SORT;
            return {
                visible: true,
                headerComponent: DefaultCellHeader,
                isSorted,
                sortDirection: DEFAULT_SORT_DIRECTION,
                isResizable: col.isResizable !== false,
                ...col,
            };
        });
};

export default { getColumns: columns };
