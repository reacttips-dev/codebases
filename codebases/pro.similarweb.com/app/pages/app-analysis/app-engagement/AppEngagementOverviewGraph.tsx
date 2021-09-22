import React, { useMemo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Tabs, TabList, ScorableTab, TabPanel, Tab } from "@similarweb/ui-components/dist/tabs";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import { Injector } from "common/ioc/Injector";
import { useLoading } from "custom-hooks/loadingHook";
import { SwNavigator } from "common/services/swNavigator";
import { i18nFilter } from "filters/ngFilters";
import {
    BoxContainer,
    ChartContainer,
    ButtonsContainer,
    StyledGraphHeader,
    CustomStyledPrimaryTitle,
    Label,
    Devider,
} from "./styledComponents";
import { LegendsTitle } from "pages/website-analysis/traffic-sources/mmx/components/ChannelAnalysisChart/StyledComponents";
import AppEngagementServiceApi from "pages/app-analysis/app-engagement/AppEngagementServiceApi";
import {
    NoDataGraphContainer,
    SectionContainer,
    SingleGraphContainer,
    SingleGraphLegendContainer,
} from "pages/segments/mmx/styledComponents";
import { TableNoData } from "components/React/Table/FlexTable/Big/FlexTableStatelessComponents";
import { FlexRow, RightFlexRow } from "styled components/StyledFlex/src/StyledFlex";
import Chart from "components/Chart/src/Chart";
import { getChartConfig, transformData } from "./AppEngagementLineChartConfig";
import { AppEngagementVerticals } from "pages/app-analysis/app-engagement/AppEngagementOverviewContainer";
import DurationService from "services/DurationService";
import { chosenItems } from "common/services/chosenItems";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import { PdfExportService } from "services/PdfExportService";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { SwitcherGranularityContainer } from "pages/website-analysis/components/SwitcherGranularityContainer";
import { AddToDashboardButton } from "components/React/AddToDashboard/AddToDashboardButton";
import { AppEngagementChannelsLegends } from "./AppEngagementChannelsLegends";
import { allTrackers } from "services/track/track";
import BoxTitle from "components/BoxTitle/src/BoxTitle";
import BoxSubtitle from "components/BoxSubtitle/src/BoxSubtitle";
import StyledBoxSubtitle from "styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import CountryService from "services/CountryService";
import _ from "lodash";

