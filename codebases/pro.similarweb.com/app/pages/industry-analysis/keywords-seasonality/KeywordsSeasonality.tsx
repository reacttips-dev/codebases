import { tableActionsCreator } from "actions/tableActions";
import { Injector } from "common/ioc/Injector";
import { SWReactTableWrapperWithSelection } from "components/React/Table/SWReactTableWrapperSelectionContext";
import { SeasonalKeywordsEnrichedRow } from "pages/industry-analysis/keywords-seasonality/SeasonalKeywordsEnrichedRow";
import { booleanSearchToObject } from "pages/website-analysis/traffic-sources/search/booleanSearchUtility";
import React, { useMemo } from "react";
import { CSS_CLASS_PREFIX } from "UtilitiesAndConstants/Constants/css";
import SWReactRootComponent from "../../../decorators/SWReactRootComponent";
import { connect } from "react-redux";
import getColumns from "./TableColumns";
import { TableTop } from "./TableTop";
import { i18nFilter } from "filters/ngFilters";
import AddTableRowsKeywordsToGroupUtility from "../../../pages/keyword-analysis/AddTableRowsKeywordsToGroupUtility";
import {
    createCpcFilter,
    createVolumeFilter,
    getRangeFilterQueryParamValue,
} from "components/filtersPanel/src/RangeFilterUtilityFunctions";
import { apiHelper } from "common/services/apiHelper";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";

const MAX_NUMBER_OF_SORTABLE_RECORDS = 10000;
const noDataTitleKey = "industry.analysis.keywords.seasonality.table.no.data.title";
const noDataSubTitleKey = "industry.analysis.keywords.seasonality.table.no.data.subtitle";
const customCategoryNoDataTitleKey =
    "industry.analysis.keywords.seasonality.custom.category.table.no.data.title";
const customCategoryNoDataSubTitleKey =
    "industry.analysis.keywords.seasonality.custom.category.table.no.data.subtitle";
const defaultSorting = `TotalShare desc`;
const tableSelectionKey = "industry_analysis.keywords_seasonality";
const tableSelectionProperty = "SearchTerm";

