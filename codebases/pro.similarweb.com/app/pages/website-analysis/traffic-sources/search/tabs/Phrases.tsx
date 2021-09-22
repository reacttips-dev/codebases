import { IBooleanSearchChipItem } from "@similarweb/ui-components/dist/boolean-search/src/BooleanSearch";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import {
    CellKeywordPhrase,
    GroupTrafficShare,
    IndexCell,
    OrganicPaid,
    TrafficShareWithVisits,
} from "components/React/Table/cells";
import { DefaultCellHeader, HeaderCellBlank } from "components/React/Table/headerCells";
import SWReactTableWrapper from "components/React/Table/SWReactTableWrapper";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { numberFilter, i18nFilter } from "filters/ngFilters";
import {
    booleanSearchToObject,
    booleanSearchToString,
    booleanSearchUrlToComponent,
} from "pages/website-analysis/traffic-sources/search/booleanSearchUtility";
import { PhrasesEnrichedCompare } from "pages/website-analysis/traffic-sources/search/tabs/PhrasesEnrichedCompare";
import { PhrasesEnrichedSingle } from "pages/website-analysis/traffic-sources/search/tabs/PhrasesEnrichedSingle";
import { PhrasesTableTop } from "pages/website-analysis/traffic-sources/search/tabs/PhrasesTableTop";
import * as queryString from "query-string";
import * as React from "react";
import { FunctionComponent, useState } from "react";
import { connect } from "react-redux";
import ABService from "services/ABService";
import { KeywordAdvancedFilterService } from "services/AdvancedFilterService/KeywordsAdvancedFilters";
import DurationService from "services/DurationService";
import { allTrackers } from "services/track/track";
import UIComponentStateService from "services/UIComponentStateService";
const LOCALE_STORAGE_KEY = "keyword-phrases-single";
export const Phrases: FunctionComponent<any> = (props) => {
    const i18n = i18nFilter();
    const chosenSites = Injector.get<any>("chosenSites");
    const swNavigator = Injector.get<any>("swNavigator");
    const isCompare = chosenSites.isCompare();
    const firstWordsCountItem = { value: "noFilter", label: i18n("forms.search.anylength") };
    const pageSize = 100;
    const [wordsCountItems, setWordsCountItems] = useState([firstWordsCountItem]);
    const [pageNumber, setPageNumber] = useState(0);
    const changePageCallback = (page) => setPageNumber(page);
    const {
        params: {
            key,
            country,
            isWWW,
            duration,
            webSource,
            BooleanSearchTerms,
            groupedKeywords_orderby,
            groupedKeywords_filters,
            groupedKeywords_page,
            limits,
            IncludeBranded,
            IncludeNoneBranded,
        },
        chosenItems,
    } = props;
    const filtersObject: any = {
        searchTerm: {
            action: "contains",
        },
        wordCount: {
            action: "==",
            type: "number",
        },
    };
    const selectedAdvancedFilter: any = KeywordAdvancedFilterService.getFilterById(limits);
    // Parse filters from URL string to object
    const availableFilters: any = {};
    if (groupedKeywords_filters) {
        groupedKeywords_filters.split("+").forEach((filter) => {
            const values = filter.split(";");
            availableFilters[values[0]] = { ...filtersObject[values[0]], value: values[2] };
        });
    }
    // Convert filters to API params filter string.
    const filter = Object.keys(availableFilters)
        .map((filter) => {
            const { action, value, type } = availableFilters[filter];
            let filterProperty = filter;
            // ¯\_(ツ)_/¯, copying from the SearchCtrl.
            if (filterProperty === "excludeBranded") {
                filterProperty = "searchTerm";
            }
            return [filterProperty, action, type === "number" ? value : `"${value}"`].join(";");
        })
        .join(",");
    // to set the button on the selected branded filter
    let selectedBrandedFilter: string = "";
    if (IncludeBranded === "true") {
        selectedBrandedFilter = "branded";
    } else if (IncludeNoneBranded === "true") {
        selectedBrandedFilter = "notBranded";
    } else {
        selectedBrandedFilter = "";
    }
    const createFiltersForUrl = (filters) =>
        Object.keys(filters)
            .map((filter) => {
                const { action, value } = filters[filter];
                return [filter, action, value].join(";");
            })
            .join("+");

    let field = "Share";
    let sortDirection = "desc";
    if (groupedKeywords_orderby) {
        [field, sortDirection] = groupedKeywords_orderby.split(" ");
    }
    const decodedBooleanSearchTerms = decodeURIComponent(BooleanSearchTerms);
    const { IncludeTerms, ExcludeTerms } = booleanSearchToObject(decodedBooleanSearchTerms);
    const durationObject = DurationService.getDurationData(duration);
    const { isCustom } = durationObject.raw;
    const { from, to, isWindow } = durationObject.forAPI;

    const params = {
        filter,
        country,
        from,
        isWWW: isWWW !== "*",
        isWindow,
        key,
        orderby: `${field} ${sortDirection}`,
        sort: field,
        asc: sortDirection === "asc",
        page: groupedKeywords_page,
        to,
        webSource,
        limits: selectedAdvancedFilter.api,
        ...(IncludeTerms && { IncludeTerms }),
        ...(ExcludeTerms && { ExcludeTerms }),
        IncludeBranded,
        IncludeNoneBranded,
    } as any;
    const durationDiff = DurationService.getDiffSymbol(from, to);
    const showTrafficOverTimeChartNoData = ["28d", "1m"].includes(durationDiff);
    const isMobileWeb = webSource === "MobileWeb";
    const columns = [
        {
            fixed: true,
            cellComponent: ({ row }) => {
                return (
                    <>
                        {!row.parent && (
                            <IconButton iconName="chev-down" type="flat" className="enrich" />
                        )}
                    </>
                );
            },
            sortable: false,
            headerComponent: HeaderCellBlank,
            isResizable: false,
            width: 48,
            columnClass: "collapseControlColumn", // optional
            cellClass: "collapseControlCell", // optional
            disableHeaderCellHover: true,
        },
        {
            fixed: true,
            cellComponent: IndexCell,
            disableHeaderCellHover: true,
            sortable: false,
            width: 46,
            // cellClass: 'kwa-ads-index',
            isResizable: false,
        },
        {
            field: "SearchTerm",
            displayName: i18n("analysis.source.search.grouped.table.columns.searchterms.title"),
            cellComponent: CellKeywordPhrase,
            sortable: true,
            showTotalCount: true,
            minWidth: isCompare ? 295 : 450,
        },
        {
            field: "Share",
            displayName: i18n(
                isCompare
                    ? "analysis.source.search.all.table.columns.totalShareCompare.title"
                    : "analysis.source.search.all.table.columns.share.title",
            ),
            tooltip: i18n(
                isCompare
                    ? "analysis.source.search.all.table.columns.totalShareCompare.title.tooltip"
                    : "analysis.source.search.all.table.columns.share.title.tooltip",
            ),
            cellComponent: TrafficShareWithVisits,
            sortable: true,
            width: isCompare ? 162 : 200,
        },
        ...(isCompare
            ? [
                  {
                      field: "SiteOrigins",
                      displayName: i18n(
                          "analysis.source.search.all.table.columns.shareCompare.title",
                      ),
                      cellComponent: GroupTrafficShare,
                      sortable: false,
                      width: 202,
                  },
              ]
            : []),
        {
            field: "Organic",
            displayName: i18n("analysis.source.search.all.table.columns.Org/Paid.title"),
            tooltip: i18n("phrases.table.columns.vs.title.tooltip"),
            cellComponent: OrganicPaid,
            width: 170,
            lastColumnFixed: true,
        },
    ].map((col: any) => {
        const isSorted = col.field === field;
        return {
            ...col,
            visible: col.visible !== false,
            headerComponent: col.headerComponent || DefaultCellHeader,
            isSorted,
            sortDirection,
            isResizable: col.isResizable !== false,
        };
    });
    const onSort = ({ field, sortDirection }) => {
        swNavigator.applyUpdateParams({
            groupedKeywords_orderby: `${field} ${sortDirection}`,
        });
    };
    const onBrandedFilterChange = (nextBrandedFilter) => {
        swNavigator.applyUpdateParams({
            groupedKeywords_filters: createFiltersForUrl(availableFilters),
            IncludeBranded: nextBrandedFilter.value === "nonBranded",
            IncludeNoneBranded: nextBrandedFilter.value === "branded",
        });
    };
    const onWordsCountFilterChange = (nextWordsFilter) => {
        let filters;
        if (nextWordsFilter === -1) {
            const { wordCount, ...restFilters } = availableFilters;
            filters = restFilters;
        } else {
            const wordCount = { ...filtersObject.wordCount };
            wordCount.value = nextWordsFilter.value;
            filters = { ...availableFilters, wordCount };
        }
        swNavigator.applyUpdateParams({
            groupedKeywords_filters: createFiltersForUrl(filters),
        });
    };
    const onSearchTermFilterChange = (chipsObject: IBooleanSearchChipItem[]) => {
        const BooleanSearchTerms = booleanSearchToString(chipsObject);
        swNavigator.applyUpdateParams({
            BooleanSearchTerms,
        });
    };
    const getDataCallback = (data) => {
        const {
            Header: { WordCount },
        } = data;
        setWordsCountItems([
            firstWordsCountItem,
            ...Object.keys(WordCount).map((numOfWords) => {
                return {
                    value: numOfWords,
                    label: `${numOfWords} words (${numberFilter()(WordCount[numOfWords])})`,
                };
            }),
        ]);
    };
    const onClearAll = () => {
        swNavigator.applyUpdateParams({
            groupedKeywords_filters: null,
            limits: null,
            BooleanSearchTerms: null,
            IncludeBranded: null,
            IncludeNoneBranded: null,
        });
    };
    const downloadExcelPermitted = swSettings.current.resources.IsExcelAllowed;
    const getExcelUrl = () => {
        const queryStringParams = queryString.stringify(params);
        return `/api/keywordphrases/${
            isMobileWeb
                ? "GetTrafficSourcesGroupedKeywordsTsvMobileWeb"
                : "GetTrafficSourcesGroupedKeywordsTsv"
        }?${queryStringParams}`;
    };
    const onSingleCompetitorsClick = () => {
        if (chosenItems.length === 1) {
            allTrackers.trackEvent("drop down", "open", "Keyword analysis advanced filter");
            const $modal = Injector.get<any>("$modal");
            const $scope = Injector.get<any>("$rootScope").$new();
            $scope.customSubmit = (config) => {
                UIComponentStateService.setItem(LOCALE_STORAGE_KEY, "localStorage", "true", false);
                Injector.get<any>("swNavigator").updateParams(config);
            };
            $modal.open({
                templateUrl: "/partials/websites/modal-compare.html",
                controller: "ModalCompareInstanceCtrl",
                controllerAs: "ctrl",
                scope: $scope,
            });
        }
    };
    const onCompareCompetitorsClick = (item) => {
        let filters;
        if (item && item.id === "opportunities") {
            filters = { ...availableFilters };
        }
        if (UIComponentStateService.getItem(LOCALE_STORAGE_KEY, "localStorage", false) === "true") {
            UIComponentStateService.setItem(LOCALE_STORAGE_KEY, "localStorage", null, false);
        }
        swNavigator.applyUpdateParams({
            limits: item.id,
            ...(filters && {
                groupedKeywords_filters: createFiltersForUrl(filters),
                IncludeBranded: false,
                IncludeNoneBranded: true,
            }),
        });
    };
    const onCloseCompetitiveFilter = () => {
        swNavigator.applyUpdateParams({
            limits: null,
        });
    };
    const transformData = (data) => {
        return {
            ...data,
            Data: data.Data.map((row) => {
                return {
                    ...row,
                    SharePerMonth: row.SharePerMonth ? row.SharePerMonth : [],
                    SiteOriginsPerMonth: row.SiteOriginsPerMonth ? row.SiteOriginsPerMonth : [],
                    TotalVisits: row.Visits,
                };
            }),
        };
    };
    return (
        <SWReactTableWrapper
            transformData={transformData}
            changePageCallback={changePageCallback}
            tableOptions={{
                metric: "TrafficSourcesGroupedKeywordsTable",
                get EnrichedRowComponent() {
                    return (props) =>
                        isCompare ? (
                            <PhrasesEnrichedCompare
                                {...props}
                                selectedSites={key}
                                pageSize={pageSize}
                                pageNumber={pageNumber}
                                showTrafficOverTimeChartNoData={showTrafficOverTimeChartNoData}
                            />
                        ) : (
                            <PhrasesEnrichedSingle
                                {...props}
                                pageSize={pageSize}
                                pageNumber={pageNumber}
                                showTrafficOverTimeChartNoData={showTrafficOverTimeChartNoData}
                            />
                        );
                },
                get enrichedRowComponentAppendTo() {
                    return ".keyword-phrases-table";
                },
                get enrichedRowComponentHeight() {
                    return 580;
                },
                shouldApplyEnrichedRowHeightToCell: false,
                shouldEnrichRow: (props, index, e) => {
                    const openEnrich = e?.currentTarget?.childNodes?.[0]?.className.includes(
                        "enrich",
                    );
                    if (openEnrich) {
                        allTrackers.trackEvent("Open", "Click", "Phrases Over Time/Expand");
                    }

                    return props.tableData[index].SearchTerm !== "grid.upgrade" && openEnrich;
                },
                get enrichOnLoadRowNumber() {
                    let isMinThreeMonths;
                    // 'isCustom' ie. not a preset duration.
                    if (!isCustom) {
                        isMinThreeMonths = duration !== "28d" && duration !== "1m";
                    } else {
                        isMinThreeMonths = DurationService.diffByUnit(from, to, "months") + 1 >= 3;
                    }
                    if (isMinThreeMonths) {
                        return 1;
                    }
                    return null;
                },

                onEnrichedRowClick: (isOpen, rowIndex, row) => {
                    // console.log('onEnrichedRowClick');
                },
                customTableClass: "keyword-phrases-table",
            }}
            serverApi={`/api/keywordphrases/${
                isMobileWeb
                    ? "GetTrafficSourcesGroupedKeywordsTableMobileWeb"
                    : "GetTrafficSourcesGroupedKeywordsTable"
            }`}
            tableColumns={columns}
            initialFilters={params}
            recordsField="Data"
            totalRecordsField="TotalCount"
            onSort={onSort}
            getDataCallback={getDataCallback}
            pageIndent={1}
        >
            {(topComponentProps) => (
                <PhrasesTableTop
                    {...topComponentProps}
                    onBrandedFilterChange={onBrandedFilterChange}
                    selectedBrandedFilter={selectedBrandedFilter}
                    wordsCountItems={wordsCountItems}
                    selectedWordsCountFilter={
                        availableFilters.wordCount && availableFilters.wordCount.value
                    }
                    onWordsCountFilterChange={onWordsCountFilterChange}
                    onClearAll={onClearAll}
                    searchValue={
                        BooleanSearchTerms && booleanSearchUrlToComponent(decodedBooleanSearchTerms)
                    }
                    onChange={onSearchTermFilterChange}
                    downloadExcelPermitted={downloadExcelPermitted}
                    excelLink={getExcelUrl()}
                    isCompare={isCompare}
                    chosenItems={chosenItems}
                    onSingleCompetitorsClick={onSingleCompetitorsClick}
                    onCompareCompetitorsClick={onCompareCompetitorsClick}
                    selectedCompetitiveFilter={selectedAdvancedFilter}
                    onCloseCompetitiveFilter={onCloseCompetitiveFilter}
                    openCompetitiveFilter={
                        UIComponentStateService.getItem(
                            LOCALE_STORAGE_KEY,
                            "localStorage",
                            false,
                        ) === "true"
                    }
                />
            )}
        </SWReactTableWrapper>
    );
};
const mapStateToProps = ({ routing: { params, chosenItems } }) => {
    return {
        params,
        chosenItems,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {};
};

const connected = connect(mapStateToProps, mapDispatchToProps)(Phrases);

export default SWReactRootComponent(connected, "Phrases");
