import _ from "lodash";
import dayjs from "dayjs";
import numeral from "numeral";
import PropTypes from "prop-types";
import { FC } from "react";
import { compose } from "redux";
import { ComparePeriodsLegend } from "../../../../Legends/src/ComparePeriodsLegend/ComparePeriodsLegend";
import Chart from "../../Chart";
import chartConfig from "./chartConfig";
import { ChartContainer, ChartLegendContainer } from "./StyledComponents";
import {
    IPeriodOverPeriodGraphProps,
    ISeries,
} from "components/Chart/src/components/PeriodOverPeriodChart/PeriodOverPeriodChartTypes";
import styled from "styled-components";
import { FlexRow } from "../../../../../styled components/StyledFlex/src/StyledFlex";
import {
    generateStackedColumnChartData,
    generateColumnChartData,
    generateLineChartData,
} from "components/Chart/src/components/PeriodOverPeriodChart/PeriodOverPeriodChartDataGenerator";

const LegendRow = styled(FlexRow)`
    justify-content: space-between;
`;

const defaultXAxisFormatter = ({ value }) => (value ? dayjs.utc(value).utc().format("MMM") : "N/A");

const categoryXAxisFormatter = ({ value }) => value;

const stackedColumnXFormatter = (chartDataSeries: ISeries[]) => {
    const durationDiff = dayjs
        .utc(chartDataSeries[0].Values[0].Key)
        .diff(dayjs.utc(chartDataSeries[0].Values[1].Key), "months");
    return ({ value }) =>
        value
            ? `${dayjs
                  .utc(value)
                  .utc()
                  .subtract(durationDiff, "months")
                  .format("MMM YYYY")} - ${dayjs.utc(value).utc().format("MMM YYYY")}`
            : "N/A";
};

const resolveXAxisFormatter = (
    type: string,
    chartDataSeries: ISeries[],
    xAxisFormatter: ({ value }) => string,
    isStackedColumn: boolean,
    isCategoryXSeries?: boolean,
) => {
    if (type === "column" && isStackedColumn) {
        return stackedColumnXFormatter(chartDataSeries);
    }

    return xAxisFormatter || isCategoryXSeries ? categoryXAxisFormatter : defaultXAxisFormatter;
};

const generateChartData = (
    type: string,
    chartTitles: string[],
    chartDataSeries1: ISeries[],
    chartDataSeries2: ISeries[],
    isStackedColumn: boolean,
) => {
    if (type === "column") {
        return isStackedColumn
            ? generateStackedColumnChartData(chartTitles, chartDataSeries1, chartDataSeries2)
            : generateColumnChartData(chartTitles, chartDataSeries1);
    }

    return generateLineChartData(chartTitles, chartDataSeries1);
};
export const PeriodOverPeriodChart: FC<IPeriodOverPeriodGraphProps> = ({
    type,
    data,
    xAxisFormatter,
    yAxisFormatter,
    legendDurations,
    options,
    showLegend = true,
    postProcessChartData = _.identity,
    postProcessChartConfig = _.identity,
    rightSectionComponent,
    metric,
}) => {
    const titles = Object.keys(data);
    const series1: ISeries[] = data[titles[0]];
    const series2: ISeries[] = data[titles[1]];
    const isStackedColumn = type === "column" && options.stackedColumn && titles.length > 1;
    const legendTitles = isStackedColumn
        ? [titles[1], titles[0], titles[1], titles[0]]
        : [titles[0], titles[0]];

    const selectedXAxisFormatter = resolveXAxisFormatter(
        type,
        series1,
        xAxisFormatter,
        isStackedColumn,
        options?.categoryXSeries,
    );
    const chartData = compose(postProcessChartData, generateChartData)(
        type,
        titles,
        series1,
        series2,
        isStackedColumn,
    );

    const config = compose(
        postProcessChartConfig,
        chartConfig,
    )({
        type,
        xAxisFormatter: selectedXAxisFormatter,
        yAxisFormatter,
        isStackedColumn,
        categoryXSeries: options.categoryXSeries,
        legendDurations,
        height: options.height,
        metric,
    });

    return (
        <ChartLegendContainer>
            <LegendRow>
                {legendDurations && showLegend ? (
                    <ComparePeriodsLegend titles={legendTitles} durations={legendDurations} />
                ) : null}
                {rightSectionComponent}
            </LegendRow>
            <ChartContainer className="chartContainer">
                <Chart type={type} data={chartData} config={config} />
            </ChartContainer>
        </ChartLegendContainer>
    );
};

PeriodOverPeriodChart.displayName = "PeriodOverPeriodGraph";

PeriodOverPeriodChart.defaultProps = {
    type: "line",
    yAxisFormatter: ({ value }) =>
        _.isNumber(value) ? numeral(value).format("0[.]0a").toUpperCase() : "N/A",
    options: { stackedColumn: false, categoryXSeries: false },
};

PeriodOverPeriodChart.propTypes = {
    type: PropTypes.string,
    data: PropTypes.objectOf(
        PropTypes.arrayOf(
            PropTypes.shape({
                Change: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)])
                    .isRequired,
                Values: PropTypes.arrayOf(
                    PropTypes.shape({
                        Key: PropTypes.string.isRequired,
                        Value: PropTypes.number.isRequired,
                        Confidence: PropTypes.number,
                    }),
                ),
            }),
        ),
    ).isRequired,
    showLegend: PropTypes.bool,
    xAxisFormatter: PropTypes.func,
    yAxisFormatter: PropTypes.func,
    legendDurations: PropTypes.arrayOf(PropTypes.string),
    options: PropTypes.shape({
        stackedColumn: PropTypes.bool,
        categoryXSeries: PropTypes.bool,
        height: PropTypes.number,
    }),
    postProcessChartData: PropTypes.func,
    postProcessChartConfig: PropTypes.func,
    rightSectionComponent: PropTypes.any,
};
