import * as React from "react";
import { DEFAULT_SORT } from "pages/keyword-analysis/amazon-keyword-generator/AmazonKeywordGeneratorRelatedColumnsConfig";
import { Injector } from "common/ioc/Injector";
import { useState } from "react";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { i18nFilter } from "filters/ngFilters";
import { tableActionsCreator } from "actions/tableActions";
import AddTableRowsKeywordsToGroupUtility from "pages/keyword-analysis/AddTableRowsKeywordsToGroupUtility";
import { SWReactTableWrapperWithSelection } from "components/React/Table/SWReactTableWrapperSelectionContext";
import { connect } from "react-redux";
import * as queryString from "query-string";
import { booleanSearchToObject } from "pages/website-analysis/traffic-sources/search/booleanSearchUtility";
import { SwNavigator } from "common/services/swNavigator";
import keywordByIndustryTabTableColumns from "./KeywordByIndustryTabTableColumns";
import KeywordByIndustryTabTableTop from "./KeywordByIndustryTabTableTop";
import {
    createCpcFilter,
    createVolumeFilter,
    getRangeFilterQueryParamValue,
} from "components/filtersPanel/src/RangeFilterUtilityFunctions";
import { ETopKeywordsTable } from "./widgets/IndustryAnalysisTopKeywordsAll";
import categoryService from "common/services/categoryService";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";

const tableSelectionKey = "industry_analysis.keywords_industry";
const tableSelectionProperty = "SearchTerm";
const TOTAL_RECORDS_FIELD = "TotalCount";

const KeywordByIndustryTabTable: React.FC<any> = (props) => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const [allSourceTypes, setAllSourceTypes] = useState([]);
    const [totalRecords, setTotalRecords] = useState<number>();

    const {
        params: {
            category,
            country,
            webSource,
            BooleanSearchTerms,
            duration,
            IncludeTrendingKeywords,
            IncludeNewKeywords,
            IncludeQuestions,
            volumeFromValue,
            volumeToValue,
            cpcFromValue,
            cpcToValue,
            includeSubDomains = true,
            includeNoneBranded = true,
            includeBranded = true,
            sort = DEFAULT_SORT,
            asc = false,
            channel,
        },
        overrideFilterParams,
        tab,
    } = props;

    const { to, from, isWindow } = swNavigator.getApiParams();

    const filters = [];
    if (overrideFilterParams) {
        filters.push(overrideFilterParams);
    }
    if (channel) {
        filters.push(`Source;==;${channel}`);
    }

    const rangeFilter = getRangeFilterQueryParamValue([
        createVolumeFilter(volumeFromValue, volumeToValue),
        createCpcFilter(cpcFromValue, cpcToValue),
    ]);

    const categoryObject = categoryService.categoryQueryParamToCategoryObject(category);

    const apiParams = {
        category: categoryObject.forDisplayApi,
        to,
        from,
        webSource,
        country,
        sort,
        asc,
        isWindow,
        includeSubDomains,
        includeNoneBranded,
        includeBranded,
        rangeFilter,
        IncludeTrendingKeywords,
        IncludeNewKeywords,
        IncludeQuestions,
        keys: categoryObject.forApi,
        filter: filters.join(","),
        ...(categoryObject["categoryHash"] ? { categoryHash: categoryObject["categoryHash"] } : {}),
    };

    if (BooleanSearchTerms) {
        const { BooleanSearchTerms: booleanSearchTermsWithPrefix } = props.params;
        const { IncludeTerms, ExcludeTerms } = booleanSearchToObject(booleanSearchTermsWithPrefix);
        if (ExcludeTerms) {
            apiParams["ExcludeTerms"] = ExcludeTerms;
        } else {
            delete apiParams["ExcludeTerms"];
        }
        if (IncludeTerms) {
            apiParams["IncludeTerms"] = IncludeTerms;
        } else {
            delete apiParams["IncludeTerms"];
        }
    }

    const columns = keywordByIndustryTabTableColumns.getColumns(
        duration,
        tab ?? ETopKeywordsTable.all,
    );

    const serverApi = "widgetApi/IndustryAnalysisTopKeywords/SearchKeywordsAbb/Table";

    const getDataCallback = (data) => {
        setAllSourceTypes(data.Filters.Source);
        const { getDataCallback } = props;
        getDataCallback && getDataCallback(data[TOTAL_RECORDS_FIELD]);
        setTotalRecords(data[TOTAL_RECORDS_FIELD]);
        return data;
    };

    const changePageCallback = (page) => {
        TrackWithGuidService.trackWithGuid("amazon.keyword.generator.table.pagination", "switch", {
            page: page,
        });
    };
    const onSort = ({ field, sortDirection }) => {
        swNavigator.applyUpdateParams({
            sort: `${field}`,
            asc: `${sortDirection === "asc"}`,
        });
    };
    const getExcelUrl = () => {
        return `widgetApi/IndustryAnalysisTopKeywords/SearchKeywordsAbb/Excel?${queryString.stringify(
            apiParams,
        )}`;
    };
    return (
        <>
            <SWReactTableWrapperWithSelection
                preventCountTracking={props.preventCountTracking}
                tableSelectionKey={tableSelectionKey}
                tableSelectionProperty={tableSelectionProperty}
                getDataCallback={getDataCallback}
                serverApi={serverApi}
                onSort={onSort}
                tableColumns={columns}
                totalCountProperty="TotalRecords"
                recordsField="Data"
                totalRecordsField={TOTAL_RECORDS_FIELD}
                initialFilters={apiParams}
                tableOptions={{
                    noDataTitle: i18nFilter()("amazon.keyword.generator.table.nodata.title"),
                    noDataSubtitle: i18nFilter()("amazon.keyword.generator.table.nodata.subtitle"),
                    aboveHeaderComponents: [
                        <AddTableRowsKeywordsToGroupUtility
                            key="keyword-by-industry-table--aboveHeaderComponent"
                            clearAllSelectedRows={
                                tableActionsCreator(tableSelectionKey, tableSelectionProperty)
                                    .clearAllSelectedRows
                            }
                            stateKey={tableSelectionKey}
                        />,
                    ],
                }}
                changePageCallback={changePageCallback}
                fetchServerPages={1}
                pageIndent={1}
                rowsPerPage={100}
            >
                {(topComponentProps) => (
                    <KeywordByIndustryTabTableTop
                        allSourceTypes={allSourceTypes}
                        {...topComponentProps}
                        columns={columns}
                        excelDownloadUrl={getExcelUrl()}
                        totalRecords={totalRecords}
                    />
                )}
            </SWReactTableWrapperWithSelection>
        </>
    );
};

const mapDispatchToProps = (dispatch) => {
    return {};
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

export default connect(mapStateToProps, mapDispatchToProps)(KeywordByIndustryTabTable);
