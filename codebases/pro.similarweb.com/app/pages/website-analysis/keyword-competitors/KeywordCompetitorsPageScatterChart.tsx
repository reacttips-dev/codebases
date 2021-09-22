import { BasicScatterChart } from "components/React/ScatterChart/ScatterChart";
import { WidgetsTop } from "components/React/Widgets/WidgetsTop";
import * as React from "react";
import { connect } from "react-redux";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";
import { i18nFilter } from "filters/ngFilters";
const ScatterChartContainer = styled(FlexColumn)`
    background-color: white;
`;

const Hr = styled.hr`
    margin: 0;
`;

interface IChartProps {
    graphHeadline?: string;
    scatterPlotInfo?: string;
    columns?: Array<{ id: string; name: string }>;
    benchmarkInfoTooltipText?: string;
    disabledBenchmarkInfoText?: string;
    tableData?: any[];
    domain: string;
    mainSiteData: {
        TotalTraffic: number;
        Traffic: number;
    };
}

interface IChartData {
    id?: string;
    Favicon?: string;
    Domain?: string;
}

export const KeywordCompetitorsPageScatterChart: React.FunctionComponent<IChartProps> = (props) => {
    const { columns, tableData, domain } = props;

    // The chart data keys are based on the current state name
    if (!tableData) {
        return <span>{}</span>;
    }
    // the backend should response with 100 websites,
    // In order to make no harm to future performance in case that they will return more results I used the array slice method
    const columnsAverage = {
        ...props.mainSiteData,
    };
    const getAverageForBenchmark = ({ id }) => {
        return columnsAverage[id];
    };

    // the Array.filter method remove the undefined values
    const getMinMaxValue = (minMaxFunction) => (vertical) =>
        minMaxFunction(...tableData.map((o) => o[vertical.id]).filter((val) => val));
    const getMaxValue = getMinMaxValue(Math.max);
    const getMinValue = getMinMaxValue(Math.min);
    return (
        <ScatterChartContainer>
            <Hr />
            <BasicScatterChart
                columns={columns}
                chartData={tableData}
                getAverageForBenchmark={getAverageForBenchmark}
                benchmarkInfoTooltipText={i18nFilter()(
                    "analysis.competitors.search.organic.scatter.benchmark.tooltip",
                )}
                disabledBenchmarkInfoText={i18nFilter()(
                    "analysis.competitors.search.organic.scatter.benchmark.disabled",
                )}
                getMaxValue={getMaxValue}
                getMinValue={getMinValue}
                benchmarkLabelText={"analysis.competitors.search.organic.scatter.benchmark.label"}
                aboveAvgText={`Above ${domain}`}
                belowAvgText={`Below ${domain}`}
                initialXAxisColumn={0}
                initialYAxisColumn={3}
                tooltipWidth="400px"
                dropdownsWidth={200}
                showBenchmark={false}
            />
        </ScatterChartContainer>
    );
};
