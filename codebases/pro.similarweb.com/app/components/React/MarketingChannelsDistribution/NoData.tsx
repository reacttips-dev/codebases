import Chart from "components/Chart/src/Chart";
import { getChartConfig } from "components/React/MarketingChannelsDistribution/chartConfig";
import {
    ChartContainerSingle,
    MarketingChannelsDistributionContainer,
    Text,
} from "components/React/MarketingChannelsDistribution/styledComponents";
import I18n from "components/WithTranslation/src/I18n";
import { i18nFilter } from "filters/ngFilters";
import React from "react";
import { chartTypes } from "UtilitiesAndConstants/Constants/ChartTypes";
import { constants } from "components/React/MarketingChannelsDistribution/constants";
import { colorsPalettes } from "@similarweb/styles";

const noDataConstants = {
    DEFAULT_COLUMN_COLOR: colorsPalettes.carbon[100],
    NO_DATA_TEXT_KEY: "marketing.channels.distribution.no.data",
};

export const NoData = (props) => {
    const { marketingChannelsType } = props;
    const { NO_DATA_TEXT_KEY, DEFAULT_COLUMN_COLOR } = noDataConstants;
    const chartData = Object.entries(constants).map((item) => {
        const { API_RESULTS_NAME, COLOR: itemColor } = item[1];
        const id = item[0];
        const MINIMUM_VALUE = 0.1;
        return {
            displayName: API_RESULTS_NAME,
            y: Math.max(Math.random(), MINIMUM_VALUE),
            color: id === String(marketingChannelsType) ? itemColor : DEFAULT_COLUMN_COLOR,
        };
    });
    const chartConfig = getChartConfig(chartData, false);
    const replacementObject = {
        trafficSource: i18nFilter()(constants[marketingChannelsType].DISPLAY_NAME_KEY),
    };
    return (
        <MarketingChannelsDistributionContainer>
            <Text>
                <I18n dataObj={replacementObject}>{NO_DATA_TEXT_KEY}</I18n>
            </Text>
            <ChartContainerSingle>
                <Chart type={chartTypes.COLUMN} data={chartData} config={chartConfig} />
            </ChartContainerSingle>
        </MarketingChannelsDistributionContainer>
    );
};
