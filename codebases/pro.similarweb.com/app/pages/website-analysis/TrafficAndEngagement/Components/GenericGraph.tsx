import { swSettings } from "common/services/swSettings";
import { isEqual } from "lodash";
import Chart from "components/Chart/src/Chart";
import { GraphLoader } from "components/Loaders/src/ExpandedTableRowLoader/ExpandedTableRowLoader";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import { GraphTypeSwitcher } from "pages/website-analysis/TrafficAndEngagement/ChartUtilities/GraphTypeSwitcher";
import { IsThisYourWebsite } from "pages/website-analysis/TrafficAndEngagement/ChartUtilities/IsThisYourWebsite";
import { LegendsContainer } from "pages/website-analysis/TrafficAndEngagement/ChartUtilities/LegendsContainer";
import { PubliclyVerified } from "pages/website-analysis/TrafficAndEngagement/ChartUtilities/PubliclyVerified";
import { TimeGranularitySwitcher } from "pages/website-analysis/TrafficAndEngagement/ChartUtilities/TimeGranularitySwitcher";
import {
    ButtonsContainer,
    ChartContainer,
    CheckboxesContainer,
    TooltipContainer,
    UtilitiesContainer,
} from "pages/website-analysis/TrafficAndEngagement/Components/StyledComponents";
import { getChartConfig } from "pages/website-analysis/TrafficAndEngagement/MD/chartConfig";
import { tabs } from "pages/website-analysis/TrafficAndEngagement/MD/Tabs";
import {
    addBetaBranchParam,
    getDualCalculations,
    pngDownload,
    webSources,
} from "pages/website-analysis/TrafficAndEngagement/UtilityFunctionsAndConstants/UtilityFunctions";
import {
    areValuesEqualAvgWithTreshold,
    BetaMessage,
} from "pages/website-analysis/TrafficAndEngagement/BetaBranch/CommonComponents";
import { SOURCES_TEXT } from "components/widget/widget-types/Widget";
import { i18nFilter } from "filters/ngFilters";
import { NoData } from "pages/keyword-analysis/KeywordsOverviewPage/Components/UtilityComponents";
import { AddToDashboard } from "pages/website-analysis/TrafficAndEngagement/ChartUtilities/AddToDashboard";
import * as queryString from "querystring";
import * as React from "react";
import ReactDOMServer from "react-dom/server";
import DurationService from "services/DurationService";
import { DefaultFetchService } from "services/fetchService";
import { allTrackers } from "services/track/track";
import { useLoading } from "custom-hooks/loadingHook";
import { PngHeader } from "UtilitiesAndConstants/UtilitiesComponents/PngHeader";

const i18nFilterInstance = i18nFilter();

const isStacking = (webSource, chartType): boolean => {
    if (chartType === "column" && webSource !== "Total") {
        return false;
    }
    return ["column", "area"].includes(chartType);
};

