import * as _ from "lodash";
import React from "react";
import DurationService from "services/DurationService";
import CountryService from "services/CountryService";
import {
    DefaultCellHeader,
    DefaultCellHeaderRightAlign,
    HeaderCellBlank,
} from "components/React/Table/headerCells";
import {
    AdsenseCell,
    ChangePercentage,
    DefaultCellRightAlign,
    GroupTrafficShare,
    IndexCell,
    OrganicPaid,
    SearchKeywordCell,
    TrafficShareWithVisits,
    UrlCellWebsiteAnalysis,
    WaKeywordPosition,
    WaKeywordPositionCompare,
} from "components/React/Table/cells";
import { i18nFilter, i18nTemplateFilter } from "filters/ngFilters";
import { RowSelectionConsumer } from "components/React/Table/cells/RowSelection";
import { SelectAllRowsHeaderCellConsumer } from "components/React/Table/headerCells/SelectAllRowsHeaderCell";
import { SerpTableCellCompare } from "pages/website-analysis/traffic-sources/search/components/serp/SerpTableCellCompare";
import { SerpTableCellSingle } from "pages/website-analysis/traffic-sources/search/components/serp/SerpTableCellSingle";
import { DotsLoader } from "@similarweb/ui-components/dist/search-input/src/DotsLoader";
import { tooltipChildType } from "components/React/Table/cells/WaKeywordPositionCompare";

const i18n = i18nFilter();
const positionCompareCellTooltipChild: tooltipChildType = "cell";

