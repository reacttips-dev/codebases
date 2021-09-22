import React, { FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import DurationService, { BasicDurations } from "services/DurationService";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { TabPanel } from "@similarweb/ui-components/dist/tabs";
import _ from "lodash";
import {
    PaidSearchGraphContainer,
    TabContentStyle,
} from "pages/website-analysis/traffic-sources/paid-search/components/paid-search-graph/components/StyledComponents";
import {
    ErrorComponent,
    NoDataComponent,
} from "pages/website-analysis/traffic-sources/paid-search/components/paid-search-graph/components/EmptyState";
import { ScorableTabs } from "components/React/ScorableTabs/ScorableTabs";
import { ComparableTabs } from "components/React/ComparableTabs/ComparableTabs";
import * as queryString from "querystring";
import {
    availableDataTypes,
    EErrorTypes,
    EMetrics,
    IPaidSearchMetricsConfig,
    ITimeGranularity,
    paidSearchMetricsConfig,
    timeGranularityObjects,
} from "pages/website-analysis/traffic-sources/paid-search/components/paid-search-graph/helpers/PaidSearchGraphConstants";
import { PaidSearchGraphHeader } from "pages/website-analysis/traffic-sources/paid-search/components/paid-search-graph/components/PaidSearchGraphHeader";
import { connect } from "react-redux";
import { BasicGraph } from "./components/BasicGraph";
import { SearchTrafficConfig } from "pages/website-analysis/traffic-sources/paid-search/components/paid-search-graph/config/SearchTrafficConfig";
import { AvgVisitDurationConfig } from "pages/website-analysis/traffic-sources/paid-search/components/paid-search-graph/config/AvgVisitDurationConfig";
import { PagesPerVisitConfig } from "pages/website-analysis/traffic-sources/paid-search/components/paid-search-graph/config/PagesPerVisitConfig";
import { BounceRateConfig } from "pages/website-analysis/traffic-sources/paid-search/components/paid-search-graph/config/BounceRateConfig";
import { getMonthToDateEndPointValue } from "UtilitiesAndConstants/UtilityFunctions/monthsToDateUtilityFunctions";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { Loader } from "pages/website-analysis/traffic-sources/paid-search/components/common/Loader";
import { AdSpendConfig } from "pages/website-analysis/traffic-sources/paid-search/components/paid-search-graph/config/AdSpendConfig";
import { transformAdSpendData } from "pages/website-analysis/traffic-sources/paid-search/components/paid-search-graph/helpers/PaidSearchGraphDataParsers";
import CountryService from "services/CountryService";
import { IDataType } from "components/React/GraphTypeSwitcher/GraphTypeSwitcher";
import { DefaultFetchService } from "services/fetchService";
import { swSettings } from "common/services/swSettings";

interface IPaidSearchGraphProps {
    params?: {
        country: string;
        from: string;
        to: string;
        includeSubDomains: boolean;
        isWindow: boolean;
        webSource: string;
        category: string;
        isWWW: string;
        key: string;
        duration: string;
    };
    chosenSitesService: any;
    fetchService: DefaultFetchService;
}

interface IError {
    type: EErrorTypes;
    metric: EMetrics;
}

const PaidSearchGraph: FunctionComponent<IPaidSearchGraphProps> = (props) => {
    const { params } = props;
    const { country, webSource, key, duration, isWWW } = params;
    const [rawData, setRawData] = useState<object>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<IError[]>([]);
    const { chosenSitesService, fetchService } = props;
    const mode = chosenSitesService.isCompare() ? "compare" : "single";
    const isSingle = !chosenSitesService.isCompare();
    const durationObject = DurationService.getDurationData(duration);
    const getDateRange = (durationObject) => {
        return [durationObject.raw.from, durationObject.raw.to];
    };
    const [fromDate, toDate] = getDateRange(durationObject);
    const { from, to, isWindow } = durationObject.forAPI;
    const [selectedMetricTab, setSelectedMetricTab] = useState<IPaidSearchMetricsConfig>(
        paidSearchMetricsConfig[0],
    );
    const component = swSettings.current;
    const [totals, setTotals] = useState<object>(null);
    const [graphType, setGraphType] = useState<IDataType>(availableDataTypes[0]);
    const chartRef = React.createRef<HTMLDivElement>();
    const [isMTDActive, setMTD] = useState<boolean>(true);
    const isMTDSupported =
        duration !== BasicDurations.LAST_TWENTY_EIGHT_DAYS &&
        durationObject.raw.to.valueOf() === component.endDate.valueOf();
    const getDefaultTimeGranularity = () => {
        const monthsDiff = toDate.diff(fromDate, "months") + 1;
        if (
            duration === BasicDurations.LAST_SIX_MONTHS ||
            duration === BasicDurations.LAST_TWELVE_MONTHS ||
            duration === BasicDurations.LAST_EIGHTEEN_MONTHS ||
            duration === BasicDurations.LAST_TWENTY_FOUR_MONTHS ||
            monthsDiff > 3
        ) {
            return timeGranularityObjects.monthly;
        }
        return timeGranularityObjects.weekly;
    };
    const [granularity, setGranularity] = useState<ITimeGranularity>(getDefaultTimeGranularity);
    const [unselectedLegends, setUnselectedLegends] = useState<any>([]);
    const queryParams = useMemo(
        () => ({
            appMode: mode,
            country,
            from,
            includeSubDomains: isWWW === "*",
            isWindow,
            keys: key,
            timeGranularity: granularity.name,
            to,
            webSource,
            ...(isMTDSupported && isMTDActive && getMonthToDateEndPointValue()),
        }),
        [mode, country, isWWW, isWindow, key, webSource, from, to, granularity, isMTDActive],
    );
    const ppcQueryParams = {
        ...queryParams,
        latest: undefined,
        timeGranularity: timeGranularityObjects.monthly.name,
    };

    ///////////// API methods //////////////////

    const getEndPoint = (category) => {
        switch (category) {
            case EMetrics.OTHER:
                return "widgetApi/TrafficSourcesSearch/SearchOrganicPaidOverview/BarChart";
            case EMetrics.ADSPEND:
                return "widgetApi/AdSpend/AdSpend/BarChart";
        }
    };

    // TODO: this kind of logic should be in components config
    const isAdSpendDurationSupported = () => {
        return !(
            duration === BasicDurations.LAST_TWENTY_EIGHT_DAYS ||
            duration === BasicDurations.LAST_EIGHTEEN_MONTHS ||
            duration === BasicDurations.LAST_TWENTY_FOUR_MONTHS ||
            toDate.isBefore(swSettings.components.AdSpend.resources.FirstAvailableDate)
        );
    };

    const getData = useCallback(
        (category) => {
            const endPoint = getEndPoint(category);
            const params =
                category === EMetrics.ADSPEND ? { ...ppcQueryParams } : { ...queryParams };
            const apiParams = endPoint + "?" + queryString.stringify(params);
            return fetchService.get(apiParams);
        },
        [queryParams],
    );

    const getMetricTotals = (data) => {
        function calcTotals(res) {
            return paidSearchMetricsConfig.reduce((total, { name, channel }) => {
                return {
                    ...total,
                    [name]: res?.[name]?.Data?.Total?.[channel],
                };
            }, {});
        }
        if (!isSingle) {
            return null;
        }
        return calcTotals(data);
    };

    const fetchData = async (timeStamp) => {
        try {
            setIsLoading(true);
            setIsError([]);

            const [paidSearchRes, adSpendRes] = await Promise.allSettled([
                getData(EMetrics.OTHER),
                getData(EMetrics.ADSPEND),
            ]);

            if (timeStamp !== fetchDataRaceConditionProtected.current) {
                // newer call is in progress...
                // protection against race async race condition
                return;
            }

            const errors = [];

            if (paidSearchRes.status === "rejected") {
                errors.push({ metric: EMetrics.OTHER, type: EErrorTypes.ERROR });
            }

            if (adSpendRes.status === "rejected") {
                const error: IError = {
                    metric: EMetrics.ADSPEND,
                    type: !isAdSpendDurationSupported() ? EErrorTypes.TIMEFRAME : EErrorTypes.ERROR,
                };

                errors.push(error);
            }

            if (CountryService.isUSState(country)) {
                errors.push({ metric: EMetrics.ADSPEND, type: EErrorTypes.USSTATEֹ });
            }

            if (errors.length > 0) {
                setIsError(errors);
            }

            const adSpendData = adSpendRes.status === "fulfilled" ? adSpendRes.value["Data"] : {};
            const transformedAdSpendData = transformAdSpendData({ isSingle, key, adSpendData });
            const paidSearchData =
                paidSearchRes.status === "fulfilled" ? paidSearchRes.value["Data"] : {};

            setTotals(getMetricTotals({ ...paidSearchData, ...adSpendData }));

            setRawData({ ...paidSearchData, ...transformedAdSpendData });
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDataRaceConditionProtected = useRef<number>(null);

    useEffect(() => {
        const timeStamp = Date.now();
        fetchDataRaceConditionProtected.current = timeStamp;
        fetchData(timeStamp);
    }, [queryParams]);

    ///////////// Nodata / Empty state //////////////////

    const isNoData = () => {
        if (isLoading) {
            return false;
        }
        if (selectedMetricTab.name === paidSearchMetricsConfig[0].name) {
            return isSingle
                ? !rawData?.[selectedMetricTab.name]?.Data?.Total["Paid Visits"]
                : !(
                      _.sum(
                          Object.values(
                              rawData?.[selectedMetricTab.name]?.["Paid Visits"]?.Total ?? {},
                          ),
                      ) > 0
                  );
        }
        return isSingle
            ? !rawData?.[selectedMetricTab.name]?.Data?.Total[selectedMetricTab.channel]
            : !(
                  _.sum(
                      Object.values(
                          rawData?.[selectedMetricTab.name]?.[selectedMetricTab.channel]?.Total ??
                              {},
                      ),
                  ) > 0
              );
    };

    const getIsEmptyState = (metric: EMetrics): React.ReactElement | null => {
        const res = isError.filter((errorObj) => metric === errorObj.metric);
        return res[0] ? (
            <ErrorComponent type={res[0].type} />
        ) : isNoData() ? (
            <NoDataComponent />
        ) : null;
    };

    ///////////// User Actions //////////////////

    const setSelectedTab = (selectedTab) => {
        TrackWithGuidService.trackWithGuid(
            "websiteanalysis.trafficsources.paidsearch.metric_tab",
            "click",
            { metricTab: selectedTab.name },
        );
        setSelectedMetricTab(selectedTab);
    };

    const setTimeGranularity = (selectedGranularity) => {
        TrackWithGuidService.trackWithGuid(
            "websiteanalysis.trafficsources.paidsearch.granularity",
            "switch",
            { metricTab: selectedMetricTab.name, granularity: selectedGranularity },
        );
        setGranularity(timeGranularityObjects[selectedGranularity.toLowerCase()]);
    };

    const onToggleLegendItem = (targetLegendRawName) => {
        const targetLegendRawNameIndex = unselectedLegends.indexOf(targetLegendRawName);
        let modifiedArr;
        if (targetLegendRawNameIndex === -1) {
            // targetLegend is not found in the array - need to add it (deselect)
            modifiedArr = [...unselectedLegends, targetLegendRawName];
        } else {
            modifiedArr = unselectedLegends.filter((name) => name !== targetLegendRawName);
        }
        setUnselectedLegends(modifiedArr);
    };

    ///////////// Tabs Configuration //////////////////

    const TabsComponent = isSingle ? ScorableTabs : ComparableTabs;

    const graphTabs = useMemo(() => {
        // in case rawData changed
        if (isSingle) {
            return paidSearchMetricsConfig.map((tab) => {
                return {
                    ...tab,
                    value: totals?.[tab.name],
                };
            });
        }
        return paidSearchMetricsConfig;
    }, [totals]);

    const basicGraphProps = {
        rawData,
        isSingle,
        getSiteColor: chosenSitesService.getSiteColor,
        chosenSites: chosenSitesService.get(),
        isLoading,
        isMonthsToDateActive: isMTDActive,
        to,
        from,
        granularity:
            selectedMetricTab.name === paidSearchMetricsConfig[0].name // ad Spend supports only monthly
                ? timeGranularityObjects.monthly
                : granularity,
        setTimeGranularity,
        selectedMetricTab,
        graphType,
        setGraphType,
        unselectedLegends,
        onToggleLegendItem,
    };

    const renderTabsComponent = () => {
        return (
            <div ref={chartRef}>
                <TabsComponent
                    setSelected={setSelectedTab}
                    selectedTab={selectedMetricTab}
                    tabs={graphTabs}
                >
                    <TabPanel key={0}>
                        <TabContentStyle>
                            {isLoading ? (
                                <Loader />
                            ) : (
                                <BasicGraph
                                    {...basicGraphProps}
                                    {...AdSpendConfig({
                                        rawData,
                                        duration,
                                        isWindow,
                                        granularity: timeGranularityObjects.monthly, // ad Spend supports only monthly
                                        webSource,
                                        to,
                                        from,
                                        graphType,
                                    })}
                                    emptyState={getIsEmptyState(EMetrics.ADSPEND)}
                                />
                            )}
                        </TabContentStyle>
                    </TabPanel>
                    <TabPanel key={1}>
                        <TabContentStyle>
                            {isLoading ? (
                                <Loader />
                            ) : (
                                <BasicGraph
                                    {...basicGraphProps}
                                    {...SearchTrafficConfig({
                                        rawData,
                                        duration,
                                        isWindow,
                                        granularity,
                                        webSource,
                                        to,
                                        from,
                                        graphType,
                                        isMonthsToDateActive: isMTDActive,
                                        isSingle,
                                    })}
                                    emptyState={getIsEmptyState(EMetrics.OTHER)}
                                />
                            )}
                        </TabContentStyle>
                    </TabPanel>
                    <TabPanel key={2}>
                        <TabContentStyle>
                            {isLoading ? (
                                <Loader />
                            ) : (
                                <BasicGraph
                                    {...basicGraphProps}
                                    {...AvgVisitDurationConfig({
                                        rawData,
                                        duration,
                                        isWindow,
                                        granularity,
                                        webSource,
                                        to,
                                        from,
                                        isMonthsToDateActive: isMTDActive,
                                    })}
                                    emptyState={getIsEmptyState(EMetrics.OTHER)}
                                />
                            )}
                        </TabContentStyle>
                    </TabPanel>
                    <TabPanel key={3}>
                        <TabContentStyle>
                            {isLoading ? (
                                <Loader />
                            ) : (
                                <BasicGraph
                                    {...basicGraphProps}
                                    {...PagesPerVisitConfig({
                                        rawData,
                                        duration,
                                        isWindow,
                                        granularity,
                                        webSource,
                                        to,
                                        from,
                                        isMonthsToDateActive: isMTDActive,
                                    })}
                                    emptyState={getIsEmptyState(EMetrics.OTHER)}
                                />
                            )}
                        </TabContentStyle>
                    </TabPanel>
                    <TabPanel key={4}>
                        <TabContentStyle>
                            {isLoading ? (
                                <Loader />
                            ) : (
                                <BasicGraph
                                    {...basicGraphProps}
                                    {...BounceRateConfig({
                                        rawData,
                                        duration,
                                        isWindow,
                                        granularity,
                                        webSource,
                                        to,
                                        from,
                                        isMonthsToDateActive: isMTDActive,
                                    })}
                                    emptyState={getIsEmptyState(EMetrics.OTHER)}
                                />
                            )}
                        </TabContentStyle>
                    </TabPanel>
                </TabsComponent>
            </div>
        );
    };

    return (
        <PaidSearchGraphContainer>
            <PaidSearchGraphHeader
                queryParams={queryParams}
                ppcQueryParams={ppcQueryParams}
                isMTDSupported={isMTDSupported}
                isMTDActive={isMTDActive}
                setMTD={setMTD}
                selectedMetricTab={selectedMetricTab}
                chartRef={chartRef}
                duration={duration}
                country={country}
                webSource={webSource}
                fromDate={fromDate}
                toDate={toDate}
                isSingle={isSingle}
            />
            {renderTabsComponent()}
        </PaidSearchGraphContainer>
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

const PaidSearchGraphConnected = connect(mapStateToProps)(
    React.memo(PaidSearchGraph, propsAreEqual),
);

SWReactRootComponent(PaidSearchGraphConnected, "PaidSearchGraph");
export default PaidSearchGraphConnected;