export const GenericGraphInner: React.FunctionComponent<any> = (props) => {
    const fetchService = DefaultFetchService.getInstance();
    const {
        metric,
        showGAApprovedData,
        showBetaBranchData,
        gaPrivacyStatus,
        params,
        chosenSites,
        hasGaToken,
        getSiteColor,
        meta,
        toggleMTD,
        updateExcelLink,
        chartIdForAnnotations,
    } = props;
    const {
        webSource,
        country,
        key,
        isWWW,
        duration,
        comparedDuration,
        selectedWidgetTab,
    } = params;

    const durations = React.useMemo(
        () => DurationService.getDurationData(duration, comparedDuration),
        [duration, comparedDuration],
    );
    const { from, to, compareFrom, compareTo, isWindow } = durations.forAPI;
    const lastSupportedDate = meta.isMTDActive
        ? swSettings.current.lastSupportedDailyDate
        : to.replace(/\|/g, "/");

    const isGa = showGAApprovedData && hasGaToken;
    const isGaPublic = gaPrivacyStatus === "Public";
    const [timeGranularityOptions, timeGranularityOptionsEnabled] = React.useMemo(() => {
        const opts = [
            {
                title: "D",
                disabled: metric.isTimeGranularityDisabled({ isGa, duration, title: "D" }, meta),
                name: "Daily",
                supportMTD: true,
            },
            {
                title: "W",
                disabled: metric.isTimeGranularityDisabled({ isGa, duration, title: "W" }, meta),
                name: "Weekly",
                supportMTD: true,
            },
            {
                title: "M",
                disabled: metric.isTimeGranularityDisabled({ isGa, duration, title: "M" }, meta),
                name: "Monthly",
                supportMTD: true,
            },
        ].map((opt) =>
            showBetaBranchData && !opt.disabled && ["D", "W"].includes(opt.title)
                ? {
                      ...opt,
                      disabled: true,
                      tooltipText: i18nFilterInstance(
                          "wa.traffic.engagement.granularity.disabled.beta",
                      ),
                  }
                : opt,
        );
        const enabledOpts = opts.filter((opt) => !opt.disabled);
        return [opts, enabledOpts];
    }, [metric.isTimeGranularityDisabled, isGa, duration, showBetaBranchData]);
    const getTimeGranularity = React.useCallback(() => timeGranularityOptions, [
        timeGranularityOptions,
    ]);

    const [graph, graphOps] = useLoading();
    const [chartType, setChartType] = React.useState(metric.getChartType(meta));
    const [timeGranularity, setTimeGranularity] = React.useState(
        timeGranularityOptionsEnabled[timeGranularityOptionsEnabled.length - 1],
    );
    const [showChart, setShowChart] = React.useState(false);
    const chartPngRef = React.useRef();
    const webSourceForApi = metric.getWebSourceForApi
        ? metric.getWebSourceForApi({ webSource, chartType })
        : webSource === "Total" && meta.isSingleMode
        ? "Combined"
        : webSource;
    const lastQueryParams = React.useRef({});
    const queryParams = React.useMemo(() => {
        const newQueryParams = {
            ShouldGetVerifiedData: showGAApprovedData,
            compareTo,
            compareFrom,
            country,
            from,
            includeSubDomains: isWWW === "*",
            isWindow,
            keys: key,
            timeGranularity: timeGranularity.name,
            webSource: webSourceForApi,
            to,
            ...(comparedDuration !== "" && meta.isMTDActive ? { latestCompare: "l" } : null),
            ...(meta.isMTDActive ? { latest: "l" } : null),
        };
        // deeply compare to latest query params
        if (!isEqual(lastQueryParams.current, newQueryParams)) {
            lastQueryParams.current = newQueryParams;
        }
        return lastQueryParams.current;
    }, [
        metric.getWebSourceForApi,
        webSource,
        chartType,
        meta.isSingleMode,
        showGAApprovedData,
        compareTo,
        compareFrom,
        country,
        from,
        to,
        isWWW,
        isWindow,
        key,
        timeGranularity,
        meta.isMTDActive,
    ]);

    const [series, setSeries] = React.useState(() => {
        if (meta.isSingleCompare) {
            return getDualCalculations();
        }
        const compareSeries = chosenSites.map((site) => {
            return {
                name: site,
                color: getSiteColor(site),
                isSelected: true,
            };
        });
        const currentWebSource = webSources.filter((ws) =>
            (webSourceForApi === "Combined"
                ? ["Desktop", "MobileWeb"]
                : [webSourceForApi]
            ).includes(ws.alias),
        );
        return metric.getSites
            ? metric.getSites({
                  isSingleMode: meta.isSingleMode,
                  compareSeries,
                  webSource,
                  durations: durations.forWidget,
                  compareSites: compareSeries,
              })
            : meta.isSingleMode
            ? currentWebSource
            : compareSeries;
    });

    const metricTitle = React.useMemo(() => {
        const currentTab = tabs.find((tab) => tab.name === selectedWidgetTab);
        const metricTitle = i18nFilterInstance(
            currentTab.getTitle ? currentTab.getTitle(meta.is28Days) : currentTab.title,
        );
        metric["title"] = metricTitle;
        return metricTitle;
    }, []);

    const isGraphLoading = [useLoading.STATES.INIT, useLoading.STATES.LOADING].includes(
        graph.state,
    );

    const graphData = React.useMemo(() => {
        try {
            if (!graph.data) {
                return [];
            }
            const chosenSite = chosenSites[0];
            const params = {
                isSingleMode: meta.isSingleMode,
                sites: series,
                chosenSite,
                metric,
                webSource,
                chartType,
                timeGranularity,
                lastSupportedDate,
            };
            return metric.getGraphData({ ...params, data: graph.data }).map((site) => ({
                ...site,
                data: site?.data.map((dt) => ({ ...dt, y: Math.round(dt.y * 10000) / 10000 })),
            }));
        } catch (e) {
            return [];
        }
    }, [
        graph.data,
        meta.isSingleMode,
        series,
        chosenSites,
        metric,
        webSource,
        chartType,
        timeGranularity,
        lastSupportedDate,
    ]);

    const chartConfig = React.useMemo(() => {
        const lessEqualThanOneMonthDurations = ["28d", "1m"];
        const isTurboThreshold = timeGranularity.name === "Daily";
        const isDailyGranularity =
            timeGranularity.name !== "Monthly" && lessEqualThanOneMonthDurations.includes(duration);
        const isChartStacking = metric.isStacking
            ? metric.isStacking()
            : isStacking(webSource, chartType)
            ? "normal"
            : null;
        const getChartXPointsLength = () =>
            graphData?.reduce((acc, site) => {
                site.data?.forEach(({ x }) => acc.add(x));
                return acc;
            }, new Set()).size;
        const isMarkerEnabled =
            (chartType !== "area" && timeGranularity.name !== "Daily") ||
            (lessEqualThanOneMonthDurations.includes(duration) &&
                timeGranularity.name === "Monthly") ||
            getChartXPointsLength() <= 1;
        const getTooltipFormatter = function (): string {
            const ChartTooltip = (
                <TooltipContainer>
                    {metric.chartTooltip({
                        points: this.points,
                        x: this.x,
                        graphData,
                        timeGranularity: timeGranularity.name,
                        lastSupportedDate,
                        meta,
                    })}
                </TooltipContainer>
            );
            return ReactDOMServer.renderToString(ChartTooltip);
        };
        return getChartConfig({
            metric,
            tooltipFormatter: getTooltipFormatter,
            isChartStacking,
            isMarkerEnabled,
            isDailyGranularity,
            isTurboThreshold,
        });
    }, [metric, timeGranularity, duration, webSource, graphData, chartType]);

    const chartData = React.useMemo(() => {
        return graphData.filter((s) => s.isSelected);
    }, [graphData]);

    const isColumnChartTypeDisabled = React.useMemo(() => {
        return timeGranularity.name !== "Monthly" && ["18m", "24m"].includes(duration);
    }, [timeGranularity, duration]);

    const isSameData = React.useMemo(() => {
        if (meta.isSingleCompare && graphData?.length) {
            const graphKeys = (graphData[0].data ?? []).map((p) => p.x);
            return graphKeys.every((key, i) => {
                const values = [];
                const sameKeys = graphData.every((gr) => {
                    // check if same key - no more, no less
                    if (
                        gr.data.length === graphKeys.length &&
                        i < gr.data.length &&
                        gr.data[i].x === key
                    ) {
                        values.push(gr.data[i]?.y);
                        return true;
                    }
                    return false;
                });
                return sameKeys && areValuesEqualAvgWithTreshold(values);
            });
        }
    }, [graphData, meta.isSingleCompare]);

    const onLegendClick = React.useCallback(
        (seriesItem) => {
            const newSeries = series.map((s) => {
                if (s.name === seriesItem.name) {
                    s.isSelected = !s.isSelected;
                }
                return s;
            });
            allTrackers.trackEvent(
                "Click Filter",
                seriesItem.isSelected ? "click" : "remove",
                `Over Time Graph/Engagement Overview/${seriesItem.name}`,
            );
            setSeries(newSeries);
        },
        [series],
    );

    const granularityUpdate = React.useCallback(
        (granularityIndex) => {
            const newTimeGranularity = timeGranularityOptions[granularityIndex];
            allTrackers.trackEvent(
                "Time Frame Button",
                "switch",
                `Over Time Graph/Engagement Overview/${newTimeGranularity.name}`,
            );
            if (!newTimeGranularity.supportMTD && meta.isMTDActive) {
                toggleMTD();
                setTimeout(() => setTimeGranularity(newTimeGranularity), 0);
            } else {
                setTimeGranularity(newTimeGranularity);
            }
        },
        [timeGranularityOptions, timeGranularity, toggleMTD],
    );

    const chartGranularityItemClick = React.useCallback(
        (index, shouldTrack = true) => {
            const newChartType = metric.chartGranularityItemClick
                ? metric.chartGranularityItemClick(index)
                : index === 1
                ? "line"
                : "column";
            setChartType(newChartType);
            shouldTrack && allTrackers.trackEvent("Capsule Button", "switch", newChartType);
        },
        [metric.chartGranularityItemClick],
    );

    const chartAfterRender = React.useCallback((chart) => {
        setShowChart(chart.hasData());
        return chart;
    }, []);

    // NOTE: not in use, since each granularity supports MTD
    // // used when there is granularity that do not support MTD and MTD was toggled on for it,
    // // so this effect will choose the biggest granularity that supports MTD.
    // React.useEffect(() => {
    //     if (
    //         !timeGranularity ||
    //         (!timeGranularity.supportMTD && meta.isMTDActive) ||
    //         !timeGranularityOptionsEnabled.find((tg) => tg.name === timeGranularity.name)
    //     ) {
    //         const supportedTimeGranularity = timeGranularityOptionsEnabled.filter((tg) => !meta.isMTDActive || tg.supportMTD);
    //         setTimeGranularity(supportedTimeGranularity[supportedTimeGranularity.length - 1]);
    //     }
    // }, [timeGranularity, timeGranularityOptionsEnabled, meta.isMTDActive]);

    React.useEffect(() => {
        graphOps.load(() => {
            const apiParams = metric.endPoint + "?" + queryString.stringify(queryParams);
            const apiParamsNew =
                metric.endPoint +
                "?" +
                queryString.stringify(addBetaBranchParam(queryParams, true, meta.isSingleCompare));
            if (meta.isSingleCompare) {
                // for dual calculations aggregate graphs data by calculation
                return Promise.all<any>([
                    fetchService.get(apiParamsNew),
                    fetchService.get(apiParams),
                ]).then((calcGraphs) => {
                    return calcGraphs.reduce(
                        (acc, calcGraph, idx) => ({
                            ...acc,
                            Data: {
                                ...acc.Data,
                                [series[idx].alias]: calcGraph.Data[chosenSites[0]],
                            },
                        }),
                        { ...calcGraphs?.[1], Data: {} },
                    );
                });
            } else if (showBetaBranchData) {
                return fetchService.get(apiParamsNew);
            }
            return fetchService.get(apiParams);
        });
    }, [metric.endPoint, queryParams, showBetaBranchData, meta.isSingleCompare]);

    React.useEffect(() => {
        if (graph.data && meta.isSingleCompare) {
            const chosenSite = chosenSites[0];
            if (graph.data.KeysDataVerification?.[chosenSite]) {
                setSeries(getDualCalculations(true));
            }
        }
    }, [graph.data, meta.isSingleCompare]);

    React.useEffect(() => {
        updateExcelLink(
            metric.getExcelLink
                ? metric.getExcelLink(
                      addBetaBranchParam(queryParams, showBetaBranchData, meta.isSingleCompare),
                  )
                : null,
        );
    }, [
        updateExcelLink,
        metric.getExcelLink,
        queryParams,
        showBetaBranchData,
        meta.isSingleCompare,
    ]);

    return (
        <div ref={chartPngRef}>
            <PngHeader
                metricTitle={metricTitle}
                durations={durations.forWidget}
                webSource={webSource}
                country={country}
            />
            <UtilitiesContainer legendsAmount={series.length}>
                <ButtonsContainer legendsAmount={series.length}>
                    {(meta.isSingleMode || meta.isSingleCompare) &&
                        (isGa && isGaPublic ? (
                            <PubliclyVerified />
                        ) : (
                            !hasGaToken && <IsThisYourWebsite />
                        ))}
                    {!showBetaBranchData && (
                        <GraphTypeSwitcher
                            onItemClick={chartGranularityItemClick}
                            selectedIndex={chartType === "column" ? 0 : 1}
                            icons={[
                                {
                                    name: "bar-chart",
                                    size: "xs",
                                    disabled: isColumnChartTypeDisabled,
                                },
                                { name: "line-chart", size: "xs", disabled: false },
                            ]}
                        />
                    )}
                    <TimeGranularitySwitcher
                        timeGranularity={timeGranularity}
                        granularityUpdate={granularityUpdate}
                        getGranularity={getTimeGranularity}
                    />
                    <DownloadButtonMenu
                        PNG={true}
                        exportFunction={() => pngDownload(chartPngRef.current, metric.title)}
                    />
                    {metric.addToDashboardName && !showBetaBranchData && (
                        <AddToDashboard
                            metric={metric}
                            webSource={webSource}
                            filters={{
                                ShouldGetVerifiedData: showGAApprovedData,
                                timeGranularity: timeGranularity.name,
                            }}
                        />
                    )}
                </ButtonsContainer>

                {isGraphLoading ? null : (
                    <CheckboxesContainer legendsAmount={series.length}>
                        {(showChart ||
                            series.filter((s) => s.isSelected).length < series.length) && (
                            <LegendsContainer
                                metric={metric}
                                chartType={chartType}
                                showGAApprovedData={showGAApprovedData}
                                queryParams={queryParams}
                                meta={meta}
                                webSource={webSource}
                                data={graph.data}
                                onLegendClick={onLegendClick}
                                sites={series}
                            />
                        )}
                    </CheckboxesContainer>
                )}

                {isSameData && (
                    <BetaMessage messageKey="wa.traffic.engagement.beta.graphs.coalesce" />
                )}
            </UtilitiesContainer>
            <ChartContainer>
                {isGraphLoading ? (
                    <GraphLoader width={window.innerWidth > 1440 ? 1280 : 1000} />
                ) : chartData.length > 0 ? (
                    <Chart
                        type={chartType}
                        data={chartData}
                        config={chartConfig}
                        afterRender={chartAfterRender}
                        chartIdForAnnotations={chartIdForAnnotations}
                    />
                ) : (
                    <NoData
                        paddingTop="80px"
                        noDataTitleKey="global.nodata.notavilable"
                        noDataSubTitleKey="workspaces.marketing.nodata.subtitle"
                    />
                )}
            </ChartContainer>
        </div>
    );
};
export const GenericGraph = GenericGraphInner;
