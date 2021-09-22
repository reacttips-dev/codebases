import { universalSearchOnFocus } from "actions/universalSearchActions";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { CoreWebsiteCell } from "components/core cells/src/CoreWebsiteCell/CoreWebsiteCell";
import {
    AdUnit,
    IndexCell,
    KeywordAnalysisPosition,
    KeywordsList,
    ReferringCategoryCell,
    SimpleLinkCell,
} from "components/React/Table/cells";
import { DefaultCellHeader } from "components/React/Table/headerCells";
import SWReactTableWrapper from "components/React/Table/SWReactTableWrapper";
import { WebsiteTooltip } from "components/React/Tooltip/WebsiteTooltip/WebsiteTooltip";
import ComponentsProvider from "components/WithComponent/src/ComponentsProvider";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { adsTargetURL, i18nFilter } from "filters/ngFilters";
import PlaAndAdsResearchTableTop from "../../../pages/keyword-analysis/PlaAndAdsResearchTableTop";
import * as queryString from "query-string";
import React from "react";
import { connect } from "react-redux";
import DurationService from "services/DurationService";
import { allTrackers } from "services/track/track";

const PlaResearchTable = (props) => {
    const i18n = i18nFilter();
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const {
        params: {
            isWWW,
            key,
            keyword,
            selectedDomain,
            country,
            duration,
            webSource,
            type = "all",
            selectedCategory = "",
            search: searchParams = "",
            orderBy = "",
        },
        serverApi,
        showCategorySelector,
        showDomainSelector,
        tableColumns,
        excelApi,
        getCurrentTerm,
        useDefaultSorting = true,
        innerLinkPageDest,
    } = props;
    let { field = "Position", sortDirection = "asc" } = props;
    const search = decodeURIComponent(searchParams);
    const filterParam = `Title;contains;"${search}"`;
    // in order to merge both keyword ads and website ads i used the word 'term' instead of 'keyword' or 'website'
    const currentTerm = getCurrentTerm(keyword, selectedDomain, key);
    if (!currentTerm) {
        return null;
    }
    const { from, to, isWindow } = DurationService.getDurationData(duration).forAPI;
    const params = {
        country,
        webSource,
        from,
        to,
        includeSubDomains: isWWW === "*",
        isWindow,
        timeGranularity: "Monthly",
        keys: currentTerm,
        atype: type,
        pageSize: 20,
        filter: filterParam,
    } as any;
    if (selectedCategory) {
        params.category = selectedCategory;
    }
    const TrackAdLangPageClick = (adType) => (tableOptions, category, value, action) => {
        switch (category) {
            case "External Link": // todo
                return allTrackers.trackEvent(tableOptions, category, `${adType}/${value}`, action);
            case "upgrade": // todo
                return allTrackers.trackEvent(tableOptions, category, `${adType}/${value}`, action);
        }
    };
    if (orderBy !== "") {
        [field, sortDirection] = orderBy.split(" ");
    }
    params.sort = field;
    params.asc = sortDirection === "asc";
    if (useDefaultSorting) {
        params.orderBy = `${field} ${sortDirection}`;
    } else {
        params.orderBy = field + " " + (params.asc ? "asc" : "desc");
    }
    const genericColumns = [
        {
            fixed: true,
            cellComponent: IndexCell,
            disableHeaderCellHover: true,
            sortable: false,
            width: 46,
            cellClass: "kwa-ads-index",
            isResizable: false,
        },
        {
            field: "AdDetails",
            displayName: i18n("keyword.analysis.ads.table.columns.addetails.title"),
            tooltip: `keyword.analysis.ads.table.columns.addetails.title.tooltip`,
            cellComponent: AdUnit,
            width: 430,
            showTotalCount: true,
            cellClass: "kwa-ads-ads",
            sortable: false,
            isResizable: false,
        },
        {
            field: "Domain",
            displayName: i18n("keyword.analysis.ads.table.columns.domain.title"),
            tooltip: "keyword.analysis.ads.table.columns.domain.title.tooltip",
            cellComponent: ({ value, row }) => {
                const props = {
                    domain: value,
                    icon: row.Favicon,
                    internalLink: swNavigator.href("websites-trafficSearch-ads", {
                        key: value,
                        country,
                        duration,
                        webSource,
                        isWWW,
                    }),
                    trackInternalLink: (e) => {
                        e.stopPropagation();
                        allTrackers.trackEvent("Internal Link", "click", `Table/${value}`);
                    },
                    externalLink: `http://${value}`,
                    trackExternalLink: (e) => {
                        e.stopPropagation();
                        allTrackers.trackEvent("External Link", "click", `Table/${value}`);
                    },
                    hideTrackButton: true,
                };
                return (
                    <ComponentsProvider components={{ WebsiteTooltip }}>
                        <CoreWebsiteCell {...props} />
                    </ComponentsProvider>
                );
            },
            minWidth: 152,
            sortable: false,
        },
        {
            field: "Page",
            displayName: i18n("keyword.analysis.ads.table.columns.page.title"),
            tooltip: "keyword.analysis.ads.table.columns.page.title.tooltip",
            cellClass: "kwa-ads-landing",
            minWidth: 330,
            sortable: false,
            cellComponent: (props) => {
                const { AdDetails } = props.row;
                const { Type, Title } = AdDetails;
                const value = Title === "grid.upgrade" ? undefined : adsTargetURL()(AdDetails);
                if (!value) {
                    return <span>{"-"}</span>;
                } else {
                    return (
                        <SimpleLinkCell
                            {...{ ...props, value, track: TrackAdLangPageClick(Type) }}
                        />
                    );
                }
            },
        },
        {
            field: "Keywords",
            displayName: i18n("keyword.analysis.ads.table.columns.keywords.title"),
            tooltip: `keyword.analysis.ads.table.columns.keywords.title.tooltip`,
            cellComponent: (props) => {
                const getLink = (value) => {
                    return swNavigator.href(innerLinkPageDest ?? swNavigator.current().name, {
                        ...params,
                        keyword: value,
                        duration: "3m",
                    });
                };
                return <KeywordsList {...props} getLink={getLink} showTotalCount={true} />;
            },
            cellClass: "kwa-ads-keywords",
            sortable: false,
            width: 200,
        },
        {
            field: "Position",
            displayName: i18n("keyword.analysis.ads.table.columns.position.title"),
            tooltip: "keyword.analysis.ads.table.columns.position.title.tooltip",
            minWidth: 100,
            sortable: true,
            cellClass: "kwa-ads-position",
            cellComponent: KeywordAnalysisPosition,
        },
        {
            field: "Category",
            displayName: i18n("keyword.analysis.ads.table.columns.category.title"),
            tooltip: "keyword.analysis.ads.table.columns.category.title.tooltip",
            cellComponent: (props) => {
                const { value } = props;
                const getLink = (value) => {
                    return swNavigator.href(swNavigator.current().name, {
                        ...params,
                        selectedCategory: value.replace("/", "~"),
                    });
                };
                return (
                    <ReferringCategoryCell
                        {...props}
                        value={value === "Unknown" ? "-" : value}
                        getLink={getLink}
                    />
                );
            },
            minWidth: 120,
            sortable: false,
            visible: false,
        },
    ].map((col: any) => {
        const isSorted = col.field === field;
        return {
            ...col,
            visible: col.visible !== false,
            headerComponent: col.headerComponent || DefaultCellHeader,
            isSorted,
            sortDirection,
            isResizable: col.isResizable === false ? false : true,
        };
    });
    // sets the relevant columns for each context
    const columns = genericColumns.filter(
        (column) => tableColumns.includes(column.field) || !column.field,
    );
    const transformData = (data) => {
        return {
            ...data,
            Data: data.Data.map((item) => {
                const {
                    Keywords,
                    Position,
                    NumberOfKeywords,
                    Category,
                    Domain,
                    Favicon,
                    ...AdDetails
                } = item;
                return {
                    AdDetails,
                    Favicon,
                    country,
                    Category,
                    Domain,
                    Keywords,
                    NumberOfKeywords,
                    Position: typeof Position === "number" ? Math.round(Position) : Position,
                    DestUrl: item.DestUrl,
                };
            }),
        };
    };
    const getExcel = () => {
        const queryStringParams = queryString.stringify(params);
        return excelApi + queryStringParams;
    };

    const onCategorySelected = (categories) => {
        const value = categories.length > 0 ? categories.map((cat) => cat.id).join(",") : null;
        allTrackers.trackEvent("Drop Down", "click", `Table/Category/${value}`);
        swNavigator.applyUpdateParams({
            selectedCategory: value,
        });
    };
    const onSearch = (search) => {
        swNavigator.applyUpdateParams({
            search: search || null,
        });
    };

    const onSort = ({ field, sortDirection }) => {
        swNavigator.applyUpdateParams({
            orderBy: `${field} ${sortDirection}`,
        });
    };
    const onSelectDomain = (props) => {
        swNavigator.applyUpdateParams({
            selectedDomain: props.text || null,
        });
    };
    return (
        <div className={`swReactTable-ads-${props.type}`}>
            {
                <>
                    <SWReactTableWrapper
                        tableOptions={{
                            metric: "KeywordAnalysisAdsTable",
                        }}
                        serverApi={serverApi}
                        tableColumns={columns}
                        initialFilters={params}
                        recordsField="Data"
                        totalRecordsField="TotalCount"
                        transformData={transformData}
                        pageIndent={1}
                        onSort={onSort}
                        rowsPerPage={20}
                    >
                        {(topComponentProps) => (
                            <PlaAndAdsResearchTableTop
                                {...topComponentProps}
                                excelLink={getExcel()}
                                downloadExcelPermitted={excelApi ? true : false}
                                selectedType={type}
                                selectedCategory={selectedCategory}
                                onCategorySelected={onCategorySelected}
                                onSearch={onSearch}
                                searchValue={search}
                                showCategorySelector={showCategorySelector}
                                showDomainSelector={showDomainSelector}
                                onSelectDomain={onSelectDomain}
                                selectedDomain={currentTerm}
                            />
                        )}
                    </SWReactTableWrapper>
                </>
            }
        </div>
    );
};
const mapStateToProps = ({ routing: { params } }, ownProps) => {
    return {
        params: {
            ...params,
            type: ownProps.type,
            contextParams: ownProps.contextParams,
        },
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        universalSearchOnFocus: (searchText) => {
            dispatch(universalSearchOnFocus(searchText));
        },
    };
};

