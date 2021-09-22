import Chart from "components/Chart/src/Chart";
import { getChartConfig } from "components/React/MarketingChannelsDistribution/chartConfig";
import { constants } from "components/React/MarketingChannelsDistribution/constants";
import {
    Circle,
    Text,
    CircleContainer,
    MarketingChannelsDistributionContainer,
    ChartContainerCompare,
} from "components/React/MarketingChannelsDistribution/styledComponents";
import I18n from "components/WithTranslation/src/I18n";
import { percentageSignFilter } from "filters/ngFilters";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { chartTypes } from "UtilitiesAndConstants/Constants/ChartTypes";

const Site = ({ siteName, siteColor }) => (
    <div style={{ display: "inline-flex" }}>
        <CircleContainer>
            <Circle color={siteColor} />
        </CircleContainer>
        <span>{siteName}</span>
    </div>
);

const getChartWidth = (chosenItems) => {
    // due to the fact that highcharts don't support grouping for the moment, we need to calculate the chart width
    const MIN_WIDTH = 20;
    const WIDTH_FOR_EACH_SITE = 10;
    return MIN_WIDTH + WIDTH_FOR_EACH_SITE * chosenItems.length;
};

export const MarketingChannelsDistributionCompare = (props) => {
    const { marketingChannelsDistributionData, marketingChannelsType, chosenItems } = props;
    const { COMPARE_MODE_KEY: titleKey, API_RESULTS_NAME: apiResultsName } = constants[
        marketingChannelsType
    ];
    const chartDataRow = chosenItems.map(({ name, color }) => {
        const value = marketingChannelsDistributionData[name][apiResultsName] ?? Number();
        const siteTrafficAmount = Number(
            Object.values(marketingChannelsDistributionData[name]).reduce(
                (sum: number, current: number) => sum + current,
                0,
            ),
        );
        const MINIMUM_VALUE = 0.001;
        const PERCENTAGE_FILTER_FRACTION_LENGTH = 2;
        const siteRelativeShare = siteTrafficAmount === 0 ? 0 : value / siteTrafficAmount;
        const ONE_PERCENT = 1 / 100;
        const LESS_THEN_ONE_PERCENT_DISPLAY_VALUE = "<1%";
        return {
            y: Math.max(siteRelativeShare, MINIMUM_VALUE),
            value: siteRelativeShare,
            color,
            tooltipColor: color,
            displayName: name,
            displayValue:
                siteRelativeShare < ONE_PERCENT
                    ? LESS_THEN_ONE_PERCENT_DISPLAY_VALUE
                    : percentageSignFilter()(siteRelativeShare, PERCENTAGE_FILTER_FRACTION_LENGTH),
        };
    });

    const trafficLeader = chartDataRow.sort(({ value: yA }, { value: yB }) => yB - yA)[0];
    const {
        displayName: trafficLeaderName,
        displayValue: trafficLeaderDisplayValue,
        y: trafficLeaderValue,
    } = trafficLeader;
    const chartData = chartDataRow
        .map((dataItem) => ({
            ...dataItem,
            y: (dataItem.y + trafficLeaderValue) / trafficLeaderValue,
            isLeadSite: dataItem.displayName === trafficLeaderName,
        }))
        .reverse();
    const chartConfig = getChartConfig(chartData);
    const trafficLeaderColor = chosenItems.find(({ name }) => name === trafficLeaderName).color;
    const replacementObject = {
        percentageAmount: ReactDOMServer.renderToString(
            <strong>{trafficLeaderDisplayValue}</strong>,
        ),
        leadSite: ReactDOMServer.renderToString(
            <Site siteName={trafficLeaderName} siteColor={trafficLeaderColor} />,
        ),
    };
    return (
        <MarketingChannelsDistributionContainer>
            <Text>
                <I18n dangerouslySetInnerHTML={true} dataObj={replacementObject}>
                    {titleKey}
                </I18n>
            </Text>
            <ChartContainerCompare width={getChartWidth(chosenItems)}>
                <Chart type={chartTypes.COLUMN} data={chartData} config={chartConfig} />
            </ChartContainerCompare>
        </MarketingChannelsDistributionContainer>
    );
};
