import { colorsPalettes } from "@similarweb/styles";
import { OnOffSwitch } from "@similarweb/ui-components/dist/on-off-switch";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { swSettings } from "common/services/swSettings";
import BoxSubtitle from "components/BoxSubtitle/src/BoxSubtitle";
import BoxTitle from "components/BoxTitle/src/BoxTitle";
import { NoDataTitle } from "components/NoData/src/NoData";
import { CircularLoader } from "components/React/CircularLoader";
import { i18nFilter } from "filters/ngFilters";
import _ from "lodash";
import {
    BoxContainer,
    ContentContainer,
    StyledHeaderTitle,
    TitleContainer,
} from "pages/conversion/components/benchmarkOvertime/StyledComponents";
import { SwitcherGranularityContainer } from "pages/website-analysis/components/SwitcherGranularityContainer";
import { ChannelAnalysisChart } from "pages/website-analysis/traffic-sources/mmx/components/ChannelAnalysisChart/ChannelAnalysisChart";
import {
    useAddToDashboard,
    useData,
    useGranularities,
    useMTD,
} from "pages/website-analysis/traffic-sources/mmx/components/ChannelAnalysisChart/ChannelAnalysisChartContainerHooks";
import { mobileWeb } from "pages/website-analysis/traffic-sources/mmx/components/ChannelAnalysisChart/consts";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { connect } from "react-redux";
import CountryService from "services/CountryService";
import { DurationService } from "services/DurationService";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import StyledBoxSubtitle from "styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import { FlexColumn, FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";
import { monthToDateTracking } from "UtilitiesAndConstants/UtilityFunctions/monthsToDateUtilityFunctions";
import { calcInsights } from "pages/website-analysis/traffic-sources/mmx/components/InsightsAssistant/insights-calculator";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import ABService from "services/ABService";
import { CircleSwitcherItem, Switcher } from "@similarweb/ui-components/dist/switcher";
import { MMXAlertWithPlainTooltip } from "components/MMXAlertWithPlainTooltip";
import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";
import dayjs from "dayjs";
import { parseData } from "../InsightsAssistant/data-parser";
import { IInsightProps } from "pages/website-analysis/traffic-sources/mmx/components/InsightsAssistant/InsightsContainer";

interface IChannelAnalysisChartStateToProps {
    country: string;
    webSource: string;
    duration: string;
    comparedDuration?: string;
    isWWW: string;
    sites: string;
}

export interface IChannelAnalysisChartProps {
    webSources: { value: string; title: string; buttonClass: string; iconClass: string }[];
    chosenSites: IChosenSites;
    swNavigator: SwNavigator;
    durationService: DurationService;
    ctrl: any;
    channelAnalysisMtd: string;
    channelAnalysisGranularity: string;
    channelAnalysisChannel: string;
    channelAnalysisMetric: string;
}

type IChannelAnalysisChartContainerProps = IChannelAnalysisChartStateToProps &
    IChannelAnalysisChartProps;

export interface ISiteLegendItem {
    name: string;
    color: string;
    icon: string;
    image: string;
    smallIcon: boolean;
}

interface IChosenSites {
    sitelistForLegend(): ISiteLegendItem[];
    count: () => number;
    listInfo: {};
}

function SubTitle({ fromDate, toDate, country, webSource, duration }) {
    const subtitleFilters = useMemo(
        () => [
            {
                filter: "date",
                value: {
                    from: fromDate.valueOf(),
                    to: toDate.valueOf(),
                    useRangeDisplay:
                        duration !== "28d" &&
                        fromDate.format("YYYY-MM") !== toDate.format("YYYY-MM"),
                },
            },
            {
                filter: "country",
                countryCode: country,
                value: CountryService.getCountryById(country)?.text,
            },
            {
                filter: "webSource",
                value: webSource,
            },
        ],
        [fromDate, toDate, country, webSource, duration],
    );
    return <BoxSubtitle filters={subtitleFilters} />;
}

const Wrapper = styled.div`
    margin-bottom: 22px;
    .gran-switch span:last-child button {
        border-right: 1px solid ${colorsPalettes.carbon["50"]};
    }
    scroll-margin-top: 40px;
`;

export const Content = styled(ContentContainer)`
    padding-top: 0;
    justify-content: center;
    align-items: center;
    min-height: 283px;
    ${NoDataTitle} {
        max-width: none;
    }
`;

