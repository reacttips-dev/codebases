import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import SWReactTableWrapper from "components/React/Table/SWReactTableWrapper";
import {
    AdsenseCell,
    CategoryCell,
    ChangePercentage,
    DefaultCell,
    IndexCell,
    IndustryTrafficSource,
    RankCell,
    TrafficShare,
} from "components/React/Table/cells";
import DurationService from "services/DurationService";
import { DefaultCellHeader, DefaultCellHeaderRightAlign } from "components/React/Table/headerCells";
import { i18nFilter, subCategoryFilter } from "filters/ngFilters";
import { Injector } from "common/ioc/Injector";
import { ICategory } from "common/services/categoryService.types";
import { ISource, TrafficSourcesOverviewTableTop } from "./TrafficSourcesOverviewTableTop";
import { SwNavigator } from "common/services/swNavigator";
import * as queryString from "query-string";
import { swSettings } from "common/services/swSettings";
import categoryService from "common/services/categoryService";

interface IParams {
    category: string;
    country: string;
    duration: string;
    webSource: string;
    selectedCategory: string;
    selectedSourceType: string;
    searchValue: string;
}

interface ITrafficSourcesOverviewTableProps {
    children?: React.ReactNode;
    params: IParams;
}

const TrafficSourcesOverviewTable: FunctionComponent<ITrafficSourcesOverviewTableProps> = (
    props,
) => {
    const [allCategories, setAllCategories] = useState<ICategory[]>([]);
    const [allSources, setAllSources] = useState<ISource[]>([]);
    const addToDashboardModal = useRef({ dismiss: () => null });
    useEffect(() => {
        return () => {
            addToDashboardModal.current.dismiss();
        };
    }, [addToDashboardModal]);
    const downloadExcelPermitted = swSettings.current.resources.IsExcelAllowed;
    const i18n = i18nFilter();
    const subCategory = subCategoryFilter();
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const $rootScope = Injector.get<any>("$rootScope");
    const $modal = Injector.get<any>("$modal");
    const currentState = swNavigator.current().name;
    const {
        params: {
            category: categoryQueryParam,
            country,
            duration,
            webSource,
            selectedCategory,
            selectedSourceType,
            searchValue,
        },
    } = props;
    const categoryObject = categoryService.categoryQueryParamToCategoryObject(categoryQueryParam);
    const { forApi: category, forDisplayApi: categoryDisplayApi } = categoryObject;
    const durationObject = DurationService.getDurationData(duration);
    const { from, to, isWindow } = durationObject.forAPI;
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
        categoryDisplayApi,
    } as any;
    const filters = [];
    if (selectedCategory) {
        filters.push(`category;category;"${selectedCategory}"`);
    }
    if (searchValue) {
        filters.push(`Domain;contains;"${decodeURIComponent(searchValue)}"`);
    }
    if (filters.length > 0) {
        params.filter = filters.join(",");
    }
    if (categoryObject.isCustomCategory) {
        params.categoryHash = categoryObject.categoryHash;
    }
    const field = "TotalShare";
    const sortDirection = "desc";
    const columns = [
        {
            fixed: true,
            cellComponent: IndexCell,
            disableHeaderCellHover: true,
            sortable: false,
            width: 46,
            isResizable: false,
        },
        {
            fixed: true,
            field: "Domain",
            cellComponent: IndustryTrafficSource,
            displayName: i18n("widget.table.trafficsourcesoverviewdatakpiwidget.columns.domain"),
            tooltip: i18n("widget.table.tooltip.trafficsourcesoverviewdatakpiwidget.domain"),
            sortable: true,
            showTotalCount: true,
            width: 220,
            groupable: true,
        },
        {
            field: "SourceType",
            cellComponent: DefaultCell,
            displayName: i18n(
                "widget.table.trafficsourcesoverviewdatakpiwidget.columns.sourcetype",
            ),
            tooltip: i18n("widget.table.tooltip.trafficsourcesoverviewdatakpiwidget.sourcetype"),
            sortable: true,
            width: 160,
            visible:
                selectedSourceType !== "Display Ad" && currentState === "findpublishers_byindustry",
        },
        {
            field: "Rank",
            cellComponent: RankCell,
            headerComponent: DefaultCellHeaderRightAlign,
            displayName: i18n(
                "widget.table.trafficsourcesoverviewdatakpiwidget.columns.globalrank",
            ),
            tooltip: i18n("widget.table.tooltip.trafficsourcesoverviewdatakpiwidget.rank"),
            sortable: true,
            width: 140,
        },
        {
            field: "TotalShare",
            cellComponent: TrafficShare,
            headerComponent: DefaultCellHeaderRightAlign,
            displayName: i18n(
                "widget.table.trafficsourcesoverviewdatakpiwidget.columns.trafficshare",
            ),
            tooltip: i18n("widget.table.tooltip.trafficsourcesoverviewdatakpiwidget.totalshare"),
            sortable: true,
            width: 170,
        },
        {
            field: "Change",
            cellComponent: ChangePercentage,
            headerComponent: DefaultCellHeaderRightAlign,
            displayName: i18n("widget.table.trafficsourcesoverviewdatakpiwidget.columns.change"),
            tooltip: i18n("widget.table.tooltip.trafficsourcesoverviewdatakpiwidget.change"),
            sortable: true,
            width: 110,
        },
        {
            field: "Category",
            cellComponent: CategoryCell,
            headerComponent: DefaultCellHeaderRightAlign,
            displayName: i18n("widget.table.trafficsourcesoverviewdatakpiwidget.columns.category"),
            tooltip: i18n("widget.table.tooltip.trafficsourcesoverviewdatakpiwidget.category"),
            sortable: true,
            width: 220,
            ppt: {
                overrideFormat: "Category",
            },
        },
        {
            field: "HasAdsense",
            cellComponent: AdsenseCell,
            headerComponent: DefaultCellHeaderRightAlign,
            displayName: i18n("widget.table.trafficsourcesoverviewdatakpiwidget.columns.adsense"),
            tooltip: i18n("widget.table.tooltip.trafficsourcesoverviewdatakpiwidget.hasadsense"),
            sortable: true,
            width: 95,
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
    const getDataCallback = (data): void => {
        const {
            Filters: { category, sourceType },
        } = data;
        setAllCategories(category);
        setAllSources(sourceType);
    };
    const onSelectCategory = (category): void => {
        swNavigator.applyUpdateParams({
            selectedCategory: category,
        });
    };
    const onSelectSourceType = (sourceType): void => {
        swNavigator.applyUpdateParams({
            selectedSourceType: sourceType,
        });
    };
    const onClearAll = (): void => {
        swNavigator.applyUpdateParams({
            selectedCategory: null,
            searchValue: null,
            selectedSourceType: null,
        });
    };
    const getExcelUrl = (): string => {
        const queryParams = { ...params, category: params.categoryDisplayApi };
        const queryStringParams = queryString.stringify(queryParams);
        return `/widgetApi/IndustryAnalysis/PublishersByIndustry/Excel?${queryStringParams}`;
    };

    const onSearch = (searchValue): void => {
        swNavigator.applyUpdateParams({
            searchValue,
        });
    };

    const a2d = (): void => {
        const categoryData = categoryService.getCategory(category);
        const key = category.startsWith("*")
            ? { id: categoryData.id, name: categoryData.text, category: categoryData.id }
            : {
                  id: `$${categoryData.id}`,
                  name: categoryData.text,
                  category: `$${categoryData.id}`,
              };
        addToDashboardModal.current = $modal.open({
            animation: true,
            controller: "widgetAddToDashboardController as ctrl",
            templateUrl: "/app/components/widget/widget-add-to-dashboard-modal.html",
            windowClass: "add-to-dashboard-modal",
            resolve: {
                widget: () => null,
                customModel: () => ({
                    country,
                    duration,
                    family: "Industry",
                    type: "IndustryReferralsDashboardTable",
                    metric: "TrafficSourcesOverviewDataKpiWidget",
                    webSource: "Desktop",
                    key: [key],
                    customAsset: "Industry",
                    filters: {
                        timeGranularity: "Monthly",
                    },
                }),
            },
            scope: $rootScope.$new(true),
        });
    };
    return (
        <SWReactTableWrapper
            serverApi="/widgetApi/IndustryAnalysis/PublishersByIndustry/Table"
            tableColumns={columns}
            initialFilters={params}
            recordsField="Data"
            totalRecordsField="TotalCount"
            pageIndent={1}
            getDataCallback={getDataCallback}
        >
            {(topComponentProps) => (
                <TrafficSourcesOverviewTableTop
                    {...topComponentProps}
                    allCategories={allCategories}
                    onSelectCategory={onSelectCategory}
                    onClearAll={onClearAll}
                    selectedCategory={
                        selectedCategory ? decodeURIComponent(subCategory(selectedCategory)) : null
                    }
                    selectedCategoryId={selectedCategory}
                    allSources={allSources}
                    onSelectSourceType={onSelectSourceType}
                    selectSourceType={
                        selectedSourceType ? decodeURIComponent(selectedSourceType) : null
                    }
                    downloadExcelPermitted={downloadExcelPermitted}
                    excelLink={getExcelUrl()}
                    a2d={a2d}
                    searchValue={searchValue && decodeURIComponent(searchValue)}
                    onChange={onSearch}
                    currentState={currentState}
                />
            )}
        </SWReactTableWrapper>
    );
};
const mapStateToProps = ({ routing: { params } }): { params: IParams } => {
    return {
        params,
    };
};
const mapDispatchToProps: {} = () => {
    return {};
};

export default SWReactRootComponent(
    connect(mapStateToProps, mapDispatchToProps)(TrafficSourcesOverviewTable),
    "TrafficSourcesOverviewTable",
);
