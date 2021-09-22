import Chart from "components/Chart/src/Chart";
import { getChartConfig } from "components/React/MarketingChannelsDistribution/chartConfig";
import { constants } from "components/React/MarketingChannelsDistribution/constants";
import I18n from "components/WithTranslation/src/I18n";
import { abbrNumberFilter, i18nFilter, percentageSignFilter } from "filters/ngFilters";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { chartTypes } from "UtilitiesAndConstants/Constants/ChartTypes";
import { colorsPalettes } from "@similarweb/styles";
import {
    ChartContainerSingle,
    Text,
    MarketingChannelsDistributionContainer,
} from "components/React/MarketingChannelsDistribution/styledComponents";

export const MarketingChannelsDistributionSingle = (props) => {
    const { marketingChannelsDistributionData, marketingChannelsType } = props;
    const { SINGLE_MODE_KEY: titleKey, API_RESULTS_NAME: apiResultsName } = constants[
        marketingChannelsType
    ];
    const marketingChannelsDistributionDataValues = Object.values(
        marketingChannelsDistributionData,
    )[0];
    const totalAmount = Object.values(marketingChannelsDistributionDataValues).reduce(
        (sum, current) => sum + current,
        0,
    );
    const currentChannelAmount =
        marketingChannelsDistributionDataValues[apiResultsName] ?? Number();
    const currentChannelRelativeShare = currentChannelAmount / totalAmount;
    const ONE_PERCENT = 1 / 100;
    const LESS_THEN_ONE_PERCENT_DISPLAY_VALUE = "<1%";
    const currentChannelRelativeShareToDisplay =
        currentChannelRelativeShare < ONE_PERCENT
            ? LESS_THEN_ONE_PERCENT_DISPLAY_VALUE
            : percentageSignFilter()(currentChannelRelativeShare, 2);
    const replacementObject = {
        percentageAmount: ReactDOMServer.renderToString(
            <strong>{currentChannelRelativeShareToDisplay}</strong>,
        ),
    };
    const constantsKeys = Object.keys(constants);
    const constantsValues = Object.values(constants);

    const chartData = constantsKeys.map((id) => {
        const DEFAULT_COLUMN_COLOR = colorsPalettes.carbon[100];
        const SPACE = " ";
        const DASH = "-";
        const MINIMUM_VALUE_TO_DISPLAY = 5000;
        const LESS_THEN_MINIMUM_VALUE_TO_DISPLAY = `<${MINIMUM_VALUE_TO_DISPLAY}`;
        const { API_RESULTS_NAME: apiName } = constants[id];
        const value = marketingChannelsDistributionDataValues[apiName] ?? Number();
        const isMarketingChannelsType = apiName === apiResultsName;
        const {
            COLOR: currentChannelColor,
            DISPLAY_NAME_KEY: displayNameKey,
        } = constantsValues.find(({ API_RESULTS_NAME }) => API_RESULTS_NAME === apiName);
        return {
            displayName: i18nFilter()(displayNameKey),
            y: (value + totalAmount) / totalAmount,
            displayValue:
                value < MINIMUM_VALUE_TO_DISPLAY
                    ? LESS_THEN_MINIMUM_VALUE_TO_DISPLAY
                    : abbrNumberFilter()(value),
            color: isMarketingChannelsType ? currentChannelColor : DEFAULT_COLUMN_COLOR,
            tooltipColor: currentChannelColor,
            totalAmount,
            isMarketingChannelsType,
            className: apiName.replace(SPACE, DASH),
        };
    });
    const chartConfig = getChartConfig(chartData);
    return (
        <>
            <MarketingChannelsDistributionContainer>
                <Text>
                    <I18n dangerouslySetInnerHTML={true} dataObj={replacementObject}>
                        {titleKey}
                    </I18n>
                </Text>
                <ChartContainerSingle>
                    <Chart type={chartTypes.COLUMN} data={chartData} config={chartConfig} />
                </ChartContainerSingle>
            </MarketingChannelsDistributionContainer>
        </>
    );
};
