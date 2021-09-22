/* eslint-disable react/display-name */
import classNames from "classnames";
import { DefaultCellHeaderRightAlign } from "components/React/Table/headerCells";
import {
    DefaultCellRightAlign,
    IndexCell,
    NumberCommaCell,
    SearchKeywordCell,
    TrafficShare,
    TrendCell,
    UrlCellWebsiteAnalysis,
} from "components/React/Table/cells";
import { i18nFilter } from "filters/ngFilters";
import { Injector } from "common/ioc/Injector";
import { RowSelectionConsumer } from "components/React/Table/cells/RowSelection";
import { SelectAllRowsHeaderCellConsumer } from "components/React/Table/headerCells/SelectAllRowsHeaderCell";
import { ITableCellProps } from "components/React/Table/interfaces/ITableCellProps";
import { EndCellContainer, StyledEnrichButton, StyledEnrichButtonText } from "./StyledComponents";
import { SwNavigator } from "common/services/swNavigator";

export const DEFAULT_SORT = "PageShare";
export const DEFAULT_INNER_SORT = "PageTraffic";
export const DEFAULT_SORT_DIRECTION = "desc";

export const tableColumns = {
    getColumns: (pageParams, enrichmentSupport = true) => {
        const swNavigator = Injector.get<SwNavigator>("swNavigator");
        return [
            {
                fixed: true,
                cellComponent: IndexCell,
                disableHeaderCellHover: true,
                sortable: false,
                width: 46,
                isResizable: false,
                hideInDashboard: true,
            },
            {
                field: "Page",
                displayName: i18nFilter()("organic.landing.pages.table.columns.pageUrl.title"),
                tooltip: i18nFilter()("organic.landing.pages.table.columns.pageUrl.title.tooltip"),
                cellComponent: UrlCellWebsiteAnalysis,
                cellClass: "url-cell",
                minWidth: 200,
                maxWidth: 340,
                sortable: false,
                showTotalCount: true,
            },
            {
                field: "PageShare",
                displayName: i18nFilter()("organic.landing.pages.table.columns.share.title"),
                tooltip: i18nFilter()("organic.landing.pages.table.columns.share.title.tooltip"),
                cellComponent: TrafficShare,
                width: 130,
                sortable: true,
            },
            {
                field: "PageTrend",
                displayName: i18nFilter()("organic.landing.pages.table.columns.trend.title"),
                tooltip: i18nFilter()("organic.landing.pages.table.columns.trend.title.tooltip"),
                cellComponent: TrendCell,
                isResizable: false,
                width: 120,
                sortable: false,
                cellClass: "page-trend-cell",
            },
            {
                field: "SearchTermCount",
                displayName: i18nFilter()("organic.landing.pages.table.columns.keywordsNum.title"),
                tooltip: i18nFilter()(
                    "organic.landing.pages.table.columns.keywordsNum.title.tooltip",
                ),
                cellComponent: NumberCommaCell,
                headerComponent: DefaultCellHeaderRightAlign,
                width: 110,
                sortable: true,
            },
            {
                field: "TopSearchTerm",
                displayName: i18nFilter()("organic.landing.pages.table.columns.topKeyword.title"),
                tooltip: i18nFilter()(
                    "organic.landing.pages.table.columns.topKeyword.title.tooltip",
                ),
                cellComponent: ({ onCellClick, value, ...props }) => {
                    const onClick = (e: Event) => {
                        e.stopPropagation();
                        onCellClick(e, props.row?.index);
                    };
                    const isDisabled = value === "grid.upgrade";
                    const keyword = isDisabled
                        ? i18nFilter()("organic.landing.pages.table.columns.topKeyword.title")
                        : value;
                    return (
                        <EndCellContainer>
                            <SearchKeywordCell
                                {...(props as Omit<ITableCellProps, "value">)}
                                adsUrl={swNavigator.href("keywordAnalysis-ads", {
                                    webSource: pageParams.webSource,
                                    country: pageParams.country,
                                    duration: pageParams.duration,
                                    keyword,
                                })}
                                disabled={isDisabled}
                                value={keyword}
                            />
                            {!props.row.parent && enrichmentSupport && (
                                <StyledEnrichButton
                                    height={24}
                                    onClick={isDisabled ? undefined : onClick}
                                    className={classNames(
                                        "enrich",
                                        isDisabled && "enrich--disabled",
                                    )}
                                    iconName={isDisabled ? "locked" : "chev-down"}
                                    isDisabled={isDisabled}
                                >
                                    <StyledEnrichButtonText isDisabled={isDisabled}>
                                        {i18nFilter()(
                                            "organic.landing.pages.table.enrich.button.title",
                                        )}
                                    </StyledEnrichButtonText>
                                </StyledEnrichButton>
                            )}
                        </EndCellContainer>
                    );
                },
                minWidth: enrichmentSupport ? 170 : 100,
                sortable: false,
            },
        ].map((col) => {
            const isSorted = col.field === DEFAULT_SORT;
            return {
                ...col,
                isSorted,
                sortDirection: DEFAULT_SORT_DIRECTION,
                isResizable: col.isResizable !== false,
                visible: true,
            };
        });
    },
};

