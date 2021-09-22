import { BasicScatterChart } from "components/React/ScatterChart/ScatterChart";
import { WidgetsTop } from "components/React/Widgets/WidgetsTop";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import * as React from "react";
import { connect } from "react-redux";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";
import { PngDownload } from "pages/website-analysis/traffic-sources/search/tabs/SearchOverviewGraph/Components/PngDownload";
import { useRef } from "react";
import DurationService from "services/DurationService";
import { i18nFilter } from "filters/ngFilters";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";
import { TABLE_SELECTION_KEY } from "components/React/TopSites/DomainsTable/Table";

const ScatterChartContainer = styled(FlexColumn)`
    background-color: white;
`;

const Hr = styled.hr`
    margin: 0;
`;

const FlexBoxSpaceBetween = styled.div`
    display: flex;
    justify-content: space-between;
`;
const PngDownloadContainer = styled.div`
    padding: 15px;
`;

interface IChartProps {
    tableSelection: IChartData;
    graphHeadline?: string;
    scatterPlotInfo?: string;
    columnsMD?: string;
    columns?: Array<{ id: string; name: string }>;
    benchmarkInfoTooltipText?: string;
    disabledBenchmarkInfoText?: string;
    tableData?: any[];
    category: string;
    params: Record<string, any>;
}

interface IChartData {
    id?: string;
    Favicon?: string;
    Domain?: string;
}

const columnsAverage = {};
const TopSitesScatterChartInner: React.FunctionComponent<IChartProps> = (props) => {
    const {
        graphHeadline,
        scatterPlotInfo,
        columns,
        benchmarkInfoTooltipText,
        tableData,
        disabledBenchmarkInfoText,
        params,
    } = props;
    const { country, webSource, duration, comparedDuration } = params;
    const isUserCategory = UserCustomCategoryService.isCustomCategory(params?.category);

    // The chart data keys are based on the current state name
    const chartData: IChartData[] = props.tableSelection[TABLE_SELECTION_KEY];
    if (!tableData || !chartData || chartData.length === 0) {
        return <span>{}</span>;
    }
    // the backend should response with 100 websites,
    // In order to make no harm to future performance in case that they will return more results I used the array slice method
    const tableDataForCalc = tableData.slice(0, 100);
    const setColumnAverage = (column) =>
        (columnsAverage[column.id] =
            tableDataForCalc.reduce((p, c) => p + (c[column.id] ? c[column.id] : 0), 0) /
            tableData.length);
    const getAverageForBenchmark = (vertical: { id: React.Key }) => {
        if (!columnsAverage[vertical.id] || tableDataForCalc.length > 99 || isUserCategory) {
            // set the columns average
            columns.map(setColumnAverage);
        }
        return columnsAverage[vertical.id];
    };
    // the Array.filter method remove the undefined values
    const getMinMaxValue = (minMaxFunction) => (vertical) =>
        minMaxFunction(...chartData.map((o) => o[vertical.id]).filter((val) => val));
    const getMaxValue = getMinMaxValue(Math.max);
    const getMinValue = getMinMaxValue(Math.min);
    const chartRef = useRef<HTMLDivElement>();
    const widgetsDurations = DurationService.getDurationData(duration, comparedDuration).forWidget;
    const pngHeaderProps = {
        country,
        webSource,
        durations: widgetsDurations,
        metricTitle: i18nFilter()(graphHeadline),
    };
    return (
        <ScatterChartContainer>
            <FlexBoxSpaceBetween>
                <WidgetsTop
                    headline={graphHeadline}
                    toolTipInfoText={scatterPlotInfo}
                    newPill={true}
                />
                <PngDownloadContainer>
                    <PngDownload
                        chartRef={chartRef}
                        metricName={i18nFilter()(graphHeadline)}
                        offset={{ x: 0, y: 80 }}
                    />
                </PngDownloadContainer>
            </FlexBoxSpaceBetween>

            <Hr />
            <BasicScatterChart
                columns={columns}
                chartData={chartData}
                getAverageForBenchmark={getAverageForBenchmark}
                benchmarkInfoTooltipText={benchmarkInfoTooltipText}
                disabledBenchmarkInfoText={disabledBenchmarkInfoText}
                getMaxValue={getMaxValue}
                getMinValue={getMinValue}
                tooltipWidth="280px"
                ref={chartRef}
                pngHeaderProps={pngHeaderProps}
            />
        </ScatterChartContainer>
    );
};

const mapStateToProps = (props) => {
    const { tableSelection, routing } = props;
    const { params } = routing;
    return {
        tableSelection: { ...tableSelection },
        params,
    };
};

export const TopSitesScatterChart = connect(mapStateToProps)(TopSitesScatterChartInner);
SWReactRootComponent(TopSitesScatterChart, "TopSitesScatterChart");
