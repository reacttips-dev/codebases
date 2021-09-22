import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import { Button, IconButton } from "@similarweb/ui-components/dist/button";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import BoxSubtitle from "components/BoxSubtitle/src/BoxSubtitle";
import GAVerifiedContainer from "components/React/GAVerifiedIcon/GAVerifiedContainer";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import {
    i18nFilter,
    minVisitsAbbrFilter,
    percentageFilter,
    swNumberFilter,
    timeFilter,
} from "filters/ngFilters";
import React from "react";
import CountryService from "services/CountryService";
import DurationService from "services/DurationService";
import { openUnlockModalV2, openUnlockModal } from "services/ModalService";
import StyledBoxSubtitle from "styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import { StyledPill } from "styled components/StyledPill/src/StyledPill";
import styled from "styled-components";
import { getWidgetCTATarget } from "components/widget/widgetUtils";
import { isAvailable } from "common/services/pageClaims";

const WidgetContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
`;
const WidgetHeaderContainer = styled.div`
    height: 84px;
    border-bottom: 1px solid ${colorsPalettes.carbon["50"]};
    display: flex;
    flex-direction: column;
    padding-left: 24px;
`;
const WidgetContentContainer = styled.div`
    padding-left: 24px;
    padding-right: 20px;
    height: 100%;
`;
const WidgetFooterContainer = styled.div`
    height: 51px;
    border-top: 1px solid ${colorsPalettes.carbon["50"]};
    padding-right: 24px;
    padding-left: 24px;
    display: flex;
    flex-direction: row-reverse;
    flex-shrink: 0;
    align-items: center;
`;
const TitleContainer = styled.div`
    margin: 20px 0 4px 0;
    display: flex;
    flex-direction: row;
    height: 20px;
`;
const Header = styled.div`
    font-size: 20px;
    color: ${colorsPalettes.carbon["500"]};
    margin-right: 4px;
    font-weight: 500;
`;

const SubTitleContainer = styled.div`
    margin-bottom: 20px;
    div {
        font-size: 13px;
    }
`;
const MetricsContainer = styled.div`
    display: flex;
    flex-direction: row;
    height: 100%;
    justify-content: space-between;
`;
const MetricContainer = styled.div`
    display: flex;
    flex-direction: row;
    height: 40px;
    justify-content: space-between;
    align-items: center;
`;
const MetricLeftSide = styled.div`
    display: flex;
    flex-direction: row;
    margin-right: 16px;
    align-items: center;
`;
const MetricIcon = styled(SWReactIcons)`
    width: 24px;
    height: 24px;
    margin-right: 16px;
`;
const MetricName = styled.div`
    font-size: 14px;
    margin-right: 6px;
`;
const MetricValue = styled.div`
    font-size: 24px;
    margin-right: 3px;
`;
const TooltipIcon = styled(SWReactIcons)`
    height: 16px;
    width: 16px;
`;
const MetricsColumn = styled.div.attrs<{ width?: string }>((props) => ({
    width: props.width || "30%",
}))<{ width?: string }>`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    min-width: ${(props) => props.width};
`;
const GreenPill = styled(StyledPill)`
    background-color: #4fc3a0;
    margin-left: 5px;
`;
const OrangePill = styled(StyledPill)`
    background-color: #f58512;
    margin-left: 5px;
`;
const MetricValueContainer = styled.div`
    display: flex;
