import { Injector } from "common/ioc/Injector";
import { abbrNumberFilter, i18nFilter } from "filters/ngFilters";
import { YoutubeKeywordGeneratorTableTop } from "./YoutubeKeywordGeneratorTableTop";
import SWReactTableWrapper from "components/React/Table/SWReactTableWrapper";
import { connect } from "react-redux";
import { booleanSearchTermsMixin } from "pages/website-analysis/traffic-sources/search/booleanSearchUtility";
import { SwNavigator } from "common/services/swNavigator";
import { YoutubeKeywordGeneratorRelatedColumnsConfig } from "./YoutubeKeywordGeneratorTableColumns";
import { ETabs } from "./constants";
import { DefaultFetchService } from "services/fetchService";
import dayjs from "dayjs";

const fetchService = DefaultFetchService.getInstance();

type TabConfig = { endpoint: string; showScoreColumn: boolean; sortBy: string };
const tabConfigMap: Record<ETabs, TabConfig> = {
    [ETabs.PHRASE_MATCH]: {
        endpoint: "api/recommendations/YoutubeKeywords/phraseMatch",
        showScoreColumn: false,
        sortBy: "Volume",
    },
    [ETabs.RELATED_KEYWORDS]: {
        endpoint: "api/recommendations/YoutubeKeywords/related",
        showScoreColumn: true,
        sortBy: "Score",
    },
};

const TOTAL_RECORDS_FIELD = "ResultCount";
const ROWS_COUNT = 100;
const PAGES_TO_FETCH = 4;

const YoutubeKeywordGeneratorRelatedTable = (props) => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");

    const {
        params: {
            keyword,
            country,
            webSource,
            BooleanSearchTerms,
            sort = tabConfigMap[props.tab as ETabs].sortBy,
            asc = false,
        },
        totalRecords,
        tab,
    } = props;
    const tabConfig = tabConfigMap[tab as ETabs];
    const { to, from } = swNavigator.getApiParams();
    let apiParams = {
        keyword,
        to,
        from,
        webSource,
        country,
        sort,
        asc,
    };
    const paginationParams = {
        pageSize: ROWS_COUNT * PAGES_TO_FETCH,
    };

    if (BooleanSearchTerms) {
        apiParams = booleanSearchTermsMixin(BooleanSearchTerms, apiParams);
    }

    const columns = YoutubeKeywordGeneratorRelatedColumnsConfig.getColumns(
        sort,
        tabConfig.showScoreColumn,
    );

    const getDataCallback = (data) => {
        const { getDataCallback } = props;
        getDataCallback && getDataCallback(data[TOTAL_RECORDS_FIELD]);
        return data;
    };
    const onSort = ({ field, sortDirection }) => {
        swNavigator.applyUpdateParams({
            sort: `${field}`,
            asc: `${sortDirection === "asc"}`,
        });
    };
    const getExcelUrl = () => {
        return `${tabConfig.endpoint}/excel?${fetchService.requestParams(apiParams)}`;
    };

    const transformData = (data) => {
        return {
            ...data,
            Records: data.Records.map((record) => ({
                ...record,
                VolumeTrend: Object.keys(record.VolumeTrend)
                    .sort()
                    .map((date) => ({
                        value: record.VolumeTrend[date],
                        tooltip: (
                            <span>
                                <strong>{`${abbrNumberFilter()(record.VolumeTrend[date])}`}</strong>
                                {` searches in ${dayjs.utc(date).format("MMM, YYYY")}`}
                            </span>
                        ),
                    })),
            })),
        };
    };

    const dataParamsAdapter = (args) => {
        //align page
        if (typeof args.page == "number") {
            args.page += 1;
        }
        return args;
    };

    return (
        <>
            <SWReactTableWrapper
                preventCountTracking={props.preventCountTracking}
                getDataCallback={getDataCallback}
                onDataError={props.onDataError}
                serverApi={tabConfig.endpoint}
                onSort={onSort}
                tableColumns={columns}
                totalCountProperty={TOTAL_RECORDS_FIELD}
                recordsField="Records"
                totalRecordsField={TOTAL_RECORDS_FIELD}
                initialFilters={{ ...apiParams, ...paginationParams }}
                tableOptions={{
                    noDataTitle: i18nFilter()("youtube.keyword.generator.table.nodata.title"),
                    noDataSubtitle: i18nFilter()("youtube.keyword.generator.table.nodata.subtitle"),
                }}
                transformData={transformData}
                dataParamsAdapter={dataParamsAdapter}
                fetchServerPages={PAGES_TO_FETCH}
                rowsPerPage={ROWS_COUNT}
            >
                {(topComponentProps) => (
                    <YoutubeKeywordGeneratorTableTop
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

const mapStateToProps = ({ routing }) => {
    const { params } = routing;
    return {
        params,
    };
};
export default connect(mapStateToProps)(YoutubeKeywordGeneratorRelatedTable);
