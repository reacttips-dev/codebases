import React, { FunctionComponent, useState } from "react";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import SWReactTableWrapper from "components/React/Table/SWReactTableWrapper";
import DurationService from "services/DurationService";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import * as queryString from "query-string";
import { FindAdNetworksByIndustryEnriched } from "./FindAdNetworksByIndustryEnriched";
import {
    DEFAULT_SORT_DIRECTION,
    DEFAULT_SORT_FIELD,
    FindAdNetworksByIndustryTableSettings,
} from "./FindAdNetworksByIndustryTableSettings";
import { swSettings } from "common/services/swSettings";
import { FindAdNetworksByIndustryTableTop } from "./FindAdNetworksByIndustryTableTop";
import UIComponentStateService from "services/UIComponentStateService";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";
import categoryService from "common/services/categoryService";

const FindAdNetworksByIndustryTable: FunctionComponent<void> = () => {
    const pageSize = 100;
    const [pageNumber, setPageNumber] = useState(0);
    const changePageCallback = (page) => setPageNumber(page);
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const {
        category: categoryQueryParam = "All",
        country,
        duration,
        webSource,
        searchValue,
        orderBy,
    } = swNavigator.getParams();
    const {
        forApi: category,
        forDisplayApi: categoryDisplayApi,
    } = categoryService.categoryQueryParamToCategoryObject(categoryQueryParam);
    const durationObject = DurationService.getDurationData(duration);
    const { isCustom } = durationObject.raw;
    const { from, to, isWindow } = durationObject.forAPI;
    let field = DEFAULT_SORT_FIELD;
    let sortDirection = DEFAULT_SORT_DIRECTION;
    if (orderBy) {
        [field, sortDirection] = orderBy.split(" ");
    }
    const params = {
        category,
        country,
        from,
        includeSubDomains: true,
        isWindow,
        keys: category,
        timeGranularity: "Monthly",
        to,
        webSource,
        orderBy: `${field} ${sortDirection}`,
        sort: field,
        asc: sortDirection === "asc",
        categoryDisplayApi,
    } as any;
    if (category?.startsWith("*")) {
        const customCategory = UserCustomCategoryService.getCustomCategories().find(
            (rec) => rec.id === category,
        );
        if (customCategory) {
            params.categoryHash = customCategory.categoryHash;
        }
    }
    const durationDiff = DurationService.getDiffSymbol(from, to);
    const showChartNoData = ["28d", "1m"].includes(durationDiff);
    const filters = [];
    if (searchValue) {
        filters.push(`Name;contains;"${decodeURIComponent(searchValue)}"`);
    }
    if (filters.length > 0) {
        params.filter = filters.join(",");
    }
    const sortedColumn = orderBy ? { field, sortDirection } : undefined;
    const columns = FindAdNetworksByIndustryTableSettings.getColumns(sortedColumn);
    const downloadExcelPermitted = swSettings.current.resources.IsExcelAllowed;

    const getExcelUrl = (): string => {
        const queryParams = { ...params, category: params.categoryDisplayApi };
        const queryStringParams = queryString.stringify(queryParams);
        return `/widgetApi/IndustryAnalysis/AdNetworksByIndustry/Excel?${queryStringParams}`;
    };

    const onSearch = (searchValue): void => {
        swNavigator.applyUpdateParams({
            searchValue,
        });
    };

    const onSort = ({ field, sortDirection }) => {
        swNavigator.applyUpdateParams({
            orderBy: `${field} ${sortDirection}`,
        });
    };

    const transformData = (data) => {
        return {
            ...data,
            Data: data.Data.map((row) => {
                return {
                    ...row,
                    TrafficLeaderUrl: row.TrafficLeader
                        ? swNavigator.href("websites-worldwideOverview", {
                              ...swNavigator.getParams(),
                              key: row.TrafficLeader,
                              isWWW: "*",
                          })
                        : null,
                };
            }),
        };
    };

    return (
        <SWReactTableWrapper
            changePageCallback={changePageCallback}
            transformData={transformData}
            tableOptions={{
                showCompanySidebar: true,
                metric: "AdNetworksByIndustryTable",
                get EnrichedRowComponent() {
                    // eslint-disable-next-line react/display-name
                    return (props) => {
                        return (
                            <FindAdNetworksByIndustryEnriched
                                {...props}
                                pageSize={pageSize}
                                pageNumber={pageNumber}
                                showChartNoData={showChartNoData}
                            />
                        );
                    };
                },
                get enrichedRowComponentAppendTo() {
                    return ".find-ad-networks-by-industry-table";
                },
                get enrichedRowComponentHeight() {
                    return 426;
                },
                shouldApplyEnrichedRowHeightToCell: false,
                shouldEnrichRow: (props, index, e) => {
                    const openEnrich = e?.currentTarget?.childNodes?.[0]?.className.includes(
                        "enrich",
                    );
                    if (openEnrich) {
                        TrackWithGuidService.trackWithGuid(
                            "find.ad.networks.by.industry.inner.table",
                            "click",
                            { action: "Find Ad Network By Industry/Expand" },
                        );
                    }
                    return props.tableData[index].Name !== "grid.upgrade" && openEnrich;
                },
                get enrichOnLoadRowNumber() {
                    const key = "FindAdNetworksByIndustryEnrichOnLoad";
                    const shouldNotEnrichOnLoad = UIComponentStateService.getItem(
                        key,
                        "sessionStorage",
                    );
                    if (!shouldNotEnrichOnLoad) {
                        UIComponentStateService.setItem(key, "sessionStorage", true);
                    }
                    let isMinThreeMonths;
                    if (!isCustom) {
                        isMinThreeMonths = duration !== "28d" && duration !== "1m";
                    } else {
                        isMinThreeMonths = DurationService.diffByUnit(from, to, "months") + 1 >= 3;
                    }
                    if (!shouldNotEnrichOnLoad && isMinThreeMonths) {
                        return 1;
                    }
                    return null;
                },
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                onEnrichedRowClick: (isOpen, rowIndex, row) => {},
                customTableClass: "find-ad-networks-by-industry-table",
            }}
            serverApi="/widgetApi/IndustryAnalysis/AdNetworksByIndustry/Table"
            tableColumns={columns}
            initialFilters={params}
            onSort={onSort}
            recordsField="Data"
            totalRecordsField="TotalCount"
            pageIndent={1}
        >
            {(topComponentProps) => (
                <FindAdNetworksByIndustryTableTop
                    {...topComponentProps}
                    downloadExcelPermitted={downloadExcelPermitted}
                    excelLink={getExcelUrl()}
                    searchValue={searchValue && decodeURIComponent(searchValue)}
                    onChange={onSearch}
                />
            )}
        </SWReactTableWrapper>
    );
};

export default SWReactRootComponent(FindAdNetworksByIndustryTable, "FindAdNetworksByIndustryTable");
