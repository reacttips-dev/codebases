import autobind from "autobind-decorator";
import { ConversionSegmentsUtils } from "pages/conversion/ConversionSegmentsUtils";
import * as React from "react";
import { ISegmentsData } from "services/conversion/ConversionSegmentsService";
import Chart from "../../../../components/Chart/src/Chart";
import { PeriodOverPeriodChart } from "../../../../components/Chart/src/components/PeriodOverPeriodChart/PeriodOverPeriodChart";
import { ComparePeriodsLegend } from "../../../../components/Legends/src/ComparePeriodsLegend/ComparePeriodsLegend";
import {
    BenchmarkOvertime,
    IBenchmarkOvertimeProps,
    IConversionVertical,
} from "./benchmarkOvertime";
import {
    getChartConfig,
    TransformChartData,
    websiteConversionSingleTransformData,
} from "./SitesVsCategorylineChart";
import { BenchmarkOvertimeContainer, ChartContainer, LegendsContainer } from "./StyledComponents";
import { isLowConfidence } from "components/Chart/src/data/confidenceProcessor";

export interface IWebsiteConversionOvertime extends IBenchmarkOvertimeProps {
    durationDataForWidget?: string[];
    segmentsData: ISegmentsData;
}

export class WebsiteConversionOvertime extends React.PureComponent<
    IWebsiteConversionOvertime,
    any
> {
    constructor(props) {
        super(props);
    }

    @autobind
    public renderChart(selectedTab: IConversionVertical, filteredChartData) {
        const yAxisFormatter = ({ value, confidence = 0.01 }) => {
            const isValueLowConfidence = isLowConfidence(confidence);
            const filteredValue = selectedTab.filter[0]()(value, selectedTab.filter[1]);
            const formattedVaue = `${isValueLowConfidence ? "~" : ""}${filteredValue}`;
            return formattedVaue;
        };

        const segmentData = ConversionSegmentsUtils.getSegmentById(
            this.props.segmentsData,
            this.props.filters.sid,
        );
        const segmentDomain = segmentData && segmentData.domain;
        const transformedData = TransformChartData(
            { [segmentDomain]: filteredChartData },
            segmentDomain,
            true,
        );
        return (
            <ChartContainer>
                {this.props.filters.comparedDuration ? (
                    <PeriodOverPeriodChart
                        options={{ height: 290 }}
                        yAxisFormatter={yAxisFormatter}
                        type="line"
                        data={{
                            [segmentDomain]: TransformChartData(
                                { [segmentDomain]: filteredChartData },
                                segmentDomain,
                                true,
                            ),
                        }}
                    />
                ) : (
                    <Chart
                        type={"line"}
                        config={getChartConfig({
                            type: "line",
                            filter: selectedTab.filter,
                            data: undefined,
                            shouldConnectNulls: false,
                            yAxisFilter: selectedTab.yAxisFilter,
                        })}
                        data={websiteConversionSingleTransformData({
                            [segmentDomain]: filteredChartData,
                        })}
                    />
                )}
            </ChartContainer>
        );
    }

    @autobind
    public renderLegend() {
        const segmentData = ConversionSegmentsUtils.getSegmentById(
            this.props.segmentsData,
            this.props.filters.sid,
        );
        const segmentDomain = segmentData && segmentData.domain;

        return (
            <LegendsContainer>
                {this.props.filters.comparedDuration ? (
                    <ComparePeriodsLegend
                        titles={[segmentDomain, segmentDomain]}
                        durations={this.props.durationDataForWidget}
                    />
                ) : undefined}
            </LegendsContainer>
        );
    }

    public render() {
        return (
            <BenchmarkOvertimeContainer>
                <BenchmarkOvertime
                    {...this.props}
                    renderLegend={this.renderLegend}
                    renderChart={this.renderChart}
                />
            </BenchmarkOvertimeContainer>
        );
    }
}
