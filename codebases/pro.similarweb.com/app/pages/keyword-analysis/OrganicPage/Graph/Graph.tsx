import { OnOffSwitch } from "@similarweb/ui-components/dist/on-off-switch";
import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import { NoData } from "components/NoData/src/NoData";
import { AddToDashboardButton } from "components/React/AddToDashboard/AddToDashboardButton";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import { Legends } from "components/React/Legends/Legends";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip";
import { i18nFilter } from "filters/ngFilters";
import * as _ from "lodash";
import { isWeeklyKeywordsAvailable } from "pages/keyword-analysis/common/UtilityFunctions";
import {
    KeywordMetricsSubTitle,
    MetricTitle,
} from "pages/keyword-analysis/KeywordsOverviewPage/Components/UtilityComponents";
import { MetricContainer } from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";
import { getBaseChartConfig } from "pages/keyword-analysis/OrganicPage/Graph/GraphConfig";
import { GraphContent } from "pages/keyword-analysis/OrganicPage/Graph/GraphContent";
import {
    EGraphGranularities,
    EGraphType,
    getGraphData,
    OTHERS_DOMAIN_NAME,
} from "pages/keyword-analysis/OrganicPage/Graph/GraphData";
import { PieChart } from "pages/keyword-analysis/OrganicPage/Graph/PieChart/PieChart";
import {
    DailyGranularityTooltipContent,
    WeeklyGranularityTooltipContent,
} from "pages/keyword-analysis/WeeklyKeywordsUtils";
import { MTDTitle } from "pages/website-analysis/TrafficAndEngagement/Components/TrafficAndEngagementTabs";
import queryString from "querystring";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DurationService from "services/DurationService";
import { DefaultFetchService } from "services/fetchService";
import { openUnlockModalV2 } from "services/ModalService";
import { allTrackers } from "services/track/track";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import StyledBoxSubtitle from "styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { chartTypes } from "UtilitiesAndConstants/Constants/ChartTypes";
import {
    addPartialDataZones,
    getMonthsToDateTooltipText,
} from "UtilitiesAndConstants/UtilityFunctions/monthsToDateUtilityFunctions";
import { GraphPngHeader } from "./GraphPngHeader";
import {
    ActionsWrapper,
    ComponentsContainer,
    ComponentsDelimiter,
    Container,
    GraphContainer,
    MonthToDateToggleContainer,
    SwitcherGranularity,
} from "./styledComponents";
import { PdfExportService } from "services/PdfExportService";
import { apiHelper } from "common/services/apiHelper";

const i18n = i18nFilter();

/** Create items for dropdowns */
const getGraphTypesToggleItems = (isMarketShareDisable) => {
    return [
        {
            id: "Trend",
            title: i18n("keywordanalysis.graph.toggle.traffictrend.text"),
            tooltipText: i18n("keywordanalysis.graph.toggle.traffictrend.tooltip"),
            disabled: false,
        },
        {
            id: "MarketShare",
            title: i18n("keywordanalysis.graph.toggle.marketshare.text"),
            tooltipText: i18n("keywordanalysis.graph.toggle.marketshare.tooltip"),
            disabled: isMarketShareDisable,
        },
    ];
};

const getTimeGranularityToggleItems = (isDailyDisabled, isMonthlyDisabled, isWeeklyDisabled) => {
    return [
        {
            title: i18n("timegranularity.day.symbol"),
            tooltipText: (
                <DailyGranularityTooltipContent
                    isDailyKeywordsAvailable={isWeeklyKeywordsAvailable(swSettings)}
                />
            ),
            disabled: isDailyDisabled,
        },
        {
            title: i18n("timegranularity.week.symbol"),
            tooltipText: (
                <WeeklyGranularityTooltipContent
                    isWeeklyKeywordsAvailable={isWeeklyKeywordsAvailable(swSettings)}
                />
            ),
            disabled: isWeeklyDisabled,
        },
        {
            title: i18n("timegranularity.month.symbol"),
            tooltipText: null,
            disabled: isMonthlyDisabled,
        },
    ];
};

