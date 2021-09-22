import { FunctionComponent, useEffect, useState } from "react";
import {
    i18nFilter,
    minAbbrNumberFilter,
    minVisitsAbbrFilter,
    percentageSignFilter,
} from "filters/ngFilters";
import DurationService, { apiFormat } from "services/DurationService";
import { Injector } from "common/ioc/Injector";
import { StyledBox } from "../StyledComponents";
import styled from "styled-components";
import { EmptyState } from "pages/digital-marketing/find-affiliate/by-industry/Components/EmptyState";
import { DefaultFetchService } from "services/fetchService";
import { Loader } from "./Loader";
import { colorsPalettes, rgba } from "@similarweb/styles";
import CoreTrendCell from "components/core cells/src/CoreTrendCell/CoreTrendCell";
import dayjs from "dayjs";
import ReactDOMServer from "react-dom/server";
import { ReferralComponentTitle } from "./ReferralComponentTitle";
import { SwNavigator } from "common/services/swNavigator";
import categoryService from "common/services/categoryService";

const ContentWrapper = styled.div`
    margin: 20px 12px 33px 12px;
`;

const ReferralVisitsWrapper = styled.div`
    color: ${colorsPalettes.carbon[500]};
    font-size: 38px;
    font-weight: 300;
`;

const ReferralVisitsShareWrapper = styled.div`
    display: flex;
    flex-direction: column;
    color: ${rgba(colorsPalettes.carbon[500], 0.8)};
`;

const ReferralVisitsShareText = styled.div`
    font-size: 12px;
`;

const ReferralVisitsSharePercentage = styled.div`
    font-size: 20px;
    padding-bottom: 2px;
`;

const TopPart = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 10px 40px 10px;
`;

const BoldText = styled.span`
    font-weight: bold;
`;

const TooltipContentWrapper = styled.div`
    display: inline;
    white-space: nowrap;
`;

const ValueWrapper = styled.span`
    padding-left: 4px;
    padding-right: 4px;
    color: ${colorsPalettes.midnight[500]};
`;

const TooltipWrapper = styled.div`
    padding: 7px;
    font-size: 12px;
`;

const TextWrapper = styled.span`
    color: ${rgba(colorsPalettes.carbon[500], 0.8)};
