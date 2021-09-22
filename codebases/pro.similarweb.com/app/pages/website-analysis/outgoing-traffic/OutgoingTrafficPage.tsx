import { IconButton } from "@similarweb/ui-components/dist/button";
import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import {
    AdsenseCell,
    CategoryFilterCell,
    ChangePercentage,
    IndexCell,
    RankCell,
    TrafficShare,
    WebsiteTooltipTopCell,
} from "components/React/Table/cells";
import {
    DefaultCellHeader,
    DefaultCellHeaderRightAlign,
    HeaderCellBlank,
} from "components/React/Table/headerCells";
import SWReactTableWrapper from "components/React/Table/SWReactTableWrapper";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nCategoryFilter, i18nFilter, subCategoryFilter } from "filters/ngFilters";
import * as _ from "lodash";
import { OutgoingTrafficEnriched } from "pages/website-analysis/outgoing-traffic/OutgoingTrafficEnriched";
import { OutgoingTrafficPageTableTop } from "pages/website-analysis/outgoing-traffic/OutgoingTrafficPageTableTop";
import * as queryString from "query-string";
import { FunctionComponent, useEffect, useState } from "react";
import * as React from "react";
import { connect } from "react-redux";
import DurationService from "services/DurationService";
import { allTrackers } from "services/track/track";

declare const similarweb;