const Title = styled(TitleContainer)`
    padding: 16px 16px 24px 24px;
`;

const RightSection = styled(FlexRow)`
    align-items: center;
`;

const MTDLabel = styled.span`
    margin: 0 16px 0 8px;
`;

export const MTDTitle = styled(FlexRow)`
    cursor: pointer;
`;

const StyledSwitcher = styled(Switcher)`
    height: 40px;
`;

const MMXAlertWrapper = styled.div`
    margin-top: 3px;
    align-self: center;
    margin-left: 2px;
`;

const mapTabToMetricAndType = {
    TrafficShare: {
        metric: "ChannelsAnalysisByTrafficShare",
        type: "MmxTrafficShareDashboard",
    },
    AverageDuration: {
        metric: "ChannelsAnalysisByAverageDuration",
        type: "MmxVisitDurationDashboard",
    },
    PagesPerVisit: {
        metric: "ChannelsAnalysisByPagesPerVisit",
        type: "MmxPagesPerVisitDashboard",
    },
    BounceRate: {
        metric: "ChannelsAnalysisByBounceRate",
        type: "MmxBounceRateDashboard",
    },
};

const ChannelAnalysisChartContainer: React.FunctionComponent<IChannelAnalysisChartContainerProps> = ({
    channelAnalysisMtd,
    channelAnalysisMetric = "TrafficShare",
    channelAnalysisGranularity,
    channelAnalysisChannel = "Direct",
    country,
    duration,
    comparedDuration,
    sites: key,
    isWWW,
    webSource,
    chosenSites,
    durationService,
    ctrl,
    swNavigator,
}) => {
    const component = swSettings.current;
    const newMMXAlgoStartData = component.resources.NewAlgoMMX;
    const durationObject = useMemo(
        () => durationService.getDurationData(duration, comparedDuration),
        [duration, comparedDuration, component],
    );
    const periodDuration = useMemo(
        () => durationObject.raw.to.diff(durationObject.raw.from, "months"),
        [durationObject],
    );
    const updateUrlParam = (granularity) => {
        // without settimeout $digest already in progress error occurs
        setTimeout(
            () => swNavigator.applyUpdateParams({ channelAnalysisGranularity: granularity.value }),
            0,
        );
    };
    const { selectedGranularity, availableGranularities, updateGranularity } = useGranularities({
        isMobileWeb,
        isWindow,
        isPeriodOverPeriod,
        periodDuration,
        urlGranularityParam: channelAnalysisGranularity,
        updateUrlParam,
    });
    const keys = useMemo(() => chosenSites.sitelistForLegend(), [key]);
    const graphComponentRef = useRef<ChannelAnalysisChart>();
    const wrapperRef = React.useRef<HTMLInputElement>(null);
    const [selectedVisualizationIndex, setSelectedVisualizationIndex] = useState<number>(1);
    const showInsights = useMemo(
        () =>
            selectedGranularity.value !== "Daily" &&
            periodDuration < 3 &&
            webSource === "Desktop" &&
            !isPeriodOverPeriod(),
        [selectedGranularity],
    );
    const vwoShowTrendsFirst = ABService.getFlag("vwoShowTrendsFirst");

    function isMobileWeb() {
        return webSource?.toLowerCase() === mobileWeb.toLowerCase();
    }

    function isWindow() {
        return durationObject.forAPI.isWindow;
    }

    function isPeriodOverPeriod() {
        return ctrl.isDurationCompare;
    }

    function isComparePop() {
        return isPeriodOverPeriod() && chosenSites.count() >= 1;
    }

    const { isMTDActive, isMTDSupported, setMTD } = useMTD({
        isWindow,
        isMobileWeb,
        isPeriodOverPeriod,
        durationObject,
        component,
        urlMtdParam: channelAnalysisMtd ? JSON.parse(channelAnalysisMtd) : null, // Converting "false" to boolean. since Boolean("false") > true ¯\_(ツ)_/¯
    });

    function toggleGranularity(index) {
        const nextGranularity = availableGranularities.find(({ index: idx }) => idx === index)
            .value;
        swNavigator.applyUpdateParams({ channelAnalysisGranularity: nextGranularity });
        updateGranularity(nextGranularity);
        TrackWithGuidService.trackWithGuid(
            "website_analysis.marketing_channels.channel_analysis.change_granularity",
            "switch",
            {
                metric: channelAnalysisMetric,
                granularity: nextGranularity,
            },
        );
    }

    function toggleMTD() {
        const nextMTD = !isMTDActive;
        swNavigator.applyUpdateParams({ channelAnalysisMtd: nextMTD });
        setMTD();
        monthToDateTracking("website_analysis.marketing_channels.channel_analysis.toggle_mtd")(
            nextMTD,
        );
    }
    const handleChannelFilterChange = (value) => {
        swNavigator.applyUpdateParams({ channelAnalysisChannel: value });
    };
    const handleMetricChange = (index) => {
        swNavigator.applyUpdateParams({ channelAnalysisMetric: index });
    };

    function getLastWindowDate() {
        return swSettings.current.lastSupportedDailyDate;
    }

    function getDateRange(durationObject, component, isMTDActive) {
        if (!isMTDActive) {
            return [durationObject.raw.from, durationObject.raw.to];
        }
        return [durationObject.raw.from, getLastWindowDate()];
    }

    const { data, isFetching, getExcelUrl } = useData(
        { country, duration, isWWW, key, webSource },
        durationObject,
        isMTDActive,
        selectedGranularity,
    );
    const [startDate, endDate] = getDateRange(durationObject, component, false); // regular from,to (not includes MTD)
    const [fromDate, toDate] = getDateRange(durationObject, component, isMTDActive); // real date range which can be affected by MTD

    const insights = useMemo(() => {
        if (data && !isFetching) {
            return getInsights();
        }
    }, [data, isFetching]);

    function getMTDTooltipContent() {
        return i18nFilter()("wa.mmx.channel_analysis.mtd.tooltip.last_available_date", {
            d: getLastWindowDate().format("MMM DD"),
        });
    }

    function getVisioButtons() {
        const visualizations = ["%", "#"];
        const isVisioAllowed = channelAnalysisMetric === "TrafficShare" && !isPeriodOverPeriod();

        return isVisioAllowed ? (
            <StyledSwitcher
                selectedIndex={selectedVisualizationIndex}
                customClass="CircleSwitcher"
                onItemClick={(index) => onVisualizationClick(index, visualizations[index])}
            >
                {visualizations.map((visItem) => {
                    return <CircleSwitcherItem key={visItem}>{visItem}</CircleSwitcherItem>;
                })}
            </StyledSwitcher>
        ) : null;
    }

    const onVisualizationClick = (index, item) => {
        setSelectedVisualizationIndex(index);
        TrackWithGuidService.trackWithGuid(
            "website_analysis.marketing_channels.channel_analysis.measure_button",
            "click",
            { metric: channelAnalysisMetric, view: item[index] },
        );
    };

    const isShowMMXAlertBell = () =>
        webSource === devicesTypes.MOBILE &&
        startDate.isBefore(dayjs(newMMXAlgoStartData)) &&
        endDate.isAfter(dayjs(newMMXAlgoStartData));

    const mtdTooltipText = getMTDTooltipContent();
    const { addToDashboard } = useAddToDashboard();
    const getDashboardModel = useCallback(
        ({ metric, selectedChannel }) => {
            const baseModel = Injector.get("widgetModelAdapterService").fromWebsite(
                ...Object.values(mapTabToMetricAndType[metric]),
                webSource,
                false,
                {
                    timeGranularity: selectedGranularity.value,
                },
            );
            return {
                ...baseModel,
                ...(!!selectedChannel && { selectedChannel }),
            };
        },
        [webSource, selectedGranularity],
    );
    const onAddToDash = useCallback(
        (params) => {
            addToDashboard(() => getDashboardModel(params));
        },
        [addToDashboard, getDashboardModel],
    );

    function getInsights(): IInsightProps[] {
        if (showInsights) {
            const parsedData = parseData(
                data,
                selectedGranularity.value,
                "TrafficShare",
                isMTDActive,
                getLastWindowDate(),
                chosenSites,
            );
            return calcInsights(parsedData, selectedGranularity.value, vwoShowTrendsFirst);
        }
    }

    const getTitleTooltip = () => {
        return isComparePop()
            ? "wa.mmx.channel_analysis.compare_pop.title.tooltip"
            : "wa.mmx.channel_analysis.title.tooltip";
    };

    const getTitle = () => {
        return isComparePop()
            ? "wa.mmx.channel_analysis.compare_pop.title"
            : "wa.mmx.channel_analysis.title";
    };

    return (
        <>
            <Wrapper ref={wrapperRef}>
                <BoxContainer data-automation-channel-analysis={true}>
                    <Title>
                        <FlexColumn>
                            <StyledHeaderTitle>
                                <BoxTitle
                                    tooltip={i18nFilter()(getTitleTooltip())}
                                    customElement={
                                        isShowMMXAlertBell() && (
                                            <MMXAlertWrapper>
                                                <MMXAlertWithPlainTooltip />
                                            </MMXAlertWrapper>
                                        )
                                    }
                                >
                                    {i18nFilter()(getTitle())}
                                </BoxTitle>
                            </StyledHeaderTitle>
                            <StyledBoxSubtitle>
                                <SubTitle
                                    fromDate={fromDate}
                                    toDate={toDate}
                                    duration={duration}
                                    country={country}
                                    webSource={webSource}
                                />
                            </StyledBoxSubtitle>
                        </FlexColumn>
                        <RightSection>
                            {isMTDSupported && (
                                <PlainTooltip
                                    enabled={!!mtdTooltipText}
                                    tooltipContent={mtdTooltipText}
                                >
                                    <MTDTitle onClick={toggleMTD}>
                                        <OnOffSwitch isSelected={isMTDActive} onClick={_.noop} />
                                        <StyledBoxSubtitle>
                                            <MTDLabel>
                                                {i18nFilter()(
                                                    "wa.mmx.channel_analysis.mtd.toggle_label",
                                                )}
                                            </MTDLabel>
                                        </StyledBoxSubtitle>
                                    </MTDTitle>
                                </PlainTooltip>
                            )}
                            {getVisioButtons()}
                            <SwitcherGranularityContainer
                                itemList={availableGranularities}
                                selectedIndex={selectedGranularity["index"]}
                                className={"gran-switch"}
                                onItemClick={toggleGranularity}
                            />
                        </RightSection>
                    </Title>
                    <Content>
                        <>
                            {isFetching ? (
                                <CircularLoader
                                    options={{
                                        svg: {
                                            stroke: "#dedede",
                                            strokeWidth: "4",
                                            r: 21,
                                            cx: "50%",
                                            cy: "50%",
                                        },
                                        style: {
                                            width: 46,
                                            height: 46,
                                        },
                                    }}
                                />
                            ) : (
                                <ChannelAnalysisChart
                                    ref={graphComponentRef}
                                    isLoading={isFetching}
                                    startDate={startDate.format("YYYY-MM-DD")}
                                    endDate={endDate.format("YYYY-MM-DD")}
                                    mtdStartDate={endDate
                                        .clone()
                                        .add(1, "days")
                                        .startOf("day")
                                        .format("YYYY-MM-DD")}
                                    mtdEndDate={getLastWindowDate().format("YYYY-MM-DD")}
                                    isMTDOn={isMTDActive}
                                    selectedGranularity={selectedGranularity.value}
                                    data={data}
                                    isPoP={isPeriodOverPeriod()}
                                    getExcelUrl={getExcelUrl}
                                    keys={keys}
                                    webSource={webSource}
                                    durationObject={durationObject}
                                    addToDashboard={onAddToDash}
                                    selectedChannelFilter={channelAnalysisChannel}
                                    handleChannelFilterChange={handleChannelFilterChange}
                                    selectedMetric={channelAnalysisMetric}
                                    handleMetricChange={handleMetricChange}
                                    showInsights={showInsights}
                                    domain={key}
                                    insights={insights}
                                    selectedVisualizationIndex={selectedVisualizationIndex}
                                    setSelectedVisualizationIndex={setSelectedVisualizationIndex}
                                    isShowMMXAlertBell={isShowMMXAlertBell()}
                                />
                            )}
                        </>
                    </Content>
                </BoxContainer>
            </Wrapper>
        </>
    );
};

const mapStateToProps = ({ routing }) => ({
    ...routing.params,
    sites: routing.params.key,
    stateConfig: routing.stateConfig,
});

export default SWReactRootComponent(
    connect(mapStateToProps, null)(ChannelAnalysisChartContainer),
    "ChannelAnalysisChartContainer",
);
