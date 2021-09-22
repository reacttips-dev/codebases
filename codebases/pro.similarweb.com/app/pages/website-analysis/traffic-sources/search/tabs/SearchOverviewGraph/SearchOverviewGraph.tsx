import swLog from "@similarweb/sw-log";
import { TabPanel } from "@similarweb/ui-components/dist/tabs";
import { Injector } from "common/ioc/Injector";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import _ from "lodash";
import {
    ErrorComponent,
    NoDataComponent,
} from "pages/website-analysis/traffic-sources/search/tabs/SearchOverviewGraph/Components/EmptyState";
import { FiltersRow } from "pages/website-analysis/traffic-sources/search/tabs/SearchOverviewGraph/Components/FiltersRow";
import { SearchTrafficInsights } from "pages/website-analysis/traffic-sources/search/tabs/SearchOverviewGraph/SearchTrafficInsights/SearchTrafficInsights";
import React, {
    FunctionComponent,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useReducer,
    useRef,
} from "react";
import { connect } from "react-redux";
import { BasicDurations } from "services/DurationService";
import { DefaultFetchService } from "services/fetchService";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";
import { getMonthToDateEndPointValue } from "UtilitiesAndConstants/UtilityFunctions/monthsToDateUtilityFunctions";
import { TabsComponent } from "./Components/TabsComponent";
import { GraphTabHeader } from "./Components/GraphTabHeader";
import {
    CtaButton,
    CtaWrapper,
    SearchOverviewGraphContainer,
    TabContentStyle,
} from "./Components/StyledComponents";
import {
    brandedNonBranded,
    brandedNonBrandedCategory,
    mobileSearchTraffic,
    organicPaid,
    organicPaidCategory,
    searchTrafficGraphTabsConfig,
    searchType,
    searchTypeCategory,
    timeGranularityList,
} from "./Helpers/SearchOverviewGraphConfig";
import { AvgVisitDurationGraph } from "./Metrics/AvgVisitDurationGraph";
import { BounceRateGraph } from "./Metrics/BounceRateGraph";
import { PagesPerVisitGraph } from "./Metrics/PagesPerVisitGraph";
import { TrafficShareGraph } from "./Metrics/TrafficShareGraph";
import { actionCreators, useActionCreators } from "./SearchOverviewGraphActions";
import {
    ICategory,
    initState,
    ISearchOverviewState,
    searchOverviewGraphReducer,
} from "./SearchOverviewGraphReducer";
import { i18nFilter } from "filters/ngFilters";

export interface ISearchOverviewContext extends ISearchOverviewState {
    actions: typeof actionCreators;
    emptyState: JSX.Element;
    filtersRow: JSX.Element;
    chosenSites: any;

    getSiteColor(): any;

    getData(category?: ICategory, params?: Record<string, any>): Promise<any>;

    isMonthsToDateActive: boolean;
}

interface ISearchOverviewGraphProps {
    isMobileWeb: boolean;
    isSingle: boolean;
    params: object;
    boundaryError: boolean;
}

export const searchOverviewContext = React.createContext<ISearchOverviewContext>(null);
export const useSearchOverviewContext = (): ISearchOverviewContext =>
    useContext(searchOverviewContext);