`;

interface IData {
    referralVisits: number;
    referralVisitsShare: number;
    referralVisitsGraphData: object[];
}

export const ReferralVisits: FunctionComponent<any> = () => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const { category: categoryQueryParam, country, duration, webSource } = swNavigator.getParams();
    const { forApi: category } = categoryService.categoryQueryParamToCategoryObject(
        categoryQueryParam,
    );
    const { from, to, isWindow } = DurationService.getDurationData(duration).forAPI;
    const usersAllowedStartDate = window.similarweb.settings.components.IndustryAnalysisGeneral?.startDate?.clone();
    const rawFromForGraph = DurationService.getDurationData(duration)
        .raw.to.clone()
        .subtract(11, "month");
    let fromForGraph =
        usersAllowedStartDate && rawFromForGraph.isBefore(usersAllowedStartDate)
            ? usersAllowedStartDate.format(apiFormat)
            : rawFromForGraph.format(apiFormat);
    const title = i18nFilter()("affiliate.by.industry.referral.visits.title");
    const subTitleFilters = [
        {
            filter: "date",
            value: {
                from,
                to,
                format: "MMMM YYYY",
            },
        },
        {
            filter: "webSource",
            value: webSource,
        },
    ];
    const tooltip = i18nFilter()("affiliate.by.industry.referral.visits.tooltip");
    const [data, setData] = useState<IData>(null);
    const [noData, setNoData] = useState<boolean>(false);
    const fetchService = DefaultFetchService.getInstance();

    const calcTopData = (data) => {
        const sum = Object.values(data.Data[category]).reduce((a: number, b: number) => a + b);
        const referralVisits = data.Data[category]?.Referrals;

        if (!referralVisits) {
            setNoData(true);
        }

        return {
            referralVisits: referralVisits,
            referralVisitsShare: referralVisits / (sum as number),
        };
    };

    const transformGraphData = (data) => {
        const parsedData = data.Data[category]?.Referrals[0]
            .sort((a, b) => (new Date(a.Key) > new Date(b.Key) ? 1 : -1))
            .map((item) => [new Date(item.Key).getTime(), item.Value]);

        return [{ data: parsedData }];
    };
    useEffect(() => {
        async function fetchData() {
            setData(null);

            const toForGraph =
                duration === "28d" ? DurationService.getDurationData("1m").forAPI.to : to;

            if (duration === "28d") {
                const fromFor28dGraph = DurationService.getDurationData("1m")
                    .raw.to.clone()
                    .subtract(11, "month");
                fromForGraph = fromFor28dGraph.isBefore(usersAllowedStartDate)
                    ? usersAllowedStartDate.format(apiFormat)
                    : fromFor28dGraph.format(apiFormat);
            }
            try {
                const [topData, graphData] = await Promise.all([
                    fetchService.get<{ Data: object[] }>(
                        "api/WidgetKpis/TrafficSourcesOverview/GetPieChartData",
                        {
                            category,
                            country,
                            from,
                            includeSubDomains: true,
                            isWindow,
                            keys: category,
                            timeGranularity: "Monthly",
                            to,
                            webSource,
                            isDaily: false,
                        },
                    ),
                    fetchService.get<{ Data: object[] }>(
                        "api/WidgetKpis/TrafficSourcesOverview/GetGraphData",
                        {
                            category,
                            country,
                            from: fromForGraph,
                            includeSubDomains: true,
                            isWindow: false,
                            keys: category,
                            timeGranularity: "Monthly",
                            to: toForGraph,
                            webSource,
                            isDaily: false,
                        },
                    ),
                ]);

                setData({
                    ...calcTopData(topData),
                    referralVisitsGraphData: transformGraphData(graphData),
                });
            } catch (e) {
                setNoData(true);
            }
        }

        fetchData();
    }, [from, to, country, webSource, duration, fromForGraph]);

    const getGraphConfig = () => {
        return {
            chart: {
                height: 72,
                zoomType: null,
                marginRight: 10,
                marginLeft: 10,
            },
            yAxis: {
                min: 0,
            },
            plotOptions: {
                series: {
                    marker: {
                        states: {
                            hover: {
                                enabled: true,
                                radius: 4,
                            },
                        },
                    },
                },
            },
            tooltip: {
                enabled: true,
                backgroundColor: colorsPalettes.carbon[0],
                borderWidth: 0,
                outside: true,
                useHTML: true,
                shadow: true,
                style: {
                    fontFamily: "Roboto",
                },
                formatter() {
                    const getTooltipContent = () => {
                        const to = dayjs.utc(this.x);
                        return (
                            <TooltipWrapper>
                                <TooltipContentWrapper>
                                    <ValueWrapper>
                                        <BoldText>{minVisitsAbbrFilter()(this.y)}</BoldText>
                                    </ValueWrapper>
                                    <TextWrapper>
                                        {i18nFilter()(
                                            "affiliate.by.industry.referrals.visits.graph.tooltip.text",
                                        )}{" "}
                                        {to.format("MMM, YYYY")}
                                    </TextWrapper>
                                </TooltipContentWrapper>
                            </TooltipWrapper>
                        );
                    };
                    return ReactDOMServer.renderToString(getTooltipContent());
                },
            },
        };
    };

    const getComponent = () =>
        noData ? (
            <EmptyState
                titleKey="find.affiliate.by.industry.empty.state.title"
                subTitleKey="find.affiliate.by.industry.empty.state.sub.title"
            />
        ) : (
            <ContentWrapper>
                <TopPart>
                    <ReferralVisitsWrapper>
                        {minAbbrNumberFilter()(data.referralVisits)}
                    </ReferralVisitsWrapper>
                    <ReferralVisitsShareWrapper>
                        <ReferralVisitsSharePercentage>
                            {percentageSignFilter()(data.referralVisitsShare)}
                        </ReferralVisitsSharePercentage>
                        <ReferralVisitsShareText>
                            {i18nFilter()("affiliate.by.industry.referral.visits.percentage.text")}
                        </ReferralVisitsShareText>{" "}
                    </ReferralVisitsShareWrapper>
                </TopPart>
                <CoreTrendCell data={data.referralVisitsGraphData} config={getGraphConfig()} />
            </ContentWrapper>
        );

    return (
        <StyledBox width="32%" height="298">
            <ReferralComponentTitle title={title} tooltip={tooltip} filters={subTitleFilters} />
            {data || noData ? getComponent() : <Loader />}
        </StyledBox>
    );
};
