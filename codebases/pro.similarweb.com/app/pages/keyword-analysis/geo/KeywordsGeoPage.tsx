import { colorsPalettes } from "@similarweb/styles";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { swSettings } from "common/services/swSettings";
import { defaultGetStableKey } from "components/React/Table/SWReactTable";
import { SWReactTableOptimized } from "components/React/Table/SWReactTableOptimized";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { countryTextByIdFilter, i18nFilter } from "filters/ngFilters";
import _ from "lodash";
import {
    getTableConfig,
    organicPaidSources,
} from "pages/keyword-analysis/geo/KeywordsGeoTableConfig";
import {
    default as React,
    FunctionComponent,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import DurationService from "services/DurationService";
import { DefaultFetchService } from "services/fetchService";
import { openUnlockModal } from "services/ModalService";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import styled from "styled-components";
import { getCommonProps } from "../common/UtilityFunctions";
import { RelatedSearchTerms } from "../RelatedSearchTerms/RelatedSearchTerms";
import { KeywordsGeoEmptyState } from "./Components/KeywordsGeoEmptyState";
import { KeywordsGeoLowStateBanner } from "./Components/KeywordsGeoLowStateBanner";
import { KeywordsGeoTableTopBar } from "./KeywordsGeoTableTopBar";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

const KeywordsGeoTableStyle = styled.div`
    background-color: ${colorsPalettes.carbon[0]};
    .swTable-progressBar .min-value {
        min-width: 35px;
    }
`;

interface ITableData {
    Data: any[];
    Filters: any;
    TotalCount: number;
}

const onCountryCellClick = (ev: MouseEvent, country: number) => {
    if (!swSettings.allowedCountry(country)) {
        ev.preventDefault();
        openUnlockModal({
            modal: "CountryFilters",
            slide: "Countries",
        });
    } else {
        TrackWithGuidService.trackWithGuid("keywordAnalysis.geography.country", "click", {
            country: country,
        });
    }
};

const getStableKey = (index, col, row) => {
    if (row) {
        return row.Country;
    }
    return defaultGetStableKey(index, col);
};

const transformData = (res) => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const params = swNavigator.getParams();
    return {
        ...res,
        Data: res.Data.map((row) => {
            return {
                ...row,
                url: swNavigator.href("websites-worldwideOverview", {
                    ...params,
                    key: row.Leader,
                    isWWW: "*",
                }),
                TrafficTrend: row.TrafficTrend.map(({ Yearmonth, Traffic, Change }) => ({
                    Key: Yearmonth,
                    Value: Traffic,
                    change: Change,
                })),
            };
        }),
    };
};

const getDates = ({ to }) => {
    to = to.startOf("month");
    let from = to.clone().subtract(11, "months");
    const dates = [];
    while (from.valueOf() <= to.valueOf()) {
        dates.push(from.format("YYYY-MM-DD"));
        from = from.add(1, "months");
    }
    return dates;
};

const fillMissingDataPoints = (duration) => (res) => {
    const allDataPoints = getDates(duration.raw);
    const data = res?.Data;
    const emptyPoint = {
        Change: null,
        Traffic: 0,
    };
    if (!data) {
        return res;
    }
    return {
        ...res,
        Data: res.Data.map((item) => ({
            ...item,
            TrafficTrend: allDataPoints.map((d) => {
                const point = item?.TrafficTrend?.find(({ Yearmonth }) => Yearmonth === d);
                return point ?? { ...emptyPoint, Yearmonth: d };
            }),
        })),
    };
};

