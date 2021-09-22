import { i18nFilter, percentageFilter } from "filters/ngFilters";
import React, { FunctionComponent, useMemo } from "react";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";

import Chart from "../../../../../../.pro-features/components/Chart/src/Chart";
import { DemographicsChartTitleBar } from "../DemographicsChartTitleBar";
import {
    formatGenderPieChartData,
    getGenderPieChartConfig,
    getGenderPieChartStyle,
} from "./genderPiechartConfig";

interface IGenderDistributionPieChartProps {
    malePercent: number;
    femalePercent: number;
}

const GenderChartContainer = styled(FlexColumn)`
    width: 100%;
    height: 100%;
`;

export const GenderDistributionPieChart: FunctionComponent<IGenderDistributionPieChartProps> = (
    props,
) => {
    const { malePercent, femalePercent } = props;

    const { chartConfig, chartStyle } = useMemo(() => {
        return {
            chartConfig: getGenderPieChartConfig({ type: "pie", filter: percentageFilter }),
            chartStyle: getGenderPieChartStyle(),
        };
    }, []);

    const chartData = useMemo(() => {
        return formatGenderPieChartData(malePercent, femalePercent);
    }, [malePercent, femalePercent]);

    return (
        <GenderChartContainer>
            <DemographicsChartTitleBar
                titleText={i18nFilter()("category.demographics.gender.chart.title")}
            />
            <Chart type={"pie"} config={chartConfig} data={chartData} domProps={chartStyle} />
        </GenderChartContainer>
    );
};
