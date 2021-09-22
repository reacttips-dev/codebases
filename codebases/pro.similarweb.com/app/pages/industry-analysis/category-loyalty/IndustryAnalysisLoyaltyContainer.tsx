import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { swSettings } from "common/services/swSettings";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter, percentageSignFilter } from "filters/ngFilters";
import {
    IndustryAnalysisLoyalty,
    LOYALTY_CATEGORIES_COLORS,
} from "pages/industry-analysis/category-loyalty/IndustryAnalysisLoyalty";
import LoyaltyApiService, {
    ICategoryLoyaltyData,
    ICategoryLoyaltyTableData,
} from "pages/website-analysis/audience-loyalty/LoyaltyApiService";
import React, { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import categoryService from "common/services/categoryService";

export const categoryLoyaltyTableBarChartAdaptor = (datum: any) => {
    if (!datum) {
        return undefined;
    }
    return Object.keys(datum).map((bucketName) => {
        return {
            backgroundColor: LOYALTY_CATEGORIES_COLORS[bucketName].backgroundColor,
            color: LOYALTY_CATEGORIES_COLORS[bucketName].color,
            name: i18nFilter()(`industry.analysis.loyalty.legend.${bucketName}`),
            text: percentageSignFilter()(datum?.[bucketName], 2),
            width: datum?.[bucketName],
        };
    });
};

const IndustryAnalysisLoyaltyContainer = (props) => {
    const [categoryLoyaltyLoading, setCategoryLoyaltyLoading] = useState(true);
    const [tableLoading, setTableLoading] = useState(true);
    const [loyaltyTransformedBarData, setLoyaltyTransformedBarData] = useState<any[]>(null);
    const [tableData, setTableData] = useState<ICategoryLoyaltyTableData>(null);

    const { services } = useMemo(() => {
        return {
            services: {
                swNavigator: Injector.get<SwNavigator>("swNavigator"),
                apiService: new LoyaltyApiService(),
                swSettings,
            },
        };
    }, []);

    const pageFilters = useMemo<any>(() => {
        return services.swNavigator.getApiParams(props.routeParams);
    }, []);

    const categoryLoyaltyBarChartAdaptor = (datum: any) => {
        return Object.keys(datum).map((bucketName) => {
            return {
                backgroundColor: LOYALTY_CATEGORIES_COLORS[bucketName].backgroundColor,
                color: LOYALTY_CATEGORIES_COLORS[bucketName].color,
                name: i18nFilter()(`industry.analysis.loyalty.legend.${bucketName}`),
                text: percentageSignFilter()(datum?.[bucketName]?.AvgPercentageUsers, 2),
                width: datum?.[bucketName]?.AvgPercentageUsers,
            };
        });
    };

    useEffect(() => {
        const categoryObject = categoryService.categoryQueryParamToCategoryObject(
            pageFilters.category,
        );
        const loadCategoryChartData = async () => {
            try {
                setCategoryLoyaltyLoading(true);
                const categoryLoyaltyData = await services.apiService.getCategoryLoyalty({
                    ...pageFilters,
                    keys: categoryObject?.forApi,
                    category: categoryObject?.forDisplayApi,
                    categoryHash: categoryObject?.categoryHash,
                });
                const chartData =
                    categoryLoyaltyData && categoryLoyaltyData.Data
                        ? categoryLoyaltyBarChartAdaptor(
                              categoryLoyaltyData.Data?.[pageFilters.category.replace("~", "/")],
                          )
                        : null;
                setLoyaltyTransformedBarData(chartData);
            } finally {
                setCategoryLoyaltyLoading(false);
            }
        };

        const loadTableData = async () => {
            try {
                setTableLoading(true);
                const tableApiData = await services.apiService.getCategoryLoyaltyTable({
                    ...pageFilters,
                    keys: [pageFilters.category],
                });
                setTableData(tableApiData);
            } catch (e) {
                setTableData(null);
            } finally {
                setTableLoading(false);
            }
        };
        const loadTableAndGraphData = async () => {
            try {
                setTableLoading(true);
                setCategoryLoyaltyLoading(true);
                const tableAndGraphData = await services.apiService.getCategoryLoyaltyTable(
                    {
                        ...pageFilters,
                        keys: [pageFilters.category],
                    },
                    "api/category/audienceLoyalty/Data",
                );
                setTableData(tableAndGraphData);

                const chartData = categoryLoyaltyBarChartAdaptor(tableAndGraphData.Total);
                setLoyaltyTransformedBarData(chartData);
            } catch (e) {
                setTableData(null);
            } finally {
                setTableLoading(false);
                setCategoryLoyaltyLoading(false);
            }
        };
        if (categoryObject.isCustomCategory) {
            loadTableAndGraphData();
        } else {
            loadCategoryChartData();
            loadTableData();
        }
    }, []);

    const generateTableExcelApiUrl = useMemo<any>(() => {
        const categoryObject = categoryService.categoryQueryParamToCategoryObject(
            pageFilters.category,
        );
        const apiParams: any = {
            includeSubDomains: !pageFilters.isWWW,
            from: pageFilters.from,
            to: pageFilters.to,
            country: pageFilters.country,
            webSource: pageFilters.webSource,
            isWindow: pageFilters.isWindow,
            keys: categoryObject?.forApi,
            category: categoryObject?.forDisplayApi,
            categoryHash: categoryObject?.categoryHash,
        };
        const qs = Object.keys(apiParams)
            .filter((key) => apiParams[key] !== undefined && apiParams[key] !== "")
            .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(apiParams[key])}`)
            .join("&");

        return `api/category/audienceLoyalty/Excel?${qs}`;
    }, []);

    return (
        <IndustryAnalysisLoyalty
            isCategoryChartLoading={categoryLoyaltyLoading}
            categoryChartData={loyaltyTransformedBarData}
            isTableLoading={tableLoading}
            tableData={tableData}
            tableExcelUrl={generateTableExcelApiUrl}
        />
    );
};

function mapStateToProps({ routing }) {
    const routeParams = routing?.params;
    return {
        routeParams,
    };
}

export default SWReactRootComponent(
    connect(mapStateToProps, undefined)(IndustryAnalysisLoyaltyContainer),
    "IndustryAnalysisLoyaltyContainer",
);