export const innerTableColumns = {
    getColumns: (pageParams) => {
        const swNavigator = Injector.get<SwNavigator>("swNavigator");
        return [
            {
                fixed: true,
                cellComponent: RowSelectionConsumer,
                sortable: false,
                headerComponent: SelectAllRowsHeaderCellConsumer,
                isResizable: false,
                width: 40,
                visible: true,
            },
            {
                fixed: true,
                cellComponent: IndexCell,
                disableHeaderCellHover: true,
                sortable: false,
                width: 40,
                isResizable: false,
            },
            {
                field: "SearchTerm",
                displayName: i18nFilter()(
                    "organic.landing.pages.enriched.table.columns.keyword.title",
                ),
                tooltip: i18nFilter()(
                    "organic.landing.pages.enriched.table.columns.keyword.title.tooltip",
                ),
                cellComponent: (props) => (
                    <SearchKeywordCell
                        {...props}
                        adsUrl={swNavigator.href("keywordAnalysis-ads", {
                            webSource: pageParams.webSource,
                            country: pageParams.country,
                            duration: pageParams.duration,
                            keyword: props.value,
                        })}
                    />
                ),
                sortable: false,
                showTotalCount: true,
            },
            {
                field: "PageTraffic",
                displayName: i18nFilter()(
                    "organic.landing.pages.enriched.table.columns.landingPageTraffic.title",
                ),
                tooltip: i18nFilter()(
                    "organic.landing.pages.enriched.table.columns.landingPageTraffic.title.tooltip",
                ),
                cellComponent: TrafficShare,
                sortable: true,
            },
            {
                field: "Volume",
                displayName: i18nFilter()(
                    "organic.landing.pages.enriched.table.columns.volume.title",
                ),
                tooltip: i18nFilter()(
                    "organic.landing.pages.enriched.table.columns.volume.title.tooltip",
                ),
                headerComponent: DefaultCellHeaderRightAlign,
                cellComponent: DefaultCellRightAlign,
                format: "swPosition",
                sortable: false,
            },
            {
                field: "Cpc",
                displayName: i18nFilter()("organic.landing.pages.enriched.table.columns.cpc.title"),
                tooltip: i18nFilter()(
                    "organic.landing.pages.enriched.table.columns.cpc.title.tooltip",
                ),
                headerComponent: DefaultCellHeaderRightAlign,
                cellComponent: DefaultCellRightAlign,
                format: "CPC",
                sortable: false,
            },
        ].map((col) => {
            const isSorted = col.field === DEFAULT_INNER_SORT;
            return {
                ...col,
                isSorted,
                sortDirection: DEFAULT_SORT_DIRECTION,
                isResizable: col.isResizable !== false,
                visible: true,
            };
        });
    },
};