export const AppEngagementOverviewGraph = (props) => {
    const { appStore } = props;

    const services = React.useMemo(
        () => ({
            apiService: AppEngagementServiceApi.getInstance(),
            swNavigator: Injector.get<SwNavigator>("swNavigator"),
            i18n: i18nFilter(),
        }),
        [],
    );

    const { params } = useSelector((state) => {
        const {
            routing: { params, stateConfig },
        } = state;
        return { params, stateConfig };
    });

    const { duration, tab, granularity } = params;
    const isTwentyEightDays = duration === "28d";
    const isMAU = params.tab === "MonthlyActiveUsers";
    const [graphData, graphDataOps] = useLoading();
    const durationObject = useMemo(() => DurationService.getDurationData(duration), [duration]);

    const timeGranularities = useMemo(() => {
        const newGranularity = [
            {
                value: "Daily",
                title: "D",
                disabled: isMAU,
            },
            {
                value: "Weekly",
                title: "W",
                disabled: isMAU,
            },
            {
                value: "Monthly",
                title: "M",
                disabled: isTwentyEightDays,
            },
        ];
        return newGranularity;
    }, [isMAU, isTwentyEightDays]);

    const { selectedTabKey, selectedTabIndex } = useMemo(() => {
        const selectedTabKey = params.tab ?? AppEngagementVerticals[appStore][0];
        const selectedTabIndex = AppEngagementVerticals[appStore].findIndex(
            (tKey) => tKey === selectedTabKey,
        );
        return { selectedTabKey, selectedTabIndex };
    }, [tab]);
    const onSelectTab = React.useCallback((index) => {
        const newSelectedTabKey = AppEngagementVerticals[appStore][index];

        // if we are at 28 days mode we want to change the granularity to montly and update the SwitcherGranularityContainer
        if (newSelectedTabKey === "MonthlyActiveUsers") {
            onSelectGranularity(2);
        }

        services.swNavigator.applyUpdateParams({ tab: newSelectedTabKey });

        allTrackers.trackEvent(
            "Metric Button",
            "click",
            "Over Time Graph/App Engagement Overview/" + newSelectedTabKey,
        );
    }, []);

    useEffect(
        () => () => {
            if (params.tab === "MonthlyActiveUsers" && duration === "28d") {
                services.swNavigator.applyUpdateParams({
                    tab: AppEngagementVerticals[appStore][0],
                });
            }
        },
        [duration],
    );

    useEffect(() => {
        const validTabCheck = AppEngagementVerticals[appStore].includes(params.tab);
        if (!validTabCheck) {
            services.swNavigator.updateParams(
                {
                    tab: AppEngagementVerticals[appStore][0],
                },
                { reload: false },
            );
        }
    }, []);

    const { selectedTimeGranularity, selectedTimeGranularityIndex } = useMemo(() => {
        // if we are on MAU mode we want the monthly granularity to not be selected
        if (isTwentyEightDays && params.granularity === "Monthly") {
            return { selectedTimeGranularity: "Daily", selectedTimeGranularityIndex: 0 };
        }

        const selectedTimeGranularity = params.granularity ?? timeGranularities[2].value;
        const selectedTimeGranularityIndex = timeGranularities.findIndex(
            ({ value }) => value === selectedTimeGranularity,
        );
        return { selectedTimeGranularity, selectedTimeGranularityIndex };
    }, [granularity]);

    const onSelectGranularity = React.useCallback((index) => {
        const newSelectedTimeGranularity = timeGranularities[index];
        services.swNavigator.applyUpdateParams({ granularity: newSelectedTimeGranularity.value });
    }, []);

    const isObjectEmpty = (obj) => {
        let isEmptyFlag = true;
        _.each(obj, (val, key) => {
            if (val > 0) isEmptyFlag = false;
        });
        return Object.keys(obj).length === 0 || isEmptyFlag;
    };

    const isLoading = [useLoading.STATES.INIT, useLoading.STATES.LOADING].includes(graphData.state);

    // this useEffect was added for fixing a case that the current tab have no data, so the page will reload and changed to the first table tab.
    useEffect(() => {
        const currentTabData = graphData?.data?.Data[chosenItems[0].Id]?.Total[selectedTabKey];

        if (
            currentTabData &&
            selectedTabKey !== "CurrentInstalls" &&
            isObjectEmpty(currentTabData)
        ) {
            services.swNavigator.updateParams(
                {
                    tab: AppEngagementVerticals[appStore][0],
                },
                { reload: false },
            );
        }
    }, [isLoading]);

    const isEmptyData = useMemo(() => {
        const { data } = graphData;
        let isEmptyDataFlag = true;

        if (isLoading) {
            return false;
        }
        if (!data) {
            return true;
        } else {
            isEmptyDataFlag = chosenItems.every((chosenItem) => {
                const dataElement = graphData.data?.Data[chosenItem?.Id]?.Total;
                return (
                    isObjectEmpty(dataElement.Downloads) &&
                    isObjectEmpty(dataElement.MonthlyActiveUsers) &&
                    isObjectEmpty(dataElement.DailyActiveUsers)
                );
            });

            return isEmptyDataFlag;
        }
    }, [isLoading]);

    const isCompare = chosenItems.length > 1;
    const keys = chosenItems.map((ch) => ch.Id);

    useEffect(() => {
        graphDataOps.load(() => {
            const apiParams = services.swNavigator.getApiParams({
                ...params,
                keys: chosenItems.map((ch) => ch.Id).join(","),
            });
            if (appStore === "Google") {
                return services.apiService.fetchAppEngagementDataAndroid(apiParams);
            } else if (appStore === "Apple") {
                return services.apiService.fetchAppEngagementDataIos(apiParams);
            }
            return Promise.reject(
                new Error(`Error loading data - unknown app store! (${appStore})`),
            );
        });
    }, []);

    const [shownData, setShownData] = useState([]);

    const seriesData = useMemo(() => {
        if (!graphData.data || isEmptyData || isLoading) {
            return [];
        }
        const verticalObj = AppEngagementVerticals.meta[selectedTabKey];

        const series = chosenItems.map((appItem) => {
            const appData = graphData.data.Data[appItem.Id];
            const graphValueKey = verticalObj?.isPercentage ? "Percentage" : "Number";
            let pointsSelectedTimeGranularity;
            if (isMAU && isTwentyEightDays) {
                services.swNavigator.applyUpdateParams({
                    tab: AppEngagementVerticals[appStore][0],
                });
                return [];
            } else {
                pointsSelectedTimeGranularity = !isMAU
                    ? selectedTimeGranularity
                    : timeGranularities[2].value;
            }
            return {
                isChecked: true,
                name: appItem.Title,
                color: appItem.Color,
                appItem,
                isScraped: appData?.IsScraped,
                algoChangeDate: verticalObj?.algoChangeDate,
                points:
                    appData?.Overtime[pointsSelectedTimeGranularity][selectedTabKey][graphValueKey],
                total: appData?.Total[selectedTabKey][graphValueKey],
            };
        });
        const transformedData = transformData(
            series,
            granularity,
            durationObject.forAPI.to.replace(/\|/g, "/"),
            isCompare,
        );
        setShownData(transformedData);
        return transformedData;
    }, [graphData.data, selectedTabKey, selectedTimeGranularity]);

    const lagendToggleHandler = (filterData) => {
        setShownData(filterData);
    };

    // excel buttons Start:
    const excelUrl: string = useMemo(() => {
        const params = services.swNavigator.getParams();
        const apiParams = services.swNavigator.getApiParams(params);
        const excelFileName = `AppEngagement - ${apiParams.appId} - (${apiParams.from}) - (${apiParams.to}) `;

        return services.apiService.getEngagementGraphExcelUrl(appStore, {
            ...apiParams,
            includeSubDomains: true,
            keys: apiParams.appId,
            timeGranularity: selectedTimeGranularity,
            FileName: excelFileName,
        } as any);
    }, [selectedTimeGranularity]);

    const chartRef = React.useRef<HTMLElement>();

    const getPNG = React.useCallback(() => {
        TrackWithGuidService.trackWithGuid(
            "app.analysis.engagement.graph.download.png",
            "submit-ok",
            {
                type: "PNG",
            },
        );

        const offSetX = 0;
        const offSetY = 50;
        const styleHTML = Array.from(document.querySelectorAll("style"))
            .map((stylesheet) => stylesheet.outerHTML)
            .join("");
        PdfExportService.downloadHtmlPngFedService(
            styleHTML + chartRef.current.outerHTML,
            "Engagement",
            chartRef.current.offsetWidth + offSetX,
            chartRef.current.offsetHeight + offSetY,
        );
    }, []);

    const onExcelClick = () => {
        TrackWithGuidService.trackWithGuid("app.analysis.engagement.excel.download", "submit-ok", {
            type: "Excel",
        });
    };

    const getUtilityButtons = () => {
        return (
            <ButtonsContainer>
                {excelUrl && (
                    <a href={excelUrl}>
                        <DownloadButtonMenu
                            Excel={true}
                            downloadUrl={excelUrl}
                            exportFunction={onExcelClick}
                        />
                    </a>
                )}
                <DownloadButtonMenu PNG={true} exportFunction={getPNG} />
            </ButtonsContainer>
        );
    };
    // excel buttons Finish

    // Add To Dashboard:
    const AddToDashboard = ({ metric, type, webSource, filters, overrideParams = {} }) => {
        const getCustomModel = (metric, type, webSource, filters) => {
            const widget = Injector.get<any>("widgetModelAdapterService").fromMobile(
                metric,
                type,
                webSource,
                filters,
            );
            return { ...widget, ...overrideParams };
        };

        let addToDashboardModal = { dismiss: () => null };
        useEffect(() => () => addToDashboardModal.dismiss(), [addToDashboardModal]);

        const a2d = () => {
            const $modal = Injector.get<any>("$modal");
            addToDashboardModal = $modal.open({
                animation: true,
                controller: "widgetAddToDashboardController as ctrl",
                templateUrl: "/app/components/widget/widget-add-to-dashboard-modal.html",
                windowClass: "add-to-dashboard-modal",
                resolve: {
                    widget: () => null,
                    customModel: () => getCustomModel(metric, type, webSource, filters),
                },
                scope: Injector.get<any>("$rootScope").$new(true),
            });
        };
        return <AddToDashboardButton onClick={() => a2d()} />;
    };

    const subtitleFilters = [
        {
            filter: "date",
            value: {
                from: durationObject.forAPI.from,
                to: durationObject.forAPI.to,
            },
        },
        {
            filter: "country",
            countryCode: params.country,
            value: CountryService.getCountryById(params.country).text,
        },
    ];

    const isTabEmpty = (data) => {
        if (data && !isEmptyData) {
            return isObjectEmpty(data);
        }
        return true;
    };

    const UtilitySection = () => {
        return (
            <RightFlexRow>
                <SwitcherGranularityContainer
                    itemList={timeGranularities}
                    selectedIndex={selectedTimeGranularityIndex}
                    onItemClick={onSelectGranularity}
                    customClass={"CircleSwitcher"}
                />

                {getUtilityButtons()}
                <AddToDashboard
                    metric={AppEngagementVerticals?.meta[selectedTabKey]?.metric}
                    type={AppEngagementVerticals?.meta[selectedTabKey]?.dashboardWidgetType}
                    webSource={undefined}
                    filters={{
                        ShouldGetVerifiedData: undefined,
                        filter: undefined,
                        timeGranularity: selectedTimeGranularity,
                    }}
                />
            </RightFlexRow>
        );
    };

    return (
        <BoxContainer ref={chartRef}>
            <StyledGraphHeader>
                <div>
                    <CustomStyledPrimaryTitle>
                        <BoxTitle>{i18nFilter()("wa.ao.engagement.graph.header")}</BoxTitle>
                    </CustomStyledPrimaryTitle>
                    <StyledBoxSubtitle>
                        <BoxSubtitle filters={subtitleFilters} />
                    </StyledBoxSubtitle>
                </div>
                {isCompare && !isEmptyData && <UtilitySection />}
            </StyledGraphHeader>

            {!isCompare && <Devider />}
            <Tabs selectedIndex={selectedTabIndex} onSelect={onSelectTab}>
                <TabList>
                    {AppEngagementVerticals[appStore].map((tabKey) => {
                        // if we are on 28 days state we want to hide the "MonthlyActiveUsers" tab
                        if (isTwentyEightDays && tabKey === "MonthlyActiveUsers") {
                            return;
                        }

                        const tabObj = AppEngagementVerticals.meta[tabKey];
                        return (
                            <>
                                {isCompare ? (
                                    !isEmptyData && (
                                        <Tab
                                            tooltipText={services.i18n(tabObj.infoIcon)}
                                            key={tabKey}
                                        >
                                            {isLoading ? (
                                                <PixelPlaceholderLoader
                                                    width="4em"
                                                    height="1.4em"
                                                />
                                            ) : (
                                                <>
                                                    {services.i18n(tabObj.title)}
                                                    {tabObj.labelText && (
                                                        <Label color={tabObj.labelColor}>
                                                            {tabObj.labelText}
                                                        </Label>
                                                    )}
                                                </>
                                            )}
                                        </Tab>
                                    )
                                ) : (
                                    <ScorableTab
                                        enabled={
                                            !isTabEmpty(
                                                graphData.data?.Data[chosenItems[0].Id]?.Total[
                                                    tabKey
                                                ],
                                            )
                                        }
                                        key={tabKey}
                                        selected={tabKey === selectedTabKey}
                                        metric={services.i18n(tabObj.title)}
                                        metricIcon={tabObj.icon}
                                        valueTooltip={services.i18n(tabObj.infoIcon)}
                                        hideBorder={true}
                                        labelText={tabObj.labelText}
                                        labelColor={tabObj.labelColor}
                                        value={
                                            isLoading ? (
                                                <PixelPlaceholderLoader
                                                    width="4em"
                                                    height="1.4em"
                                                />
                                            ) : isEmptyData ? (
                                                "N/A"
                                            ) : (
                                                tabObj.filter(
                                                    graphData.data?.Data[chosenItems[0].Id]?.Total[
                                                        tabKey
                                                    ][
                                                        tabObj.isPercentage
                                                            ? "Percentage"
                                                            : "Number"
                                                    ],
                                                )
                                            )
                                        }
                                    />
                                )}
                            </>
                        );
                    })}
                </TabList>
                {AppEngagementVerticals[appStore].map((tabKey) => {
                    if (isTwentyEightDays && tabKey === "MonthlyActiveUsers") {
                        return;
                    }

                    const tabObj = AppEngagementVerticals.meta[tabKey];

                    return (
                        <TabPanel key={tabKey}>
                            {tabKey === selectedTabKey && (
                                <SectionContainer>
                                    {!isCompare && !isEmptyData && <UtilitySection />}
                                    <ChartContainer>
                                        {isLoading ? (
                                            <PixelPlaceholderLoader width="100%" height="260px" />
                                        ) : isEmptyData ? (
                                            <NoDataGraphContainer>
                                                <TableNoData
                                                    icon="no-data"
                                                    messageTitle={i18nFilter()(
                                                        "global.nodata.notavilable",
                                                    )}
                                                />
                                            </NoDataGraphContainer>
                                        ) : (
                                            <FlexRow>
                                                <SingleGraphContainer className={"sharedTooltip"}>
                                                    <Chart
                                                        type="line"
                                                        config={getChartConfig({
                                                            type: "line",
                                                            metricTitle: services.i18n(
                                                                tabObj.chartTitle,
                                                            ),
                                                            data: shownData,
                                                            filter: tabObj.filter,
                                                            timeGranularity: selectedTimeGranularity,
                                                            isWindow:
                                                                durationObject.forAPI.isWindow,
                                                            yAxisFilter: tabObj.yAxisFilter,
                                                            durationObject,
                                                            algoChangeDate: tabObj.algoChangeDate,
                                                            isCompare,
                                                            isPercentage: tabObj.isPercentage,
                                                        })}
                                                        data={shownData}
                                                    />
                                                </SingleGraphContainer>
                                                {isCompare && (
                                                    <SingleGraphLegendContainer>
                                                        <LegendsTitle>
                                                            {i18nFilter()(
                                                                "app.analysis.engagement.overview.graph.legends.app.title",
                                                            )}
                                                        </LegendsTitle>
                                                        <AppEngagementChannelsLegends
                                                            {...{
                                                                keys: keys,
                                                                data: seriesData,
                                                                selectedMetric: services.i18n(
                                                                    tabObj.title,
                                                                ),
                                                                isPercentage: tabObj.isPercentage,
                                                                onLegendToggle: lagendToggleHandler,
                                                                filter: tabObj.filter,
                                                            }}
                                                        />
                                                    </SingleGraphLegendContainer>
                                                )}
                                            </FlexRow>
                                        )}
                                    </ChartContainer>
                                </SectionContainer>
                            )}
                        </TabPanel>
                    );
                })}
            </Tabs>
        </BoxContainer>
    );
};