const KeywordsGeoPageInner: FunctionComponent<any> = ({ params }) => {
    const commonProps = getCommonProps(params);
    const KEYWORD_GROUP_LIMIT = 200;
    const duration = DurationService.getDurationData(params.duration);
    const { from, to } = duration.forAPI;
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const isKeywordGroup = keywordsGroupsService.isKeywordGroup(params.keyword);
    const getUserGroupById = (groupId) => {
        const group =
            keywordsGroupsService.userGroups.find((g) => g.Id === groupId) ||
            keywordsGroupsService.getSharedGroups().find((g) => g.Id === groupId);
        return group;
    };
    const keywordsGroupSize = isKeywordGroup ? getUserGroupById(params.keyword.substr(1)) : null;
    const getCountryCellLink = useCallback(
        (country) => {
            return swNavigator.href("keywordAnalysis_overview", { ...params, country });
        },
        [params],
    );
    const { keywordSource = organicPaidSources[0].id } = params;
    const [tableColumns, setTableColumns] = useState(getTableConfig(keywordSource));
    const [isLoading, setIsLoading] = useState(false);
    const [tableData, setTableData] = useState<ITableData>(null);
    const isEmptyFilterState = !tableData || tableData?.TotalCount === 0;
    const key = params.keyword.startsWith("*") ? params.keyword.substring(1) : params.keyword;
    const queryParams = {
        from,
        to,
        keys: key,
        keywordSource,
    };
    const selectedItem = useMemo(() => {
        return organicPaidSources.find((item) => item.id === keywordSource);
    }, [keywordSource]);

    const onChangeSource = (source) => {
        const keywordSource = source.id;
        swNavigator.applyUpdateParams({ keywordSource });
        setTableColumns(getTableConfig(keywordSource));
    };
    const getData = async () => {
        try {
            setIsLoading(true);
            const res = await DefaultFetchService.getInstance().get<ITableData>(
                `/widgetApi/KeywordAnalysisOP/KeywordAnalysisByGeo/Table`,
                queryParams,
            );
            setIsLoading(false);
            const fillMissingPoints = fillMissingDataPoints(duration);
            compose(setTableData, transformData, fillMissingPoints)(res);
        } catch (error) {
            setIsLoading(false);
            setTableData(null);
        }
    };

    const onSort = useCallback(
        ({ field, sortDirection }) => {
            tableData.Data = _.orderBy(
                tableData.Data.slice(),
                [(row) => (field === "Country" ? countryTextByIdFilter()(row[field]) : row[field])],
                [sortDirection],
            );
            setTableData(tableData);
            const newTableColumns = tableColumns.map((col) => {
                if (col.field === field) {
                    return {
                        ...col,
                        isSorted: true,
                        sortDirection,
                    };
                }
                return {
                    ...col,
                    isSorted: false,
                };
            });
            setTableColumns(newTableColumns);
        },
        [tableData, tableColumns],
    );

    useEffect(() => {
        getData();
    }, [params]);

    const renderTopTableBar = () => {
        return (
            <>
                <KeywordsGeoTableTopBar
                    queryParams={queryParams}
                    selectedItem={selectedItem}
                    allSources={organicPaidSources}
                    onSourceSelect={onChangeSource}
                    isDownloadExcel={!isEmptyFilterState}
                />
                {isEmptyFilterState && (
                    <KeywordsGeoEmptyState
                        width={320}
                        titleText={i18nFilter()("keywordAnalysis.geo.table.emptyFilter.title")}
                        bodyText={i18nFilter()("keywordAnalysis.geo.table.emptyFilter.text")}
                    />
                )}
            </>
        );
    };

    const renderGeoTable = () => {
        return (
            <KeywordsGeoTableStyle data-automation="keywords-geo-page-table">
                {!isLoading && renderTopTableBar()}
                {(isLoading || (!isLoading && tableData?.TotalCount > 0)) && (
                    <SWReactTableOptimized
                        isLoading={isLoading}
                        tableData={tableData}
                        tableColumns={tableColumns}
                        onSort={onSort}
                        getStableKey={getStableKey}
                        tableOptions={{
                            getCountryCellLink,
                            onCountryCellClick,
                            isKeywordGroup: isKeywordGroup,
                        }}
                    />
                )}
            </KeywordsGeoTableStyle>
        );
    };

    const renderGeoContent = () => {
        if (!isLoading) {
            if (isEmptyFilterState && keywordSource === "both") {
                return (
                    <KeywordsGeoEmptyState
                        width={320}
                        titleText={i18nFilter()("keywordAnalysis.geo.table.emptyState.title")}
                        bodyText={i18nFilter()("keywordAnalysis.geo.table.emptyState.text")}
                    />
                );
            } else if (tableData?.TotalCount > 0) {
                return (
                    <>
                        {tableData?.TotalCount < 4 && keywordSource === "both" && (
                            <KeywordsGeoLowStateBanner />
                        )}
                        {renderGeoTable()}
                    </>
                );
            }
        }
        return renderGeoTable();
    };

    const renderGeoPage = () => {
        if (isKeywordGroup) {
            if (!keywordsGroupSize?.Keywords) {
                return (
                    <KeywordsGeoEmptyState
                        width={320}
                        titleText={i18nFilter()("keywordAnalysis.geo.table.emptyState.title")}
                        bodyText={i18nFilter()("keywordAnalysis.geo.table.emptyState.text")}
                    />
                );
            } else if (keywordsGroupSize?.Keywords?.length > KEYWORD_GROUP_LIMIT) {
                return (
                    <KeywordsGeoEmptyState
                        width={440}
                        titleText={i18nFilter()("keywordAnalysis.geo.table.groupLimit.title")}
                        bodyText={i18nFilter()("keywordAnalysis.geo.table.groupLimit.text")}
                    />
                );
            }
            return renderGeoContent();
        } else {
            return renderGeoContent();
        }
    };

    return <>{renderGeoPage()}</>;
};

const mapStateToProps = ({ routing }) => ({
    ...routing,
});

function KeywordsGeoPagePreLoad(props) {
    const { stateConfig, params } = props;
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    if (
        stateConfig.name !== "keywordAnalysis-geo" &&
        stateConfig.name !== "keywordAnalysis_geography" &&
        stateConfig.name !== "marketresearch_keywordmarketanalysis_geo"
    ) {
        return false;
    }
    if (!stateConfig.overrideDatepickerPreset.includes(params.duration)) {
        setTimeout(() => {
            swNavigator.applyUpdateParams({ duration: swSettings.current.defaultParams.duration });
        });
        return false;
    }
    return <KeywordsGeoPageInner {...props} />;
}

SWReactRootComponent(connect(mapStateToProps)(KeywordsGeoPagePreLoad), "KeywordsGeoPage");