const SearchOverviewGraphInner: FunctionComponent<ISearchOverviewGraphProps> = (props) => {
    const swNavigator = Injector.get<any>("swNavigator");
    const { isSingle, isMobileWeb, params, boundaryError } = props;
    const [state, dispatch] = useReducer(
        searchOverviewGraphReducer,
        {
            ...params,
            isSingle,
            isMobileWeb,
            selectedMetric: searchTrafficGraphTabsConfig[0],
        } as unknown,
        initState,
    );
    const actionCreators = useActionCreators(dispatch);
    const { fetchDataStart, fetchDataEnd, saveData, setActiveTab, setError } = actionCreators;
    const chosenSitesService = Injector.get("chosenSites") as any;
    const fetchService = DefaultFetchService.getInstance();
    const {
        selectedMetricTab,
        country,
        includeSubDomains,
        keys,
        granularity,
        webSource,
        from,
        to,
        isWindow,
        category,
        isLoading,
        totals,
        isError,
        channel,
        isMonthsToDateActive,
        duration,
    } = state;
    const queryParams = useMemo(
        () => ({
            country,
            includeSubDomains,
            keys,
            ...(!!granularity && { timeGranularity: granularity }),
            webSource,
            from,
            to,
            isWindow,
            ...(isMonthsToDateActive && getMonthToDateEndPointValue()),
        }),
        [
            country,
            includeSubDomains,
            keys,
            granularity,
            webSource,
            from,
            to,
            isWindow,
            isMonthsToDateActive,
        ],
    );
    const Metrics = [TrafficShareGraph, AvgVisitDurationGraph, PagesPerVisitGraph, BounceRateGraph]; // metrics to be rendered as Tabs

    const isCategorySupportsMonthToDate = category.id === organicPaid;
    const isDurationSupportsMonthToDate = duration !== BasicDurations.LAST_TWENTY_EIGHT_DAYS;
    const isMonthsToDateSupported = isDurationSupportsMonthToDate && isCategorySupportsMonthToDate;
    const getEndPoint = (category: ICategory) => {
        switch (category.id) {
            case organicPaid:
            case mobileSearchTraffic:
                return "widgetApi/TrafficSourcesSearch/SearchOrganicPaidOverview/BarChart";
            case brandedNonBranded:
                return "widgetApi/TrafficSourcesSearch/SearchBrandedKeywords/BarChart";
            case searchType:
                return "widgetApi/TrafficSourcesSearch/SearchTrafficByChannel/BarChart";
        }
    };

    const getData = useCallback(
        (cat = category, params = queryParams) => {
            const endPoint = getEndPoint(cat);
            return fetchService.get(endPoint, params);
        },
        [queryParams, category, channel],
    );
    const getMetricTotals = async (dataPromise) => {
        function calcTotals(res) {
            return searchTrafficGraphTabsConfig.reduce((totals, { name }) => {
                return {
                    ...totals,
                    [name]: res?.Data?.[name]?.Data?.Total?.["All Channels"],
                };
            }, {});
        }

        const shouldDisplayMetricTotals = isSingle && !isMobileWeb;
        if (!shouldDisplayMetricTotals) {
            return null;
        }
        if (category === organicPaidCategory) {
            return calcTotals(await dataPromise);
        }
        return calcTotals(await getData(organicPaidCategory));
    };

    const fetchData = async (timeStamp, params) => {
        try {
            fetchDataStart();
            const enrichedDataPromises = Object.values(timeGranularityList).reduce(
                (results, { name }) => {
                    const queryParams = { ...params, timeGranularity: name };
                    const dataPromiseOrganicPaid = getData(organicPaidCategory, queryParams);
                    const dataPromiseBrandedNonBranded = getData(brandedNonBrandedCategory, {
                        ...queryParams,
                        latest: undefined,
                    });
                    const dataPromiseSearchType = getData(searchTypeCategory, {
                        ...queryParams,
                        latest: undefined,
                    });
                    return {
                        ...results,
                        [name]: [
                            dataPromiseOrganicPaid,
                            dataPromiseBrandedNonBranded,
                            dataPromiseSearchType,
                        ],
                    };
                },
                {},
            );
            const [
                dataPromiseOrganicPaid,
                dataPromiseBrandedNonBranded,
                dataPromiseSearchType,
            ] = enrichedDataPromises[String(granularity)];

            const dataPromise: any =
                category.id === organicPaidCategory.id
                    ? dataPromiseOrganicPaid
                    : category.id === brandedNonBrandedCategory.id
                    ? dataPromiseBrandedNonBranded
                    : dataPromiseSearchType;
            const promiseArray = [
                dataPromise,
                getMetricTotals(dataPromise),
                ...enrichedDataPromises[timeGranularityList.weekly.name],
                ...enrichedDataPromises[timeGranularityList.monthly.name],
            ];
            const results = await Promise.allSettled(promiseArray);
            const [
                response,
                totals,
                organicPaidDataWeekly,
                brandedNonBrandedDataWeekly,
                searchTypeDataWeekly,
                organicPaidDataMonthly,
                brandedNonBrandedDataMonthly,
                searchTypeDataMonthly,
            ] = results as { value?: any }[];
            if (timeStamp !== fetchDataRaceConditionProtected.current) {
                // newer call is in progress...
                // protection against race async race condition
                return;
            }
            const rawData = response.value?.Data ? response.value.Data : response.value;
            saveData(
                {
                    ...rawData,
                    enrichedData: {
                        Weekly: {
                            organicPaidData: organicPaidDataWeekly.value,
                            brandedNonBrandedData: brandedNonBrandedDataWeekly.value,
                            searchTypeData: searchTypeDataWeekly.value,
                        },
                        Monthly: {
                            organicPaidData: organicPaidDataMonthly.value,
                            brandedNonBrandedData: brandedNonBrandedDataMonthly.value,
                            searchTypeData: searchTypeDataMonthly.value,
                        },
                    },
                },
                totals.value,
            );
        } catch (error) {
            setError();
            swLog.error(error);
        } finally {
            fetchDataEnd();
        }
    };
    const fetchDataMobile = async () => {
        try {
            fetchDataStart();
            const dataPromiseMobile = getData(category, { ...queryParams, latest: undefined });
            const response = (await dataPromiseMobile) as { Data: any };
            saveData(response.Data ? response.Data : response, null);
        } catch (error) {
            setError();
            swLog.error(error);
        } finally {
            fetchDataEnd();
        }
    };
    const fetchDataRaceConditionProtected = useRef<number>(null);
    useEffect(() => {
        const timeStamp = Date.now();
        fetchDataRaceConditionProtected.current = timeStamp;
        const params =
            isDurationSupportsMonthToDate && isMonthsToDateActive
                ? queryParams
                : { ...queryParams, latest: undefined };
        webSource === devicesTypes.MOBILE ? fetchDataMobile() : fetchData(timeStamp, params);
    }, [queryParams, category, channel]);

    ////////////////////////////////////////////

    const graphTabs = useMemo(() => {
        // in case rawData changed
        if (isSingle) {
            return searchTrafficGraphTabsConfig.map((tab) => {
                // @ts-ignore
                return {
                    ...tab,
                    value: totals?.[tab.name],
                };
            });
        }
        return searchTrafficGraphTabsConfig;
    }, [totals]);

    const isNoData = () => {
        if (isLoading) {
            return false;
        }
        return isSingle
            ? !state.rawData?.[selectedMetricTab.name]?.Data?.Total["All Channels"]
            : !(
                  _.sum(
                      Object.values(
                          state.rawData?.[selectedMetricTab.name]?.["All Channels"]?.Total ?? {},
                      ),
                  ) > 0
              );
    };

    const finalContext = useMemo(
        () => ({
            ...state,
            actions: actionCreators,
            getSiteColor: chosenSitesService.getSiteColor,
            getData,
            chosenSites: chosenSitesService.get(),
            filtersRow: <FiltersRow />,
            emptyState:
                isError || boundaryError ? (
                    <ErrorComponent />
                ) : isNoData() ? (
                    <NoDataComponent isSingle={isSingle} />
                ) : null,
        }),
        [state, actionCreators],
    );

    const setSelectedTab = (selectedTab) => {
        TrackWithGuidService.trackWithGuid(
            "website_analysis.marketing_channels.search_overview.metric_tab",
            "click",
            { metric: selectedTab.name },
        );
        setActiveTab(selectedTab);
    };

    const ctaClicked = () => {
        swNavigator.go("websites-trafficSearch-keywords", {
            ...swNavigator.getParams(),
        });
    };
    const getNoInsightsReasonKey = () => {
        const isMobile = webSource === devicesTypes.MOBILE;
        if (isMobile) return "search.overview.insights.no.insights.due.to.mobile";
        if (!isSingle) return "search.overview.insights.no.insights.due.to.compare";
        return null;
    };

    return (
        state.rawData && (
            <searchOverviewContext.Provider value={finalContext}>
                <SearchOverviewGraphContainer>
                    {(isMobileWeb || !isMobileWeb) && (
                        <GraphTabHeader
                            isMobileWeb={isMobileWeb}
                            isSingle={isSingle}
                            queryParams={queryParams}
                            params={params}
                            isMonthsToDateSupported={isMonthsToDateSupported}
                        />
                    )}
                    <SearchTrafficInsights
                        setActiveTab={setActiveTab}
                        graphTabs={graphTabs}
                        noInsightsReasonKey={getNoInsightsReasonKey()}
                    />
                    <div ref={state.chartRef}>
                        {!isMobileWeb && (
                            <TabsComponent
                                setSelected={setSelectedTab}
                                selectedTab={selectedMetricTab}
                                tabs={graphTabs}
                            >
                                {Metrics.map((MetricName, index) => {
                                    return (
                                        <TabPanel key={index}>
                                            <TabContentStyle>
                                                <MetricName />
                                            </TabContentStyle>
                                        </TabPanel>
                                    );
                                })}
                            </TabsComponent>
                        )}
                        {isMobileWeb && (
                            <TabContentStyle>
                                <TrafficShareGraph />
                            </TabContentStyle>
                        )}
                    </div>
                </SearchOverviewGraphContainer>
                <CtaWrapper>
                    <CtaButton
                        onClick={ctaClicked}
                        type="flat"
                        label={i18nFilter()("search.trafficandengagement.searchtraffic.cta")}
                    />
                </CtaWrapper>
            </searchOverviewContext.Provider>
        )
    );
};

const propsAreEqual = (prevProps, nextProps) => prevProps.params === nextProps.params;

const mapStateToProps = (props) => {
    const {
        routing: { params },
    } = props;
    return {
        params,
    };
};

const SearchOverviewGraphConnected = connect(mapStateToProps)(
    React.memo(SearchOverviewGraphInner, propsAreEqual),
);

class ErrorBoundary extends React.Component {
    public static getDerivedStateFromError(error) {
        return { boundaryError: true };
    }

    public state = { boundaryError: false };

    public render() {
        return (
            <SearchOverviewGraphConnected
                {...this.props}
                boundaryError={this.state.boundaryError}
            />
        );
    }
}

SWReactRootComponent(ErrorBoundary, "SearchOverviewGraph");