// this function flatten the selected sites from the redux, i.e:
// [{Domain: 'apple.com', Children: [{Domain: 'us.apple.com'}]}] to [{Domain: 'apple.com'}, {Domain: 'us.apple.com'}]
const expandSites = (sites: any[] = []) => {
    const flatten = sites.reduce((res, site) => {
        const { Children, Domain } = site;
        res.push(Domain);
        if (Array.isArray(Children)) {
            // only take the first 10 children
            Children.slice(0, 10).forEach((child) => {
                res.push(child.Domain);
            });
        }
        return res;
    }, []);
    // remove duplicated domains
    return Array.from(new Set(flatten).values());
};

const Graph: React.FC<{
    params: {
        keyword?: string;
        webSource: string;
        duration: string;
        country: number;
        keys: string;
        mtd?: string;
    };
    pngHeaderDataTypeKey: string;
    isMarketShareDisable?: boolean;
    isDailyDisabled?: boolean;
    isWeeklyDisabled?: boolean;
    isMonthlyDisable?: boolean;
    initialGranularity?: EGraphGranularities;
    disableGranularities?: boolean;
    graphApiEndpoint: string;
    sites: Array<{ Domain: string; selectionColor: string }>;
    onOpenAddToDashboardModal?: (modal) => void;
    addToDashboardMetric?: string;
    excelMetric?: string;
    isKeywordsGroup?: boolean;
    isMonthsToDateSupported?: boolean;
    mtdToggleClickedCallback?: (monthToDataValue: boolean) => void;
    onTimeGranularityToggleCallback?: (
        isMonthlyGranularity: boolean,
        isMonthToDateIsOffByUser: boolean,
    ) => void;
}> = (props) => {
    const [graphInternalData, setGraphInternalData] = useState<any>();
    const [graphType, setGraphType] = useState<EGraphType>(EGraphType.TRAFFIC_TREND);
    const [graphGranularity, setGraphGranularity] = useState<EGraphGranularities>(
        props.initialGranularity,
    );
    const [isLoading, setIsLoading] = useState(true);
    const [hiddenSites, setHiddenSites] = useState([]);
    const [error, setError] = useState<boolean>(false);
    const [excelUrl, setExcelUrl] = useState<string>();
    /*
    sometimes we have to turn the months to date toggle off. In case we have turned it off and not the user, we will turn it on when it's possible.
    the 'isMonthToDateIsOffByUser' variable helps us to define whether the user turned off the toggle or we did
    */
    const [isMonthToDateIsOffByUser, setIsMonthToDateIsOffByUser] = useState(false);
    const graphTypesToggleItems = useMemo(() => {
        return getGraphTypesToggleItems(props.isMarketShareDisable);
    }, [props.isMarketShareDisable]);
    const {
        isMonthsToDateSupported,
        isDailyDisabled,
        isMonthlyDisable: isMonthlyDisableProps,
        isWeeklyDisabled,
        pngHeaderDataTypeKey,
    } = props;
    const { duration } = props.params;

    const isMonthlyDisable = isMonthlyDisableProps || duration === "28d";

    const timeGranularityToggleItems = useMemo(() => {
        return getTimeGranularityToggleItems(isDailyDisabled, isMonthlyDisable, isWeeklyDisabled);
    }, [isDailyDisabled, isMonthlyDisable]);
    const isMonthsToDateActive = isMonthsToDateSupported && props.params?.mtd === true.toString();

    useEffect(() => {
        if (DurationService.isGreaterThanThreeMonths(props.params.duration)) {
            setGraphGranularity(EGraphGranularities.MONTHLY);
        }
    }, [props.params.duration]);

    useEffect(() => {
        const getData = async () => {
            setIsLoading(true);
            const apiParams = apiHelper.transformParamsForAPI({
                ...props.params,
                includeSubDomains: true,
                keys: props.params.keyword,
                timeGranularity:
                    graphGranularity === EGraphGranularities.MONTHLY ? "Monthly" : "Weekly",
            });
            apiParams.sites = expandSites(props.sites).join(",");
            isMonthsToDateActive ? (apiParams.latest = "l") : delete apiParams.latest;
            const queryStringParams = queryString.stringify(apiParams);
            const queryStringParamsForExcel = queryString.stringify({
                ...apiParams,
                timeGranularity:
                    graphGranularity === EGraphGranularities.DAILY ? "Daily" : "Weekly",
            });
            const url = `${props.graphApiEndpoint}?${queryStringParams}`;
            try {
                const data = await DefaultFetchService.getInstance().get<{ Data: object }>(url);
                setGraphInternalData(data.Data);
                setError(false);
                setExcelUrl(
                    `/widgetApi/KeywordAnalysisOP/${props.excelMetric}/TrafficDistributionExcel?${queryStringParamsForExcel}`,
                );
            } catch (e) {
            } finally {
                setIsLoading(false);
            }
        };
        if (Array.isArray(props.sites)) {
            if (props.sites.length > 0) {
                getData();
            } else {
                setIsLoading(false);
                setError(true);
                setGraphInternalData([]);
            }
        }
    }, [props.sites, props.params, graphGranularity, props.params.mtd]);
    const { to } = DurationService.getDurationData(props.params.duration).forAPI;
    const lastSupportedDate = isMonthsToDateActive
        ? swSettings.current.lastSupportedDailyDate
        : to.replace(/\|/g, "/");
    const graphConfig = useMemo(() => {
        const config = getBaseChartConfig({
            webSource: props.params.webSource,
            timeGranularity: graphGranularity,
            lastSupportedDate,
        });
        config.stacked = true;
        return config;
    }, [graphGranularity, isMonthsToDateActive]);

    const isOneMonth = useMemo(() => {
        return (
            duration === "1m" ||
            (duration !== "28d" && DurationService.isLessThanOrEqualToOneMonths(duration))
        );
    }, [duration]);

    const isPieChart = graphGranularity === EGraphGranularities.MONTHLY && isOneMonth;

    const graphData = useMemo(() => {
        if (graphInternalData) {
            const getGraphDataResults = getGraphData({
                graphData: graphInternalData,
                sites: props.sites,
                graphGranularity,
                hiddenSites,
                graphType,
                webSource: props.params.webSource,
                lastSupportedDate,
                isPieChart,
            });
            return addPartialDataZones(getGraphDataResults, { chartType: chartTypes.AREA });
        }
    }, [graphInternalData, props.sites, hiddenSites, graphType]);
    const toggleSeries = useCallback(
        (legendItem: any, hidden: boolean, event: MouseEvent, reRenderLegendsComponent?: any) => {
            allTrackers.trackEvent(
                "Click Filter",
                legendItem.visible ? "remove" : "click",
                `Traffic share/${legendItem.name}`,
            );
            const index = hiddenSites.findIndex((name) => name === legendItem.name);
            if (index > -1) {
                const newHiddenSites = [...hiddenSites];
                newHiddenSites.splice(index, 1);
                setHiddenSites(newHiddenSites);
            } else {
                setHiddenSites([...hiddenSites, legendItem.name]);
            }
        },
        [hiddenSites],
    );
    const chartRef = useRef<HTMLDivElement>();
    const setChartRef = (ref) => {
        chartRef.current = ref;
    };
    const a2d = () => {
        allTrackers.trackEvent("Pop up", "open", `Add to my Dashboard/Traffic distribution`);
        const $modal = Injector.get<any>("$modal");
        const addToDashboardModal = $modal.open({
            animation: true,
            controller: "widgetAddToDashboardController as ctrl",
            templateUrl: "/app/components/widget/widget-add-to-dashboard-modal.html",
            windowClass: "add-to-dashboard-modal",
            resolve: {
                widget: () => null,
                customModel: () => {
                    return Injector.get<any>("widgetModelAdapterService").fromKeyword(
                        props.addToDashboardMetric,
                        "KeywordsGraphDashboard",
                        props.params.webSource,
                        {
                            includeSubDomains: true,
                            shareType:
                                graphType === EGraphType.TRAFFIC_TREND ? "RelativeShare" : "Share",
                            timeGranularity: "Monthly",
                            sites: expandSites(props.sites).join(","),
                        },
                    );
                },
            },
            scope: Injector.get<any>("$rootScope").$new(true),
        });
        props.onOpenAddToDashboardModal(addToDashboardModal);
    };
    const legends = (props.sites || []).map(({ Domain, selectionColor }) => ({
        name: Domain,
        color: selectionColor,
        visible: !hiddenSites.includes(Domain),
    }));

    if (graphType === EGraphType.MARKET_SHARE || isPieChart) {
        legends.push({
            name: OTHERS_DOMAIN_NAME,
            color: "#E6E6E6",
            visible: !hiddenSites.includes(OTHERS_DOMAIN_NAME),
        });
    }

    /** filter change callbacks **/
    const onGraphTypeToggle = (id) => {
        setGraphType(id as EGraphType);
        TrackWithGuidService.trackWithGuid("keyword.research.common.tabs", "switch", {
            selectedTab: EGraphType[id],
        });
    };
    const onTimeGranularityToggle = (id: EGraphGranularities) => {
        if (
            !isWeeklyKeywordsAvailable(swSettings) &&
            [EGraphGranularities.DAILY, EGraphGranularities.WEEKLY].includes(id)
        ) {
            openUnlockModalV2("WeeklyKeywords");
        } else {
            if (props.onTimeGranularityToggleCallback) {
                props.onTimeGranularityToggleCallback(
                    id === EGraphGranularities.MONTHLY,
                    isMonthToDateIsOffByUser,
                );
            }
            setGraphGranularity(id);
        }
        TrackWithGuidService.trackWithGuid("keyword.research.common.time.granularity", "switch", {
            timeGranularity: EGraphGranularities[id],
        });
    };
    // TODO: liorb - consolidate with app/pages/website-analysis/TrafficAndEngagement/UtilityFunctionsAndConstants/UtilityFunctions.tsx
    const onPngDownload = () => {
        const domElement = chartRef.current;
        const pngHeaderStyle = (domElement.children[0] as any).style;
        pngHeaderStyle.display = "block";
        allTrackers.trackEvent("Download", "submit-ok", `Traffic share/PNG`);
        const offSetX = 0;
        const offSetY = 50;
        // TODO: this should be exported to a common place - tech debt
        const styleHTML = Array.from(document.querySelectorAll("style"))
            .map((stylesheet) => stylesheet.outerHTML)
            .join("");
        PdfExportService.downloadHtmlPngFedService(
            styleHTML + domElement.outerHTML,
            "Traffic distribution",
            domElement.offsetWidth + offSetX,
            domElement.offsetHeight + offSetY,
        );
        pngHeaderStyle.display = "none";
    };
    const showNoSitesSelection =
        Array.isArray(props.sites) &&
        props.sites.length > 0 &&
        legends.every(({ visible }) => visible === false);

    // shoe excel button on 1m or 28d, And if the duration is 3m and more, only on weekly or daily
    const showExcelButton =
        ["28d", "1m"].includes(props.params.duration) ||
        graphGranularity !== EGraphGranularities.MONTHLY;
    const showAddToDashboard = !showExcelButton;
    const mtdToggleClicked = () => {
        const isMonthsToDateActiveNewValue = !isMonthsToDateActive;
        setIsMonthToDateIsOffByUser(!isMonthsToDateActiveNewValue);
        if (isMonthsToDateActiveNewValue && graphGranularity === EGraphGranularities.MONTHLY) {
            setGraphGranularity(EGraphGranularities.WEEKLY);
        }
        props.mtdToggleClickedCallback &&
            props.mtdToggleClickedCallback(isMonthsToDateActiveNewValue);

        TrackWithGuidService.trackWithGuid("keyword.research.common.month.to.date", "switch", {
            monthToDateValue: isMonthsToDateActiveNewValue ? "on" : "off",
        });
    };
    return (
        // fixed height in order to prevent the page from 'jumping' up when websites
        <MetricContainer width="100%" height={isPieChart ? "500px" : "690px"} padding={"none"}>
            <Container>
                <ComponentsContainer>
                    <ActionsWrapper>
                        <FlexRow>
                            {isMonthsToDateSupported && (
                                <MonthToDateToggleContainer>
                                    <PlainTooltip
                                        enabled={true}
                                        text={getMonthsToDateTooltipText(
                                            true,
                                            isMonthsToDateActive,
                                        )}
                                    >
                                        <MTDTitle onClick={mtdToggleClicked} isDisabled={false}>
                                            <OnOffSwitch
                                                isSelected={isMonthsToDateActive}
                                                onClick={_.noop}
                                                isDisabled={false}
                                            />
                                            <StyledBoxSubtitle>
                                                <span>
                                                    {i18n(
                                                        "wa.traffic.engagement.over.time.mtd.toggle_label",
                                                    )}
                                                </span>
                                            </StyledBoxSubtitle>
                                        </MTDTitle>
                                    </PlainTooltip>
                                </MonthToDateToggleContainer>
                            )}
                            {!props.disableGranularities && (
                                <SwitcherGranularity
                                    itemList={timeGranularityToggleItems}
                                    selectedIndex={graphGranularity}
                                    onItemClick={onTimeGranularityToggle}
                                    className={"gran-switch"}
                                    customClass={"CircleSwitcher"}
                                />
                            )}
                        </FlexRow>
                        {showExcelButton && (
                            <a href={excelUrl}>
                                <DownloadButtonMenu
                                    Excel={true}
                                    excelLocked={false}
                                    downloadUrl={excelUrl}
                                    exportFunction={() => null}
                                />
                            </a>
                        )}
                        <DownloadButtonMenu PNG={true} exportFunction={onPngDownload} />
                        {showAddToDashboard && <AddToDashboardButton onClick={a2d} />}
                    </ActionsWrapper>
                    <MetricTitle headline={i18n("keywords.research.common.traffic.chart.header")} />
                    <KeywordMetricsSubTitle webSource={props.params.webSource} />
                </ComponentsContainer>
                <ComponentsDelimiter />
                <ComponentsContainer style={{ padding: "16px", height: "80%" }}>
                    {isPieChart ? (
                        <div ref={setChartRef}>
                            <GraphPngHeader
                                params={props.params}
                                isKeywordsGroup={props.isKeywordsGroup}
                                pngHeaderDataTypeKey={pngHeaderDataTypeKey}
                            />
                            <PieChart
                                graphData={graphData}
                                legends={legends}
                                toggleSeries={toggleSeries}
                                isLoading={isLoading}
                                timeGranularity={graphGranularity}
                                lastSupportedDate={lastSupportedDate}
                            />
                        </div>
                    ) : (
                        <div>
                            <div
                                style={{
                                    marginBottom: 20,
                                }}
                            >
                                <SwitcherGranularity
                                    itemList={graphTypesToggleItems}
                                    selectedIndex={graphType}
                                    onItemClick={onGraphTypeToggle}
                                    className={"gran-switch"}
                                    customClass={"CircleSwitcher"}
                                />
                            </div>
                            <GraphContainer className="sharedTooltip" ref={setChartRef}>
                                <GraphPngHeader
                                    params={props.params}
                                    isKeywordsGroup={props.isKeywordsGroup}
                                    pngHeaderDataTypeKey={pngHeaderDataTypeKey}
                                />
                                <Legends legendItems={legends} toggleSeries={toggleSeries} />
                                {showNoSitesSelection ? (
                                    <NoData
                                        title={i18n("KeywordAnalysis.chart.sot.nodata")}
                                        subtitle=""
                                        iconName="warning"
                                    />
                                ) : (
                                    <div className="chartContainer">
                                        <GraphContent
                                            isLoading={isLoading}
                                            graphData={error ? [] : graphData}
                                            graphConfig={graphConfig}
                                        />
                                    </div>
                                )}
                            </GraphContainer>
                        </div>
                    )}
                </ComponentsContainer>
            </Container>
        </MetricContainer>
    );
};

Graph.defaultProps = {
    initialGranularity: EGraphGranularities.MONTHLY,
    disableGranularities: false,
    onOpenAddToDashboardModal: (modal) => null,
};

export default Graph;
