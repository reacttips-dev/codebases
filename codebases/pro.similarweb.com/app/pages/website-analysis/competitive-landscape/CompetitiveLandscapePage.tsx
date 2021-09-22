import { tableActionsCreator } from "actions/tableActions";
import { showSuccessToast } from "actions/toast_actions";
import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import {
    AdsenseCell,
    CategoryFilterCell,
    IndexCell,
    RankCell,
    TrafficShare,
    WebsiteTooltipTopCell,
} from "components/React/Table/cells";
import { RowSelectionConsumer } from "components/React/Table/cells/RowSelection";
import { DefaultCellHeader, DefaultCellHeaderRightAlign } from "components/React/Table/headerCells";
import { SelectAllRowsHeaderCellConsumer } from "components/React/Table/headerCells/SelectAllRowsHeaderCell";
import { SWReactTableWrapperWithSelection } from "components/React/Table/SWReactTableWrapperSelectionContext";
import { DomainSelection } from "components/React/TableSelectionComponents/DomainSelection";
import { getToastItemComponent } from "components/React/Toast/ToastItem";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter, subCategoryFilter } from "filters/ngFilters";
import { CompetitiveLandscapeTableTop } from "pages/website-analysis/competitive-landscape/CompetitiveLandscapeTableTop";
import * as queryString from "query-string";
import React, { FunctionComponent, useState } from "react";
import { connect } from "react-redux";
import DurationService from "services/DurationService";
import { allTrackers } from "services/track/track";
import { MAX_DOMAINS_IN_CATEGORY } from "components/customCategoriesWizard/custom-categories-wizard-react";
import categoryService from "common/services/categoryService";

