import { FunctionComponent, useEffect, useState } from "react";
import {
    absFilter,
    changeFilter,
    minAbbrNumberFilter,
    minVisitsAbbrFilter,
    percentageSignFilter,
} from "filters/ngFilters";
import DurationService from "services/DurationService";
import { StyledBox, TitleContainer } from "../common/StyledComponents";
import styled from "styled-components";
import { Loader } from "../common/Loader";
import { colorsPalettes, mixins, rgba } from "@similarweb/styles";
import CoreTrendCell from "components/core cells/src/CoreTrendCell/CoreTrendCell";
import dayjs from "dayjs";
import ReactDOMServer from "react-dom/server";
import { PaidSearchComponentTitle } from "pages/website-analysis/traffic-sources/paid-search/components/common/PaidSearchComponentTitle";
import { NoDataLandscape } from "components/NoData/src/NoData";
import { FlexRow } from "pages/website-analysis/website-content/leading-folders/components/Tab";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import isNumber from "lodash/isNumber";
import { ChangeValue } from "@similarweb/ui-components/dist/change-value";
import { IPaidSearchOverviewProps } from "pages/website-analysis/traffic-sources/paid-search/PaidSearchOverview";

const ChangeWrapper = styled(FlexColumn)<{ isDecrease: boolean }>`
    margin-right: 8px;
    > div:first-child {
        font-size: 12px;
        font-weight: 500;
    }

    .ChangeValue-desc {
        font-size: 12px;
        line-height: 1.33;
        color: ${rgba(colorsPalettes.carbon[500], 0.8)};
    }

    .ChangeValue-arrow--symbol {
        // when to hide arrow
        display: ${({ isDecrease }) => (isDecrease === null ? "none" : "inline-block")};
    }

    .ChangeValue--up {
        color: ${({ isDecrease }) =>
            isDecrease === null
                ? colorsPalettes.carbon[500]
                : isDecrease
                ? colorsPalettes.red["s100"]
                : colorsPalettes.green["s100"]};
    }
`;

const ContentWrapper = styled.div`
    margin: 0 12px 5px 7px;
    height: 100%;
`;

const SearchTrafficWrapper = styled.div`
    color: ${colorsPalettes.carbon[500]};
    font-size: 44px;
    font-weight: 400;
    margin-bottom: 3px;
    line-height: 56px;
`;

const SearchPercentageWrapper = styled.div`
    display: flex;
    font-size: 16px;
    color: ${rgba(colorsPalettes.carbon[500], 0.8)};
    font-weight: 400;
    margin-bottom: 24px;
`;

const SearchPercentage = styled.div`
    font-weight: 700;
    margin-right: 5px;
`;

const TopPart = styled(FlexColumn)`
    align-items: center;
    height: 60%;
    justify-content: center;
`;

const ChangeText = styled.div`
    ${mixins.setFont({ $size: 12, $color: colorsPalettes.carbon[300], $weight: 500 })};
`;

const BoldText = styled.span`
    font-weight: 700;
`;

const TooltipContentWrapper = styled.div`
    display: inline;
`;

const ValueWrapper = styled.span`
    padding-left: 4px;
    padding-right: 4px;
    color: ${colorsPalettes.midnight[500]};
`;

const TooltipWrapper = styled.div`
    padding: 7px;
`;

const TextWrapper = styled.span`
    ${mixins.setFont({ $size: 13, $color: colorsPalettes.carbon[500], $weight: 400 })};
`;

interface IData {
    TotalPaidSearchTraffic: number;
    PaidToAllSearchPercentage: number;
    PaidSearchChange: number;
    PaidSearchTrafficBreakDown: { data: [] }[];
    isDecrease: boolean;
}