const Connected = connect(mapStateToProps, mapDispatchToProps)(PlaResearchTable);

const PlaResearchTableWebsiteContext = ({ type }) => {
    const contextParams = {
        serverApi: "/widgetApi/Search/ScrapedAds/Table",
        excelApi: "/widgetApi/Search/ScrapedAds/Excel?",
        showCategorySelector: false,
        showDomainSelector: true,
        useDefaultSorting: false,
        field: "NumberOfKeywords",
        sortDirection: "desc",
        tableColumns: ["AdDetails", "Page", "Keywords", "Position"],
        innerLinkPageDest: "keywordAnalysis_overview",
        getCurrentTerm: (keyword, selectedDomain, key) => {
            const domains = key.split(",");
            if (domains.includes(selectedDomain)) {
                return selectedDomain;
            }
            return domains[0];
        },
    };
    return <Connected type={type} {...contextParams} />;
};

const PlaResearchTableKeywordsContext = ({ type, emptyStateTitle, emptyStateSubTitle }) => {
    const contextParams = {
        serverApi: "/widgetApi/KeywordAnalysisDisplayAds/ScrapedAdsByKeywords/Table",
        showCategorySelector: true,
        showDomainSelector: false,
        tableColumns: ["AdDetails", "Domain", "Page", "Keywords", "Position", "Category"],
        getCurrentTerm: (keyword, selectedDomain, key) => {
            return keyword.startsWith("*") ? keyword.substring(1) : keyword;
        },
    };
    return (
        <Connected
            type={type}
            emptyStateTitle={emptyStateTitle}
            emptyStateSubTitle={emptyStateSubTitle}
            {...contextParams}
        />
    );
};

SWReactRootComponent(PlaResearchTableWebsiteContext, "PlaResearchTableWebsiteContext");
SWReactRootComponent(PlaResearchTableKeywordsContext, "PlaResearchTableKeywordsContext");
