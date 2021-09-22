import React, { FunctionComponent, useEffect, useMemo, useRef, useState } from "react";
import DurationService, { BasicDurations } from "services/DurationService";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { TabPanel } from "@similarweb/ui-components/dist/tabs";
import swLog from "@similarweb/sw-log";
import _ from "lodash";
import {
    DisplayAdsGraphContainer,
    TabContentStyle,
} from "pages/website-analysis/traffic-sources/display-ads/overview/overview-graph/components/StyledComponents";
import {
    ErrorComponent,
    NoDataComponent,
} from "pages/website-analysis/traffic-sources/display-ads/overview/overview-graph/components/EmptyState";
import { ScorableTabs } from "components/React/ScorableTabs/ScorableTabs";
import { ComparableTabs } from "components/React/ComparableTabs/ComparableTabs";
import {
    availableDataTypes,
    displayAdsGraphConfig,
    IDisplayAdsGraphConfig,
    ITimeGranularity,
    timeGranularityObjects,
} from "pages/website-analysis/traffic-sources/display-ads/overview/overview-graph/helpers/DisplayAdsGraphConstants";
import { DisplayAdsGraphHeader } from "pages/website-analysis/traffic-sources/display-ads/overview/overview-graph/components/DisplayAdsGraphHeader";
import { connect } from "react-redux";
import { BasicGraph } from "./components/BasicGraph";
import { DisplayTrafficConfig } from "pages/website-analysis/traffic-sources/display-ads/overview/overview-graph/config/DisplayTrafficConfig";
import { AvgVisitDurationConfig } from "pages/website-analysis/traffic-sources/display-ads/overview/overview-graph/config/AvgVisitDurationConfig";
import { PagesPerVisitConfig } from "pages/website-analysis/traffic-sources/display-ads/overview/overview-graph/config/PagesPerVisitConfig";
import { BounceRateConfig } from "pages/website-analysis/traffic-sources/display-ads/overview/overview-graph/config/BounceRateConfig";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { Loader } from "pages/website-analysis/traffic-sources/display-ads/common/Loader";
import { IDataType } from "components/React/GraphTypeSwitcher/GraphTypeSwitcher";
import { DefaultFetchService } from "services/fetchService";
import { Injector } from "common/ioc/Injector";
import { LoaderWrapper } from "pages/website-analysis/traffic-sources/display-ads/common/StyledComponents";

interface IDisplayAdsGraphProps {
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
}