export const TotalPaidSearchTrafficSingle: FunctionComponent<IPaidSearchOverviewProps> = (
    props,
) => {
    const { country, duration, webSource, isWWW, key } = props.navigationParams;
    const { fetchService, i18n } = props;
    const durationObject = DurationService.getDurationData(duration);
    const { from, to, isWindow } = durationObject.forAPI;
    const getDateRange = (durationObject) => [durationObject.raw.from, durationObject.raw.to];
    const [fromDate, toDate] = getDateRange(durationObject);
    const title = i18n(
        "website-analysis.traffic-sources.paid-search.total-paid-search-traffic.title",
    );
    const subTitleFilters = [
        {
            filter: "date",
            value: {
                from: fromDate.valueOf(),
                to: toDate.valueOf(),
                useRangeDisplay: fromDate.format("YYYY-MM") !== toDate.format("YYYY-MM"),
            },
        },
        {
            filter: "webSource",
            value: webSource,
        },
    ];
    const tooltip = i18n(
        "website-analysis.traffic-sources.paid-search.total-paid-search-traffic.title.tooltip",
    );
    const [data, setData] = useState<IData>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchData() {
            setData(null);
            console.log("isWWW: ", isWWW);

            const response = await fetchService
                .get<{ Data: object }>(
                    "widgetApi/TrafficSourcesSearch/PaidSearchOverview/SingleMetric",
                    {
                        country,
                        from,
                        includeSubDomains: isWWW === "*",
                        isWindow,
                        keys: key,
                        timeGranularity: isWindow ? "Weekly" : "Monthly",
                        to,
                        webSource,
                    },
                )
                .finally(() => setIsLoading(false));
            setData(transformData(response?.Data[key]));
        }

        fetchData();
    }, []);

    const transformData = (data) => {
        const parsedData = data.PaidSearchTrafficBreakDown
            ? data.PaidSearchTrafficBreakDown.sort((a, b) =>
                  new Date(a.Key) > new Date(b.Key) ? 1 : -1,
              ).map((item) => [new Date(item.Key).getTime(), item.Value])
            : [];

        const isDecrease =
            isNumber(data?.PaidSearchChange) && data?.PaidSearchChange < 0
                ? true
                : isNumber(data?.PaidSearchChange) && data?.PaidSearchChange > 0
                ? false
                : null;

        return { ...data, PaidSearchTrafficBreakDown: [{ data: parsedData }], isDecrease };
    };

    const getGraphConfig = () => {
        return {
            chart: {
                height: 87,
                zoomType: null,
                marginRight: 10,
                marginLeft: 17,
                marginBottom: 10,
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
                                        {i18n(
                                            "website-analysis.traffic-sources.paid-search.total-paid-search-traffic.graph.tooltip.part1",
                                        )}
                                        <br />
                                        {i18n(
                                            "website-analysis.traffic-sources.paid-search.total-paid-search-traffic.graph.tooltip.part2",
                                        )}{" "}
                                        {to.format(isWindow ? "MMM DD, YYYY" : "MMM, YYYY")}
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

    const checkIfNoData = () =>
        !data?.TotalPaidSearchTraffic &&
        !data?.PaidToAllSearchPercentage &&
        !data?.PaidSearchChange &&
        data?.PaidSearchTrafficBreakDown[0];

    const getComponent = () =>
        !data || checkIfNoData() ? (
            <NoDataLandscape
                title="website-analysis.traffic-sources.paid-search.no-data"
                subtitle=""
            />
        ) : (
            <ContentWrapper>
                <TopPart>
                    <SearchTrafficWrapper>
                        {data?.TotalPaidSearchTraffic === 0
                            ? "N/A"
                            : minAbbrNumberFilter()(data?.TotalPaidSearchTraffic)}
                    </SearchTrafficWrapper>
                    <SearchPercentageWrapper>
                        <SearchPercentage>
                            {percentageSignFilter()(data?.PaidToAllSearchPercentage)}
                        </SearchPercentage>
                        {i18n(
                            "website-analysis.traffic-sources.paid-search.total-paid-search-traffic.percentage.text",
                        )}
                    </SearchPercentageWrapper>
                    {!isWindow && (
                        <FlexRow>
                            <ChangeWrapper isDecrease={data?.isDecrease}>
                                <ChangeValue
                                    value={
                                        !data?.PaidSearchChange && !isNumber(data?.PaidSearchChange)
                                            ? i18n("display.ads.overview.new")
                                            : changeFilter()(absFilter()(data?.PaidSearchChange), 0)
                                    }
                                    isDecrease={data?.isDecrease}
                                />
                            </ChangeWrapper>
                            <ChangeText>
                                {i18n(
                                    "website-analysis.traffic-sources.paid-search.total-paid-search-traffic.change.text",
                                )}
                            </ChangeText>
                        </FlexRow>
                    )}
                </TopPart>
                {data?.PaidSearchTrafficBreakDown && (
                    <CoreTrendCell
                        data={data.PaidSearchTrafficBreakDown}
                        config={getGraphConfig()}
                    />
                )}
            </ContentWrapper>
        );

    return (
        <StyledBox
            width="33%"
            height="357"
            data-automation="total-paid-search-traffic-single"
            marginRight={24}
        >
            <TitleContainer>
                <PaidSearchComponentTitle
                    title={title}
                    tooltip={tooltip}
                    filters={subTitleFilters}
                />
            </TitleContainer>
            {isLoading ? <Loader /> : getComponent()}
        </StyledBox>
    );
};