`;

const EngagementOverviewKpi = ({ data, params, defaultTargetState, defaultIsSameModule }) => {
    data.Source = data.Source ? data.Source : "Total";
    const i18n = i18nFilter();
    const swNavigator = Injector.get<any>("swNavigator");
    const [dimensions, setDimensions] = React.useState({
        width: window.innerWidth,
    });
    React.useEffect(() => {
        function handleResize() {
            setDimensions({
                width: window.innerWidth,
            });
        }
        window.addEventListener("resize", handleResize, { capture: true });
        return () => window.removeEventListener("resize", handleResize, { capture: true });
    });
    const metrics = {
        AvgMonthVisits: {
            name:
                params.duration === "28d"
                    ? i18n("wa.ao.graph.avgvisitsdaily")
                    : i18n("wa.ao.graph.avgvisits"),
            icon: "visits",
            tooltip:
                params.duration === "28d"
                    ? i18n("wa.ao.graph.avgvisits.tooltip")
                    : i18n("wa.ao.graph.avgvisits.tooltip"),
            filter: minVisitsAbbrFilter,
            beta: false,
            new: false,
        },
        UniqueUsers: {
            name:
                params.duration === "28d"
                    ? i18n("metric.dailyuniquevisitors")
                    : i18n("metric.monthlyuniquevisitors"),
            icon: "monthly-unique-visitors",
            tooltip:
                params.duration === "28d"
                    ? data.isGAVerified
                        ? i18n("metric.dailyuniquevisitors.last28days.ga.error")
                        : i18n("metric.dailyuniquevisitors.tooltip")
                    : i18n("wa.ao.graph.muv.tooltip"),
            filter: minVisitsAbbrFilter,
            beta: false,
            new: params.duration === "28d",
        },
        DedupUniqueUsers: {
            name: i18n("wa.ao.metric.dedup"),
            icon: "users-tab",
            tooltip: i18n("wa.ao.metric.dedup.tooltip"),
            filter: minVisitsAbbrFilter,
            beta: true,
            new: false,
        },
        AvgVisitDuration: {
            name: i18n("analysis.audience.geo.table.columns.AvgTime.title"),
            icon: "avg-visit-duration",
            tooltip: i18n("wa.ao.graph.avgduration.tooltip"),
            filter: timeFilter,
            beta: false,
            new: false,
        },
        PagesPerVisit: {
            name: i18n("analysis.single.audience.overview.visits.page"),
            icon: "pages-per-visit",
            tooltip: i18n("wa.ao.graph.pages.tooltip"),
            filter: swNumberFilter,
            beta: false,
            new: false,
        },
        BounceRate: {
            name: i18n("analysis.single.audience.overview.visits.bounce"),
            icon: "bounce-rate-2",
            tooltip: i18n("wa.ao.graph.bounce.tooltip"),
            filter: percentageFilter,
            beta: false,
            new: false,
        },
    };
    const getMetrics = () => {
        const tempMetrics = { ...metrics };
        data.isGAVerified ? delete tempMetrics.DedupUniqueUsers : null;
        data.Source !== "Total" ? delete tempMetrics.DedupUniqueUsers : null;
        const metricsArr = Object.entries(tempMetrics);
        return metricsArr.map((metric) => getMetricComponent(metric));
    };
    const getMetricComponent = (metric) => {
        const onClick = () => {
            const isUniqueUsers = metric[0] === "UniqueUsers";

            if (!isUniqueUsers && swSettings.user.hasSolution2) {
                openUnlockModalV2("DeduplicatedAudience");
            } else {
                openUnlockModal({
                    modal: isUniqueUsers ? "UniqueVisitors" : "DeduplicationVisits",
                    slide: isUniqueUsers ? "UniqueVisitors" : "DeduplicationVisits",
                });
            }
        };
        const noLast28 = params.duration === "28d" ? metric[0] === "DedupUniqueUsers" : false;
        let lockedMetric = false;
        metric[0] === "DedupUniqueUsers" ? (lockedMetric = !params.DedupPermission) : null;
        metric[0] === "UniqueUsers" ? (lockedMetric = !params.uniqueVisitorsPermission) : null;
        let value;
        if (data[metric[0]]) {
            switch (metric[1].filter) {
                case minVisitsAbbrFilter:
                    value = metric[1].filter()(data[metric[0]]);
                    break;
                case timeFilter:
                    value = metric[1].filter()(data[metric[0]]);
                    break;
                case swNumberFilter:
                    value = metric[1].filter()(data[metric[0]], 2);
                    break;
                case percentageFilter:
                    value = data[metric[0]] ? metric[1].filter()(data[metric[0]], 2) + "%" : "N/A";
                    break;
            }
        } else {
            value = "N/A";
        }
        return (
            <MetricContainer key={metric[1].name}>
                <MetricLeftSide>
                    <MetricIcon iconName={metric[1].icon} />
                    <MetricName>{metric[1].name}</MetricName>
                    <PlainTooltip tooltipContent={metric[1].tooltip}>
                        <div>
                            <TooltipIcon iconName="info" />
                        </div>
                    </PlainTooltip>
                    {metric[1].beta ? <GreenPill>BETA</GreenPill> : null}
                    {metric[1].new ? <OrangePill>NEW</OrangePill> : null}
                </MetricLeftSide>
                {lockedMetric ? (
                    <Button type="upsell" onClick={onClick}>
                        UPGRADE
                    </Button>
                ) : noLast28 ? (
                    <div>{i18n("metric.uniquevisitors.nowindow.message")}</div>
                ) : (
                    <MetricValueContainer>
                        <MetricValue>{value}</MetricValue>
                        {data.isGAVerified ? (
                            <GAVerifiedContainer
                                isActive={data.isGAVerified}
                                isPrivate={data.isGAPrivate}
                                tooltipAvailable={true}
                                tooltipIsActive={false}
                                size={"SMALL"}
                                metric={params.metric}
                            />
                        ) : null}
                    </MetricValueContainer>
                )}
            </MetricContainer>
        );
    };
    const { from, to } = DurationService.getDurationData(params.duration).forAPI;
    const getWebSourceName = (source) => {
        switch (source) {
            case "Total":
                return "All Traffic";
            case "Desktop":
                return "Desktop Only";
            case "MobileWeb":
                return "Mobile Web Only";
        }
    };
    const subtitleFilters = [
        {
            filter: "date",
            value: {
                from,
                to,
            },
        },
        {
            filter: "country",
            countryCode: params.country,
            value: CountryService.getCountryById(params.country).text,
        },
        {
            filter: "webSource",
            value: data.Source,
            displayName: getWebSourceName(data.Source),
        },
    ];
    const getMetricsComponent = (width, metrics) => {
        if (width < 1481) {
            const part1 = metrics.slice(0, 3);
            const part2 = metrics.slice(3);
            return (
                <MetricsContainer>
                    <MetricsColumn width={"45%"}>{part1}</MetricsColumn>
                    <MetricsColumn width={"45%"}>
                        {part2}
                        {part2.length < 3 ? <MetricContainer /> : null}
                    </MetricsColumn>
                </MetricsContainer>
            );
        } else {
            const part1 = metrics.slice(0, 2);
            const part2 = metrics.slice(2, 4);
            const part3 = metrics.slice(4);
            return (
                <MetricsContainer>
                    <MetricsColumn>{part1}</MetricsColumn>
                    <MetricsColumn>{part2}</MetricsColumn>
                    <MetricsColumn>
                        {part3}
                        {part3.length < 2 ? <MetricContainer /> : null}
                    </MetricsColumn>
                </MetricsContainer>
            );
        }
    };
    const [targetState, isSameModule] = getWidgetCTATarget(
        "websites-audienceOverview",
        ["marketresearch", "digitalmarketing", "salesIntelligence"],
        swNavigator,
    );

    const seeMoreLink = swNavigator.href(defaultTargetState || targetState, {
        key: data.Domain,
        country: params.country,
        duration: params.duration,
        webSource: data.Source,
        isWWW: "*",
    });

    const seeMoreLinkTarget = defaultIsSameModule || isSameModule ? "_self" : "_blank";

    const getFooterComponent = () => {
        if (!isAvailable(swSettings.components["WsWebTrafficAndEngagement"])) {
            return (
                <IconButton
                    type={"flat"}
                    iconName="locked"
                    onClick={() => openUnlockModalV2("WebMarketAnalysisOverviewHomepage")}
                >
                    {i18n("wwo.overview.engagement.over.time.button")}
                </IconButton>
            );
        } else {
            return (
                <a href={seeMoreLink} target={seeMoreLinkTarget}>
                    <Button
                        type={"flat"}
                        label={i18n("wwo.overview.engagement.over.time.button")}
                    />
                </a>
            );
        }
    };

    return (
        <WidgetContainer>
            <WidgetHeaderContainer>
                <TitleContainer>
                    <Header>{i18n("wa.ao.engagement.overview")}</Header>
                    <PlainTooltip tooltipContent={i18n("wa.ao.engagement.overview.tooltip")}>
                        <div>
                            <TooltipIcon iconName="info" />
                        </div>
                    </PlainTooltip>
                </TitleContainer>
                <SubTitleContainer>
                    <StyledBoxSubtitle>
                        <BoxSubtitle filters={subtitleFilters} />
                    </StyledBoxSubtitle>
                </SubTitleContainer>
            </WidgetHeaderContainer>
            <WidgetContentContainer>
                {getMetricsComponent(dimensions.width, getMetrics())}
            </WidgetContentContainer>
            <WidgetFooterContainer>{getFooterComponent()}</WidgetFooterContainer>
        </WidgetContainer>
    );
};

SWReactRootComponent(EngagementOverviewKpi, "EngagementOverviewKpi");