interface IColumnsConfigArguments {
    duration: string;
    country: string;
    webSource: string;
    domains: string[];
    data: any;
    organicPaid: "Organic" | "Paid";
    filters: any & {
        IncludeOrganic: boolean;
        IncludePaid: boolean;
    };
    hasKwaPermission: boolean;
    sortedColumn: string;
    sortDirection: string;
    serpData: any;
}
export const getColumnsConfig = ({
    duration,
    country,
    webSource,
    domains,
    data,
    organicPaid,
    filters,
    hasKwaPermission,
    sortedColumn,
    sortDirection,
    serpData,
}: IColumnsConfigArguments) => {
    const durationObject = DurationService.getDurationData(duration);
    const durationTooltip = _.mapValues(durationObject.forTooltip, function (v) {
        return decodeURIComponent(v);
    });
    const { isDaily } = durationObject.raw;
    const durationTooltipParams = {
        [isDaily ? "currentweek" : "currentMonth"]: durationTooltip.to,
        [isDaily ? "lastweek" : "lastMonth"]: durationTooltip.from,
    };
    const isUsState = CountryService.isUSState(country);
    const compare = domains.length > 1;
    const canSortVolumeAndCPC = data.TotalCount < 10 * 1000;
    const COLUMNS_I18N_KEY = isUsState
        ? "analysis.source.search.all.table.columns.us"
        : "analysis.source.search.all.table.columns";
    const COLUMNS_I18N_KEY_SUFFIX = !canSortVolumeAndCPC ? ".nosort" : "";
    const OrganicPaidFilter = organicPaid;
    const { IncludeOrganic, IncludePaid } = filters;
    const includeOrganicPaidColumn =
        webSource === "Desktop" &&
        ((IncludeOrganic && IncludePaid) || (!IncludeOrganic && !IncludePaid));
    // selected the relevant column (organic/paid/compare mode)

    const serpFailed = data?.Header?.flags?.serpFailed;
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
            width: 40,
        },
        {
            field: "SearchTerm",
            trackingName: "Search Term",
            displayName: i18n("analysis.source.search.all.table.columns.searchterms.title"),
            tooltip: i18n("analysis.source.search.all.table.columns.searchterms.title.tooltip"),
            cellComponent: SearchKeywordCell,
            sortable: true,
            minWidth: 160,
            showTotalCount: true,
        },
        {
            field: "TotalShare",
            trackingName: compare ? "Total Group Traffic Share" : "Traffic Share",
            displayName: i18n(
                compare
                    ? "analysis.source.search.all.table.columns.totalShareWithVisitsCompare.title"
                    : "analysis.source.search.all.table.columns.shareWithVisits.title",
            ),
            tooltip: i18n(
                compare
                    ? "analysis.source.search.all.table.columns.totalShareCompareWithVisits.title.tooltip"
                    : "analysis.source.search.all.table.columns.shareWithVisits.title.tooltip",
            ),
            cellComponent: TrafficShareWithVisits,
            minWidth: 150,
            isResizable: false,
            sortable: true,
        },
        compare
            ? {
                  field: "SiteOrigins",
                  trackingName: "Group Traffic Share Split",
                  displayName: i18n("analysis.source.search.all.table.columns.shareCompare.title"),
                  tooltip: i18n("analysis.source.search.all.table.columns.shareCompare.tooltip"),
                  cellComponent: GroupTrafficShare,
                  minWidth: 150,
                  isResizable: false,
                  sortable: false,
              }
            : {
                  field: "Change",
                  trackingName: "Change",
                  displayName: i18n("analysis.source.search.all.table.columns.change.title"),
                  tooltip: i18nTemplateFilter()(
                      isDaily
                          ? "analysis.source.search.all.table.columns.weekly.change.title.tooltip"
                          : "analysis.source.search.all.table.columns.change.title.tooltip",
                      durationTooltipParams,
                  ),
                  cellComponent: ChangePercentage,
                  headerComponent: DefaultCellHeaderRightAlign,
                  format: "percentagesign",
                  sortable: true,
                  minWidth: 95,
              },
        {
            field: "KwVolume",
            trackingName: "Volume",
            displayName: i18n(`${COLUMNS_I18N_KEY}.volume.title`),
            tooltip: i18n(`${COLUMNS_I18N_KEY}.volume.title.tooltip${COLUMNS_I18N_KEY_SUFFIX}`),
            format: "swPosition",
            headerComponent: DefaultCellHeaderRightAlign,
            cellComponent: DefaultCellRightAlign,
            sortable: canSortVolumeAndCPC,
            sortDirection: "desc",
            minWidth: 96,
        },
        {
            field: "CPC",
            trackingName: "CPC",
            displayName: i18n(`${COLUMNS_I18N_KEY}.cpc.title`),
            tooltip: i18n(`${COLUMNS_I18N_KEY}.cpc.title.tooltip${COLUMNS_I18N_KEY_SUFFIX}`),
            headerComponent: DefaultCellHeaderRightAlign,
            cellComponent: DefaultCellRightAlign,
            format: "CPC",
            sortable: canSortVolumeAndCPC,
            minWidth: 83,
        },
        includeOrganicPaidColumn
            ? {
                  field: "Organic",
                  trackingName: "Organic",
                  displayName: i18n("analysis.source.search.all.table.columns.Org/Paid.title"),
                  tooltip: i18n("analysis.source.search.all.table.columns.vs.title.tooltip"),
                  cellComponent: OrganicPaid,
                  width: 105,
                  minWidth: 105,
                  sortable: true,
              }
            : false,
        {
            field: `Position${OrganicPaidFilter}`,
            trackingName: `Position ${OrganicPaidFilter}`,
            displayName: `${i18n(
                `${COLUMNS_I18N_KEY}.position${OrganicPaidFilter.toLowerCase()}.title`,
            )} (${OrganicPaidFilter})`,
            tooltip: i18n(
                `${COLUMNS_I18N_KEY}.position${OrganicPaidFilter.toLowerCase()}.title.tooltip`,
            ),
            cellComponent: compare ? WaKeywordPositionCompare : WaKeywordPosition,
            headerComponent: DefaultCellHeaderRightAlign,
            format: "avgKeywordPosition",
            sortable: false,
            minWidth: compare ? 90 : 80,
            cellClass:
                compare && positionCompareCellTooltipChild !== ("icon" as tooltipChildType)
                    ? "position-column-cell"
                    : "",
            tooltipChild: positionCompareCellTooltipChild,
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
            isResizable: false,
            sortable: false,
        },
        {
            field: `DestUrl${OrganicPaidFilter}`,
            trackingName: `URL ${OrganicPaidFilter}`,
            displayName: `${i18n(
                `${COLUMNS_I18N_KEY}.destination${OrganicPaidFilter.toLowerCase()}.title`,
            )} (${OrganicPaidFilter})`,
            tooltip: `${COLUMNS_I18N_KEY}.destination${OrganicPaidFilter.toLowerCase()}.title.tooltip`,
            cellComponent: UrlCellWebsiteAnalysis,
            cellClass: "url-cell",
            sortable: false,
            minWidth: 240,
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
            sortDirection: isSorted ? sortDirection : "desc",
            isResizable: col.isResizable !== false,
        };
    });
};