export const CompetitiveLandscapePage: FunctionComponent<any> = (props) => {
    const i18n = i18nFilter();
    const subCategory = subCategoryFilter();
    const downloadExcelPermitted = swSettings.current.resources.IsExcelAllowed;
    const [allCategories, setAllCategories] = useState([]);
    const chosenSites = Injector.get<any>("chosenSites");
    const swNavigator = Injector.get<any>("swNavigator");
    const isCompare = chosenSites.isCompare();
    const selectedSites = chosenSites.map((item, infoItem) => {
        return { value: item, label: infoItem.displayName, icon: infoItem.icon };
    });
    const {
        params: {
            key,
            country,
            isWWW,
            duration,
            webSource,
            similarsites_orderby,
            similarsites_filters,
            selectedSite: selectedSiteProps,
        },
        showToast,
        clearAllSelectedRows,
        selectedRows,
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
    if (similarsites_filters) {
        similarsites_filters.split("+").forEach((filter) => {
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
    let field = "Affinity";
    let sortDirection = "desc";
    if (similarsites_orderby) {
        [field, sortDirection] = similarsites_orderby.split(" ");
    }
    const { from, to, isWindow } = DurationService.getDurationData(duration).forAPI;
    const params = {
        filter,
        country,
        from,
        includeSubDomains: isWWW === "*",
        isWindow,
        keys: isCompare ? selectedSite : key,
        orderBy: `${field} ${sortDirection}`,
        to,
        timeGranularity: "Monthly",
    } as any;
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
            similarsites_filters: createFiltersForUrl(filters),
        });
    };
    const columns = [
        {
            fixed: true,
            cellComponent: RowSelectionConsumer,
            sortable: false,
            headerComponent: SelectAllRowsHeaderCellConsumer,
            isResizable: false,
            width: 40,
            visible: categoryService.hasCustomCategoriesPermission(),
            disableHeaderCellHover: true,
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
            minWidth: 304,
            sortable: true,
            field: "Domain",
            showTotalCount: true,
            displayName: i18n("analysis.competitors.similar.table.columns.domain.title"),
            tooltip: i18n("analysis.competitors.similar.table.columns.domain.title.tooltip"),
            cellComponent: WebsiteTooltipTopCell,
        },
        {
            minWidth: 304,
            sortable: true,
            field: "Category",
            displayName: i18n("analysis.competitors.similar.table.columns.category.title"),
            tooltip: i18n("analysis.competitors.similar.table.columns.category.title.tooltip"),
            cellComponent: (row) => {
                const onItemClick = () => onSelectCategory(row.value);
                return <CategoryFilterCell {...row} onItemClick={onItemClick} />;
            },
        },
        {
            minWidth: 108,
            sortable: true,
            field: "Rank",
            displayName: i18n("analysis.competitors.similar.table.columns.rank.title"),
            tooltip: i18n("analysis.competitors.similar.table.columns.rank.title.tooltip"),
            cellComponent: RankCell,
            headerComponent: DefaultCellHeaderRightAlign,
            format: "rank",
        },
        {
            width: 180,
            sortable: true,
            field: "Affinity",
            displayName: i18n("analysis.competitors.similar.table.columns.share.title"),
            tooltip: i18n("analysis.competitors.similar.table.columns.share.title.tooltip"),
            cellComponent: TrafficShare,
        },
        {
            width: 77,
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
    const getDataCallback = (data) => {
        const {
            Filters: { category },
        } = data;
        setAllCategories(category);
    };
    const onSort = ({ field, sortDirection }) => {
        swNavigator.applyUpdateParams({
            similarsites_orderby: `${field} ${sortDirection}`,
        });
    };
    const transformData = (data) => {
        return {
            ...data,
            Data: data.Data.map((record) => {
                return {
                    ...record,
                    url: swNavigator.href("websites-worldwideOverview", {
                        ...swNavigator.getParams(),
                        key: record.Domain,
                    }),
                };
            }),
        };
    };
    const getExcelUrl = () => {
        const queryStringParams = queryString.stringify(params);
        return `/widgetApi/WebsiteCompetitors/SimilarSites/Excel?${queryStringParams}`;
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
            similarsites_filters: createFiltersForUrl(filters),
        });
    };
    const onClearAll = () => {
        swNavigator.applyUpdateParams({
            similarsites_filters: null,
        });
    };
    const onClearSite = () => {
        swNavigator.go(
            swNavigator.current().name,
            Object.assign(swNavigator.getParams(), { selectedSite: null }),
        );
    };
    const onSelectSite = (selectedSite) => {
        swNavigator.go(
            swNavigator.current().name,
            Object.assign(swNavigator.getParams(), { selectedSite: selectedSite.text }),
        );
    };
    return (
        <SWReactTableWrapperWithSelection
            tableSelectionKey="CompetitiveLandscapeTable"
            tableSelectionProperty="Domain"
            maxSelectedRows={MAX_DOMAINS_IN_CATEGORY}
            cleanOnUnMount={true}
            tableOptions={{
                aboveHeaderComponents: [
                    <DomainSelection
                        key="DomainSelection"
                        showToast={showToast}
                        clearAllSelectedRows={clearAllSelectedRows}
                        selectedRows={selectedRows}
                    />,
                ],
                showCompanySidebar: true,
                metric: "CompetitiveLandscapeTable",
                tableSelectionTrackingParam: "Domain",
                trackName: "Competitive Landscape",
            }}
            serverApi={`/widgetApi/WebsiteCompetitors/SimilarSites/Table`}
            tableColumns={columns}
            initialFilters={params}
            recordsField="Data"
            totalRecordsField="TotalCount"
            onSort={onSort}
            getDataCallback={getDataCallback}
            pageIndent={1}
            transformData={transformData}
        >
            {(topComponentProps) => (
                <CompetitiveLandscapeTableTop
                    {...topComponentProps}
                    selectedCategory={
                        availableFilters.category
                            ? decodeURIComponent(subCategory(availableFilters.category.value))
                            : null
                    }
                    selectedCategoryId={availableFilters.category?.value}
                    excelLink={getExcelUrl()}
                    searchValue={availableFilters.domain?.value}
                    downloadExcelPermitted={downloadExcelPermitted}
                    onSelectCategory={onSelectCategory}
                    allCategories={allCategories}
                    isCompare={isCompare}
                    selectedSite={selectedSite}
                    onChange={onSearchTermFilterChange}
                    onClearAll={onClearAll}
                    onSelectSite={onSelectSite}
                    onClearSite={onClearSite}
                    selectedSites={selectedSites}
                />
            )}
        </SWReactTableWrapperWithSelection>
    );
};

const mapStateToProps = ({
    routing: { params },
    tableSelection: { CompetitiveLandscapeTable },
}) => {
    return {
        params,
        selectedRows: CompetitiveLandscapeTable,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        clearAllSelectedRows: () => {
            dispatch(
                tableActionsCreator("CompetitiveLandscapeTable", "Domain").clearAllSelectedRows(),
            );
        },
        showToast: (href, text, label) => {
            dispatch(
                showSuccessToast(
                    getToastItemComponent({
                        text,
                        linkText: label,
                        href,
                        onClick: () =>
                            allTrackers.trackEvent(
                                "add to Custom Category",
                                "click",
                                "internal link/websites.overview",
                            ),
                    }),
                ),
            );
        },
    };
};
const connected = connect(mapStateToProps, mapDispatchToProps)(CompetitiveLandscapePage);

export default SWReactRootComponent(connected, "CompetitiveLandscapePage");