export const DisplayAdsGraph: FunctionComponent<IDisplayAdsGraphProps> = () => {
    const swNavigator = Injector.get("swNavigator") as any;
    const params = swNavigator.getParams();
    const chosenSitesService = Injector.get("chosenSites") as any;
    const getSiteColor = chosenSitesService.getSiteColor;
    const chosenSites = chosenSitesService.get();
    const fetchService = DefaultFetchService.getInstance();
    const { country, webSource, key, duration, isWWW } = params;
    const [rawData, setRawData] = useState<object>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const isCompare = params.key.split(",").length > 1;
    const mode = isCompare ? "compare" : "single";
    const isSingle = !isCompare;
    const durationObject = DurationService.getDurationData(duration);
    const getDateRange = (durationObject) => {
        return [durationObject.raw.from, durationObject.raw.to];
    };
    const [fromDate, toDate] = getDateRange(durationObject);
    const { from, to, isWindow } = durationObject.forAPI;
    const [selectedMetricTab, setSelectedMetricTab] = useState<IDisplayAdsGraphConfig>(
        displayAdsGraphConfig[0],
    );
    const [totals, setTotals] = useState<object>(null);
    const [graphType, setGraphType] = useState<IDataType>(availableDataTypes[0]);
    const chartRef = React.createRef<HTMLDivElement>();
    const getDefaultTimeGranularity = () => {
        if (duration === BasicDurations.LAST_TWENTY_EIGHT_DAYS) {
            return timeGranularityObjects.daily;
        }
        return timeGranularityObjects.monthly;
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
        }),
        [mode, country, isWWW, isWindow, key, webSource, from, to],
    );

    ///////////// API methods //////////////////

    const getMetricTotals = (data) => {
        function calcTotals(res) {
            return displayAdsGraphConfig.reduce((total, { name, channel }) => {
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
            setIsError(false);

            const response = await fetchService.get<{ Data: object[] }>(
                `widgetApi/WebsiteDisplayAds/WebsiteAdsOverTimeOverview/BarChart`,
                queryParams,
            );

            if (timeStamp !== fetchDataRaceConditionProtected.current) {
                // newer call is in progress...
                // protection against race async race condition
                return;
            }

            const displayAdsData = response.Data;
            setTotals(getMetricTotals({ ...displayAdsData }));
            setRawData(displayAdsData);
        } catch (e) {
            swLog.error(`Error fetching DISPLAY ADS -- ${e}`);
            setIsError(true);
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

    const getIsEmptyState = () => {
        return isError ? <ErrorComponent /> : isNoData() ? <NoDataComponent /> : null;
    };

    ///////////// User Actions //////////////////

    const setSelectedTab = (selectedTab) => {
        TrackWithGuidService.trackWithGuid("display_ads.overview.graph.metric_tab", "click", {
            metric: selectedTab.name,
        });
        setSelectedMetricTab(selectedTab);
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
            return displayAdsGraphConfig.map((tab) => {
                return {
                    ...tab,
                    value: totals?.[tab.name],
                };
            });
        }
        return displayAdsGraphConfig;
    }, [totals]);

    const basicGraphProps = {
        rawData,
        isSingle,
        getSiteColor,
        chosenSites,
        isLoading,
        to,
        from,
        granularity: timeGranularityObjects.monthly,
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
                    <TabPanel key={1}>
                        <TabContentStyle>
                            {isLoading ? (
                                <LoaderWrapper>
                                    <Loader />
                                </LoaderWrapper>
                            ) : (
                                <BasicGraph
                                    {...basicGraphProps}
                                    {...DisplayTrafficConfig({
                                        duration,
                                        isWindow,
                                        granularity,
                                        webSource,
                                        to,
                                        from,
                                        graphType,
                                        isSingle,
                                    })}
                                    emptyState={getIsEmptyState()}
                                />
                            )}
                        </TabContentStyle>
                    </TabPanel>
                    <TabPanel key={2}>
                        <TabContentStyle>
                            {isLoading ? (
                                <LoaderWrapper>
                                    <Loader />
                                </LoaderWrapper>
                            ) : (
                                <BasicGraph
                                    {...basicGraphProps}
                                    {...AvgVisitDurationConfig({
                                        duration,
                                        isWindow,
                                        granularity,
                                        webSource,
                                        to,
                                        from,
                                    })}
                                    emptyState={getIsEmptyState()}
                                />
                            )}
                        </TabContentStyle>
                    </TabPanel>
                    <TabPanel key={3}>
                        <TabContentStyle>
                            {isLoading ? (
                                <LoaderWrapper>
                                    <Loader />
                                </LoaderWrapper>
                            ) : (
                                <BasicGraph
                                    {...basicGraphProps}
                                    {...PagesPerVisitConfig({
                                        duration,
                                        isWindow,
                                        granularity,
                                        webSource,
                                        to,
                                        from,
                                    })}
                                    emptyState={getIsEmptyState()}
                                />
                            )}
                        </TabContentStyle>
                    </TabPanel>
                    <TabPanel key={4}>
                        <TabContentStyle>
                            {isLoading ? (
                                <LoaderWrapper>
                                    <Loader />
                                </LoaderWrapper>
                            ) : (
                                <BasicGraph
                                    {...basicGraphProps}
                                    {...BounceRateConfig({
                                        duration,
                                        isWindow,
                                        granularity,
                                        webSource,
                                        to,
                                        from,
                                    })}
                                    emptyState={getIsEmptyState()}
                                />
                            )}
                        </TabContentStyle>
                    </TabPanel>
                </TabsComponent>
            </div>
        );
    };

    return (
        <DisplayAdsGraphContainer>
            <DisplayAdsGraphHeader
                queryParams={queryParams}
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
        </DisplayAdsGraphContainer>
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

const DisplayAdsGraphConnected = connect(mapStateToProps)(
    React.memo(DisplayAdsGraph, propsAreEqual),
);

SWReactRootComponent(DisplayAdsGraphConnected, "DisplayAdsGraph");
