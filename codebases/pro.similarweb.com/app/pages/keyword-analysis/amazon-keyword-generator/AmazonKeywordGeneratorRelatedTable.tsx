import * as React from "react";
import {
    AmazonKeywordGeneratorRelatedColumnsConfig,
    DEFAULT_SORT,
} from "pages/keyword-analysis/amazon-keyword-generator/AmazonKeywordGeneratorRelatedColumnsConfig";
import { Injector } from "common/ioc/Injector";
import { useState } from "react";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { i18nFilter } from "filters/ngFilters";
import { AmazonKeywordGeneratorTableTop } from "pages/keyword-analysis/amazon-keyword-generator/AmazonKeywordGeneratorTableTop";
import SWReactTableWrapper from "components/React/Table/SWReactTableWrapper";
import { connect } from "react-redux";
import * as queryString from "query-string";
import { booleanSearchToObject } from "pages/website-analysis/traffic-sources/search/booleanSearchUtility";
import { SwNavigator } from "common/services/swNavigator";

const TOTAL_RECORDS_FIELD = "TotalRecords";
const ROWS_COUNT = 300;

const AmazonKeywordGeneratorRelatedTable = (props) => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");

    const {
        params: {
            keyword,
            country,
            duration,
            webSource,
            BooleanSearchTerms,
            sort = DEFAULT_SORT,
            asc = false,
        },
        totalRecords,
    } = props;
    const { to, from } = swNavigator.getApiParams();
    const [pageNumber, setPageNumber] = useState(0);
    const [transformedData, setTransformedData] = useState({});
    const apiParams = {
        keyword,
        to,
        from,
        webSource,
        country,
        sort,
        asc,
    };
    const paginationParams = {
        page: pageNumber,
        rowsPerPage: ROWS_COUNT,
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

    const columns = AmazonKeywordGeneratorRelatedColumnsConfig.getColumns();

    const serverApi = "api/AmazonKeywordsGenerator/related";

    const getDataCallback = (data) => {
        const { getDataCallback } = props;
        getDataCallback && getDataCallback(data[TOTAL_RECORDS_FIELD]);
        return data;
    };
    const transformData = (data) => {
        setTransformedData(data);
        return data;
    };
    const changePageCallback = (page) => {
        TrackWithGuidService.trackWithGuid("amazon.keyword.generator.table.pagination", "switch", {
            page: page,
        });
        setPageNumber(page);
    };
    const onSort = ({ field, sortDirection }) => {
        swNavigator.applyUpdateParams({
            sort: `${field}`,
            asc: `${sortDirection === "asc"}`,
        });
    };
    const getExcelUrl = () => {
        return `${serverApi}/excel?${queryString.stringify(apiParams)}`;
    };
    const dataParamsAdapter = (params) => {
        //align page
        if (typeof params.page == "number") {
            params.page += 1;
        }
        return params;
    };
    return (
        <>
            <SWReactTableWrapper
                preventCountTracking={props.preventCountTracking}
                getDataCallback={getDataCallback}
                onDataError={props.onDataError}
                serverApi={serverApi}
                onSort={onSort}
                tableColumns={columns}
                totalCountProperty="TotalRecords"
                recordsField="Data"
                totalRecordsField={TOTAL_RECORDS_FIELD}
                initialFilters={{ ...apiParams, ...paginationParams }}
                dataParamsAdapter={dataParamsAdapter}
                transformData={transformData}
                tableOptions={{
                    noDataTitle: i18nFilter()("amazon.keyword.generator.table.nodata.title"),
                    noDataSubtitle: i18nFilter()("amazon.keyword.generator.table.nodata.subtitle"),
                }}
                changePageCallback={changePageCallback}
                fetchServerPages={3}
                rowsPerPage={100}
                pageIndent={0}
            >
                {(topComponentProps) => (
                    <AmazonKeywordGeneratorTableTop
                        {...topComponentProps}
                        columns={columns}
                        excelDownloadUrl={getExcelUrl()}
                        totalRecords={totalRecords}
                        booleanSearchTerms={props.params.BooleanSearchTerms}
                    />
                )}
            </SWReactTableWrapper>
        </>
    );
};

const mapDispatchToProps = (dispatch) => {
    return {};
};
const mapStateToProps = ({ routing }) => {
    const { params } = routing;
    return {
        params,
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(AmazonKeywordGeneratorRelatedTable);