const KeywordsSeasonalityPage: React.FC<any> = (props) => {
    const [isCpcAndVolumeSortingAllowed, setIsCpcAndVolumeSortingAllowed] = React.useState(true);
    const columns = useMemo(() => {
        return getColumns(isCpcAndVolumeSortingAllowed);
    }, [isCpcAndVolumeSortingAllowed]);
    const isCustomCategory = UserCustomCategoryService.isCustomCategory(props.params.category);
    const { country: countryId } = props.params;
    const initialFilters = useMemo(() => {
        const params = {
            ...props.params,
            timeGranularity: "Monthly",
            orderBy: props.params.orderBy ? props.params.orderBy : defaultSorting,
            includeSubDomains: true,
            category: `${props.params.category}`,
            keys: `$${decodeURIComponent(props.params.category)}`,
        };
        if (props.params?.search) {
            params.filter = {
                SearchTerm: props.params?.search,
            };
        }
        const apiParams = apiHelper.transformParamsForAPI(params);
        if (props.params.months) {
            delete apiParams.months;
            apiParams.TrendingMonthsFilter = props.params.months;
        }
        if (props.params.BooleanSearchTerms) {
            const { BooleanSearchTerms: booleanSearchTermsWithPrefix } = props.params;
            const { IncludeTerms, ExcludeTerms } = booleanSearchToObject(
                booleanSearchTermsWithPrefix,
            );
            apiParams.ExcludeTerms = ExcludeTerms;
            apiParams.IncludeTerms = IncludeTerms;
        } else {
            delete apiParams.IncludeTerms;
            delete apiParams.ExcludeTerms;
        }
        if (isCustomCategory) {
            const category = UserCustomCategoryService.getCustomCategoryById(
                apiParams.category.substr(1),
            );
            const { categoryHash, forApi, forDisplayApi } = category;
            apiParams.categoryHash = categoryHash;
            apiParams.category = forDisplayApi;
            apiParams.keys = forApi;
        }
        delete apiParams.BooleanSearchTerms;
        delete apiParams.sort;
        delete apiParams.asc;
        delete apiParams.BooleanSearchTerms;
        apiParams.includeNoneBranded = props.params.includeNoneBranded === true.toString();
        apiParams.includeBranded = props.params.includeBranded === true.toString();
        apiParams.duration = "12m";

        apiParams.rangeFilter = getRangeFilterQueryParamValue([
            createVolumeFilter(props.params.volumeFromValue, props.params.volumeToValue),
            createCpcFilter(props.params.cpcFromValue, props.params.cpcToValue),
        ]);
        return apiParams;
    }, [props.params]);
    const swNavigator = Injector.get<any>("swNavigator");
    const onSort = ({ field, sortDirection }) => {
        swNavigator.applyUpdateParams({
            orderBy: `${field} ${sortDirection}`,
        });
    };
    const onDataCallback = (data) => {
        if (data.TotalCount > MAX_NUMBER_OF_SORTABLE_RECORDS) {
            isCpcAndVolumeSortingAllowed &&
                setIsCpcAndVolumeSortingAllowed(!isCpcAndVolumeSortingAllowed);
        } else {
            !isCpcAndVolumeSortingAllowed &&
                setIsCpcAndVolumeSortingAllowed(!isCpcAndVolumeSortingAllowed);
        }
    };

    const transformData = (data) => {
        return {
            ...data,
            records: data.Data.map((record) => {
                return {
                    ...record,
                    trendingMonths: record.TrendingMonths.map((TrendingMonth) =>
                        Number(TrendingMonth),
                    ),
                    favicon: record.Favicon,
                    url: swNavigator.href("keywordAnalysis_overview", {
                        ...props.params,
                        keyword: record.SearchTerm,
                    }),
                };
            }),
        };
    };
    const CUSTOM_TABLE_CLASS_NAME = "seasonal-keywords-table";
    return (
        <SWReactTableWrapperWithSelection
            shouldSelectRow={(row) => row.SearchTerm !== "grid.upgrade"}
            getDataCallback={onDataCallback}
            onSort={onSort}
            tableSelectionKey={tableSelectionKey}
            tableSelectionProperty={tableSelectionProperty}
            serverApi="/api/SeasonalKeywords/Table"
            tableColumns={columns}
            tableOptions={{
                longLoader: true,
                noDataTitle: i18nFilter()(
                    isCustomCategory ? customCategoryNoDataTitleKey : noDataTitleKey,
                ),
                noDataSubtitle: i18nFilter()(
                    isCustomCategory ? customCategoryNoDataSubTitleKey : noDataSubTitleKey,
                ),
                tableSelectionTrackingParam: "keyword",
                aboveHeaderComponents: [
                    <AddTableRowsKeywordsToGroupUtility
                        key="seasonal-keywords-table--aboveHeaderComponent"
                        clearAllSelectedRows={
                            tableActionsCreator(tableSelectionKey, tableSelectionProperty)
                                .clearAllSelectedRows
                        }
                        stateKey={tableSelectionKey}
                    />,
                ],
                get EnrichedRowComponent() {
                    return (props) => (
                        <SeasonalKeywordsEnrichedRow row={props.row} countryId={countryId} />
                    );
                },
                shouldEnrichRow: (props, index, e) => {
                    const openEnrich = e?.currentTarget?.childNodes[0]?.className.includes(
                        "enrich",
                    );
                    return props.tableData[index].SearchTerm !== "grid.upgrade" && openEnrich;
                },
                get enrichedRowComponentHeight() {
                    const width = window.innerWidth;
                    if (width < 1200 && width > 320) {
                        return 625;
                    }
                    if (width <= 320) {
                        return 685;
                    } else return 580;
                },
                onEnrichedRowClick: (isOpen, rowIndex, row) => {
                    if (row === undefined) {
                        return;
                    }
                },

                get enrichedRowComponentAppendTo() {
                    return CSS_CLASS_PREFIX + CUSTOM_TABLE_CLASS_NAME;
                },
                shouldApplyEnrichedRowHeightToCell: false,
                customTableClass: CUSTOM_TABLE_CLASS_NAME,
            }}
            recordsField="records"
            totalRecordsField="TotalCount"
            pageIndent={1}
            cleanOnUnMount={true}
            initialFilters={initialFilters}
            transformData={transformData}
        >
            {(topComponentProps) => (
                <TableTop
                    {...topComponentProps}
                    search={props.params?.search}
                    params={props.params}
                />
            )}
        </SWReactTableWrapperWithSelection>
    );
};

const mapStateToProps = (state) => {
    const {
        routing: { params },
        tableSelection,
    } = state;
    return {
        params,
        selectedRows: tableSelection[tableSelectionKey],
    };
};

const connected = connect(mapStateToProps)(KeywordsSeasonalityPage);

export default SWReactRootComponent(connected, "KeywordsSeasonalityPage");