export const OutgoingTrafficPage: FunctionComponent<any> = (props) => {
    const i18n = i18nFilter();
    const subCategory = subCategoryFilter();
    const chosenSites = Injector.get<any>("chosenSites");
    const swNavigator = Injector.get<any>("swNavigator");
    const $modal = Injector.get<any>("$modal");
    const $rootScope = Injector.get<any>("$rootScope");
    const widgetModelAdapterService = Injector.get<any>("widgetModelAdapterService");
    const pageSize = 100;
    const isCompare = chosenSites.isCompare();
    let addToDashboardModal = { dismiss: () => null };
    const selectedSites = chosenSites.map((item, infoItem) => {
        return { value: item, label: infoItem.displayName, icon: infoItem.icon };
    });
    useEffect(() => {
        return () => {
            addToDashboardModal.dismiss();
        };
    }, [addToDashboardModal]);
    const [tableTopData, setTableTopData] = useState<any>({});
    const [pageNumber, setPageNumber] = useState(0);
    const changePageCallback = (page) => setPageNumber(page);
    const {
        params: {
            key,
            country,
            isWWW,
            duration,
            webSource,
            outagoing_orderby, // Yes, I know there is a typo here. Legacy links.
            outagoing_filters,
            outagoing_page,
            selectedSite: selectedSiteProps,
        },
    } = props;
    const selectedSiteExists = selectedSiteProps
        ? selectedSites.find((s) => s.value === selectedSiteProps)
        : null;
    const selectedSite = selectedSiteExists ? selectedSiteExists.value : selectedSites[0].value;
    const filtersObject: any = {
        domain: {
            action: "contains",
        },
        category: {
            action: "category",
        },
    };
    const availableFilters: any = {};
    if (outagoing_filters) {
        outagoing_filters.split("+").forEach((filter) => {
            const values = filter.split(";");
            availableFilters[values[0]] = { ...filtersObject[values[0]], value: values[2] };
        });
    }
    // Convert filters to API params filter string.
    const filter = Object.keys(availableFilters)
        .map((filter) => {
            const { action, value } = availableFilters[filter];
            return [filter, action, `"${value}"`].join(";");
        })
        .join(",");
    const createFiltersForUrl = (filters) =>
        Object.keys(filters)
            .map((filter) => {
                const { action, value } = filters[filter];
                return [filter, action, value].join(";");
            })
            .join("+");
    let field = "Share";
    let sortDirection = "desc";
    if (outagoing_orderby) {
        [field, sortDirection] = outagoing_orderby.split(" ");
    }
    const durationObject = DurationService.getDurationData(duration, null, null, null);
    const { from, to, isWindow, isCustom } = DurationService.getDurationData(duration).forAPI;
    const params = {
        filter,
        country,
        from,
        isWWW: isWWW !== "*",
        isWindow,
        key: isCompare ? selectedSite : key,
        orderby: `${field} ${sortDirection}`,
        sort: field,
        asc: sortDirection === "asc",
        page: outagoing_page,
        to,
    } as any;
    const durationTooltip = _.mapValues(
        DurationService.getDurationData(duration || "", "", "").forTooltip,
        (v) => {
            return decodeURIComponent(v);
        },
    );
    const durationTooltipParams = {
        currentMonth: durationTooltip.to,
        lastMonth: durationTooltip.from,
    };
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
            width: 40,
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
            isResizable: false,
        },
        {
            minWidth: 204,
            isResizable: true,
            sortable: true,
            field: "Domain",
            showTotalCount: true,
            displayName: i18n("analysis.dest.out.table.columns.domain.title"),
            tooltip: i18n("analysis.dest.out.table.columns.domain.title.tooltip"),
            cellComponent: WebsiteTooltipTopCell,
        },
        {
            minWidth: 226,
            isResizable: true,
            sortable: true,
            field: "Category",
            displayName: i18n("analysis.dest.out.table.columns.category.title"),
            tooltip: i18n("analysis.dest.out.table.columns.category.title.tooltip"),
            cellComponent: (row) => {
                const onItemClick = () => onSelectCategory(row.value);
                return <CategoryFilterCell {...row} onItemClick={onItemClick} />;
            },
        },
        {
            minWidth: 96,
            isResizable: true,
            sortable: true,
            field: "Rank",
            displayName: i18n("analysis.dest.out.table.columns.rank.title"),
            tooltip: i18n("analysis.dest.out.table.columns.rank.title.tooltip"),
            cellComponent: RankCell,
            headerComponent: DefaultCellHeaderRightAlign,
            format: "rank",
        },
        {
            minWidth: 112,
            sortable: true,
            isResizable: true,
            field: "Share",
            displayName: i18n("analysis.dest.out.table.columns.share.title"),
            tooltip: i18n("analysis.dest.out.table.columns.share.title.tooltip"),
            cellComponent: TrafficShare,
        },
        {
            minWidth: 104,
            isResizable: true,
            sortable: true,
            field: "Change",
            displayName: i18n("analysis.dest.out.table.columns.change.title"),
            tooltip: i18n(
                "analysis.dest.out.table.columns.change.title.tooltip",
                durationTooltipParams,
            ),
            cellComponent: ChangePercentage,
            headerComponent: DefaultCellHeaderRightAlign,
        },
        {
            width: 72,
            sortable: true,
            field: "HasAdsense",
            displayName: i18n("analysis.all.table.columns.googleAds.title"),
            tooltip: i18n("analysis.all.table.columns.googleAds.title.tooltip"),
            cellComponent: AdsenseCell,
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
            outagoing_orderby: `${field} ${sortDirection}`,
        });
    };
    const getSelectedSite = () => {
        const sites = chosenSites.sitelistForLegend();
        const { selectedSite } = swNavigator.getParams();
        const selectedSiteItem = sites.find((site) => site.name === selectedSite);
        if (selectedSite && selectedSiteItem) {
            return selectedSiteItem;
        } else {
            return sites[0];
        }
    };
    const getCategoryLink = (newCategory) => {
        let filters;
        const category = { ...filtersObject.category };
        category.value = newCategory;
        filters = { ...availableFilters, category };
        return decodeURIComponent(
            swNavigator.href(swNavigator.current().name, {
                outagoing_filters: createFiltersForUrl(filters),
            }),
        );
    };
    const getDataCallback = (data) => {
        const {
            TotalVisits,
            TotalUnGroupedCount,
            TotalShare,
            AllCategories,
            Categories,
            Topics,
        } = data;
        const domainName = getSelectedSite().name;
        setTableTopData({
            AllCategories,
            TotalVisits,
            TotalUnGroupedCount,
            Topics,
            TotalShare: TotalShare > 0.99 ? 1 : TotalShare || 0,
            categoriesData: similarweb.utils
                .formatTopList(Categories[domainName], 6, {
                    transformFunction: similarweb.utils.addCategoryIdFromName,
                })
                .map((cat) => {
                    return {
                        category: i18nCategoryFilter()(cat.Name),
                        categoryApi: cat.Id,
                        ...Object.entries(Categories[domainName]).reduce(
                            (acc, [domain, domainCategories]) => {
                                return {
                                    ...acc,
                                    [domainName]: cat.Value,
                                };
                            },
                            {},
                        ),
                    };
                }),
            domainMetaData: [
                {
                    icon: chosenSites.listInfo[domainName].icon,
                    name: domainName,
                    color: chosenSites.getSiteColor(domainName),
                },
            ],
        });
    };
    const downloadExcelPermitted = swSettings.current.resources.IsExcelAllowed;
    const getExcelUrl = () => {
        const queryStringParams = queryString.stringify(params);
        return `/export/analysis/GetOutgoingTsv?${queryStringParams}`;
    };
    const a2d = () => {
        addToDashboardModal = $modal.open({
            animation: true,
            controller: "widgetAddToDashboardController as ctrl",
            templateUrl: "/app/components/widget/widget-add-to-dashboard-modal.html",
            windowClass: "add-to-dashboard-modal",
            resolve: {
                widget: () => null,
                customModel: () =>
                    getCustomModel(
                        "OutgoingReferrals",
                        "OutgoingReferralsDashboardTable",
                        webSource,
                        "Website",
                        null,
                        filter,
                    ),
            },
            scope: $rootScope.$new(true),
        });
    };
    const getCustomModel = (metric, type, webSource, family, selectedSite?, filters?) => {
        return widgetModelAdapterService.fromWebsite(
            metric,
            type,
            webSource,
            selectedSite,
            filters,
        );
    };
    const onSearchTermFilterChange = (value) => {
        let filters;
        if (value === "") {
            const { domain, ...restFilters } = availableFilters;
            filters = restFilters;
        } else {
            const domain = { ...filtersObject.domain };
            domain.value = value;
            filters = { ...availableFilters, domain };
        }
        swNavigator.applyUpdateParams({
            outagoing_filters: createFiltersForUrl(filters),
        });
    };
    const onSelectCategory = (value) => {
        let filters;
        if (!value) {
            const { category, ...restFilters } = availableFilters;
            filters = restFilters;
        } else {
            const category = { ...filtersObject.category };
            category.value = value;
            filters = { ...availableFilters, category };
        }
        swNavigator.applyUpdateParams({
            outagoing_filters: createFiltersForUrl(filters),
        });
    };
    const onClearAll = () => {
        swNavigator.applyUpdateParams({
            outagoing_filters: null,
        });
    };
    const onSelectSite = (selectedSite) => {
        swNavigator.go(
            swNavigator.current().name,
            Object.assign(swNavigator.getParams(), { selectedSite: selectedSite.text }),
        );
    };
    const onClearSite = () => {
        swNavigator.go(
            swNavigator.current().name,
            Object.assign(swNavigator.getParams(), { selectedSite: null }),
        );
    };
    const transformData = (data) => {
        return {
            ...data,
            Records: data.Records.map((record) => {
                return {
                    ...record,
                    TotalSharePerMonth: record.TotalSharePerMonth ? record.TotalSharePerMonth : [],
                    url: swNavigator.href("websites-worldwideOverview", {
                        ...swNavigator.getParams(),
                        key: record.Domain,
                    }),
                };
            }),
        };
    };
    return (
        <SWReactTableWrapper
            changePageCallback={changePageCallback}
            tableOptions={{
                showCompanySidebar: true,
                metric: "OutgoingTrafficTable",
                get EnrichedRowComponent() {
                    return (props) => (
                        <OutgoingTrafficEnriched
                            {...props}
                            pageSize={pageSize}
                            pageNumber={pageNumber}
                        />
                    );
                },
                get enrichedRowComponentAppendTo() {
                    return ".outgoing-traffic-table";
                },
                get enrichedRowComponentHeight() {
                    return 580;
                },
                get enrichOnLoadRowNumber() {
                    let isMinThreeMonths;
                    // 'isCustom' ie. not a preset duration.
                    if (!isCustom) {
                        isMinThreeMonths = duration !== "28d" && duration !== "1m";
                    } else {
                        isMinThreeMonths =
                            DurationService.diffByUnit(
                                durationObject.forAPI.from,
                                durationObject.forAPI.to,
                                "months",
                            ) +
                                1 >=
                            3;
                    }

                    if (isMinThreeMonths) {
                        return 1;
                    }
                    return null;
                },
                shouldApplyEnrichedRowHeightToCell: false,
                shouldEnrichRow: (props, index, e) => {
                    const openEnrich = e?.currentTarget?.childNodes?.[0]?.className.includes(
                        "enrich",
                    );
                    if (openEnrich) {
                        allTrackers.trackEvent("Open", "Click", "Phrases Over Time/Expand");
                    }
                    return openEnrich;
                },
                onEnrichedRowClick: (isOpen, rowIndex, row) => {
                    // console.log('onEnrichedRowClick');
                },
                customTableClass: "outgoing-traffic-table",
            }}
            serverApi={`/api/websiteanalysis/GetOutgoingTable`}
            tableColumns={columns}
            initialFilters={params}
            recordsField="Records"
            totalRecordsField="TotalCount"
            onSort={onSort}
            getDataCallback={getDataCallback}
            transformData={transformData}
            pageIndent={1}
        >
            {(topComponentProps) => (
                <OutgoingTrafficPageTableTop
                    selectedCategory={
                        availableFilters.category
                            ? decodeURIComponent(subCategory(availableFilters.category.value))
                            : null
                    }
                    selectedCategoryId={availableFilters.category?.value}
                    onSelectCategory={onSelectCategory}
                    downloadExcelPermitted={downloadExcelPermitted}
                    excelLink={getExcelUrl()}
                    tableTopData={tableTopData}
                    a2d={a2d}
                    getCategoryLink={getCategoryLink}
                    searchValue={availableFilters.domain?.value}
                    onChange={onSearchTermFilterChange}
                    onClearAll={onClearAll}
                    selectedSite={selectedSite}
                    selectedSites={selectedSites}
                    isCompare={isCompare}
                    onSelectSite={onSelectSite}
                    onClearSite={onClearSite}
                    {...topComponentProps}
                />
            )}
        </SWReactTableWrapper>
    );
};
const mapStateToProps = ({ routing: { params } }) => {
    return {
        params,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {};
};

const connected = connect(mapStateToProps, mapDispatchToProps)(OutgoingTrafficPage);

export default SWReactRootComponent(connected, "OutgoingTrafficPage");
