import {
    DefaultCellHeader,
    DefaultCellHeaderRightAlign,
    HeaderCellBlank,
} from "components/React/Table/headerCells";
import {
    DefaultCellRightAlign,
    IndexCell,
    SearchKeywordCell,
    UrlCellWebsiteAnalysis,
} from "components/React/Table/cells";
import { i18nFilter } from "filters/ngFilters";
import { RowSelectionConsumer } from "components/React/Table/cells/RowSelection";
import { SelectAllRowsHeaderCellConsumer } from "components/React/Table/headerCells/SelectAllRowsHeaderCell";
import { SerpTableCellCompare } from "pages/website-analysis/traffic-sources/search/components/serp/SerpTableCellCompare";
import { SerpTableCellSingle } from "pages/website-analysis/traffic-sources/search/components/serp/SerpTableCellSingle";
import { PositionChangeCell } from "pages/website-analysis/traffic-sources/search/tabs/RankingDistribution/PositionChangeCell";
import { PositionAbsoluteChangeCell } from "pages/website-analysis/traffic-sources/search/tabs/RankingDistribution/PositionAbsoluteChangeCell";
import {
    DomainPositionCell,
    DomainPositionCellHeader,
} from "pages/website-analysis/traffic-sources/search/tabs/RankingDistribution/DomainPositionCell";
import dayjs from "dayjs";
import { FORMAT_VISUAL } from "pages/website-analysis/traffic-sources/search/tabs/RankingDistribution/Constants";
import { invertSortDirection } from "UtilitiesAndConstants/UtilityFunctions/sort";

const i18n = i18nFilter();

interface IColumnsConfigArguments {
    domains: string[];
    hasKwaPermission: boolean;
    sortedColumn: string;
    sortDirection: string;
    currentMonth: string;
}
export const getColumnsConfig = ({
    domains,
    hasKwaPermission,
    sortedColumn,
    sortDirection,
    currentMonth,
}: IColumnsConfigArguments) => {
    const compare = domains.length > 1;
    const COLUMNS_I18N_KEY = "analysis.source.search.all.table.columns";
    const compareColumns = domains.map((domain, index) => ({
        field: `position${index}`,
        trackingName: `position${index}`,
        displayName: domain,
        cellComponent: DomainPositionCell(domain),
        headerComponent: DomainPositionCellHeader(domain),
        sortable: true,
        sortDirection: "asc",
        width: 117,
        showTotalCount: true,
    }));
    const columns = [
        hasKwaPermission
            ? {
                  fixed: true,
                  cellComponent: RowSelectionConsumer,
                  sortable: false,
                  headerComponent: SelectAllRowsHeaderCellConsumer,
                  isResizable: false,
                  width: 40,
                  visible: true,
              }
            : false,
        {
            fixed: true,
            cellComponent: IndexCell,
            headerComponent: HeaderCellBlank,
            disableHeaderCellHover: true,
            sortable: false,
            isResizable: false,
            width: 58,
        },
        {
            field: "Keyword",
            trackingName: "Search Term",
            displayName: i18n("ranking.distribution.columns.keyword"),
            tooltip: i18n("analysis.source.search.all.table.columns.searchterms.title.tooltip"),
            cellComponent: (props) => {
                return <SearchKeywordCell {...props} adsUrl={props.row.adsUrl} />;
            },
            sortable: true,
            minWidth: 160,
            showTotalCount: true,
        },
        ...(compare
            ? compareColumns
            : [
                  {
                      field: "position0",
                      trackingName: "Position",
                      displayName: i18n("ranking.distribution.columns.position"),
                      headerComponent: DefaultCellHeader,
                      tooltip: i18n("ranking.distribution.columns.position.tooltip", {
                          current: dayjs.utc(currentMonth).format(FORMAT_VISUAL),
                      }),
                      cellComponent: PositionChangeCell,
                      sortable: true,
                      sortDirection: "asc",
                      width: 92,
                  },
                  {
                      field: "Change",
                      trackingName: "Change",
                      displayName: i18n("ranking.distribution.columns.change"),
                      headerComponent: DefaultCellHeaderRightAlign,
                      tooltip: i18n("ranking.distribution.columns.change.tooltip", {
                          current: dayjs.utc(currentMonth).format(FORMAT_VISUAL),
                          previous: dayjs
                              .utc(currentMonth)
                              .subtract(1, "month")
                              .format(FORMAT_VISUAL),
                      }),
                      // eslint-disable-next-line react/display-name
                      cellComponent: PositionAbsoluteChangeCell,
                      sortable: true,
                      minWidth: 95,
                  },
              ]),
        {
            field: "Volume",
            trackingName: "Volume",
            displayName: i18n(`${COLUMNS_I18N_KEY}.volume.title`),
            tooltip: i18n(`${COLUMNS_I18N_KEY}.volume.title.tooltip`),
            format: "swPosition",
            headerComponent: DefaultCellHeaderRightAlign,
            cellComponent: DefaultCellRightAlign,
            sortable: true,
            sortDirection: "desc",
            minWidth: 100,
        },
        {
            field: "Cpc",
            trackingName: "CPC",
            displayName: i18n(`${COLUMNS_I18N_KEY}.cpc.title`),
            tooltip: i18n(`${COLUMNS_I18N_KEY}.cpc.title.tooltip`),
            headerComponent: DefaultCellHeaderRightAlign,
            cellComponent: DefaultCellRightAlign,
            format: "CPC",
            sortDirection: "desc",
            sortable: true,
            minWidth: 90,
        },
        {
            field: "Serp",
            trackingName: compare ? "Total Group Traffic Share" : "Traffic Share",
            displayName: i18n("serp.column.name"),
            tooltip: i18n("serp.column.tooltip"),
            headerComponent: (props) => {
                return <DefaultCellHeader {...props} isBeta={true} />;
            },
            cellComponent: compare ? SerpTableCellCompare : SerpTableCellSingle,
            width: compare ? 210 : 133,
            sortable: false,
        },
        {
            field: `CurrentUrl`,
            trackingName: `URL`,
            displayName: i18n("ranking.distribution.columns.url"),
            tooltip: i18n("ranking.distribution.columns.url.tooltip"),
            cellComponent: UrlCellWebsiteAnalysis,
            cellClass: "url-cell",
            sortable: false,
            minWidth: 240,
            isResizable: true,
        },
    ].filter((column) => !!column);

    return columns.map<any>((col: any) => {
        const isSorted = sortedColumn && col.field === sortedColumn;
        return {
            ...col,
            visible: true,
            sortable: col.sortable || false,
            headerComponent: col.headerComponent || DefaultCellHeader,
            isSorted,
            sortDirection: isSorted
                ? col.inverted
                    ? invertSortDirection(sortDirection)
                    : sortDirection
                : "desc",
        };
    });
};
