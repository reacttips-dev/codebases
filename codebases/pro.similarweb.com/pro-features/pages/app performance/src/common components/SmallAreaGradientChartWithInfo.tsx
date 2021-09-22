import _ from "lodash";
import dayjs from "dayjs";
import propTypes from "prop-types";
import { ReactNode } from "react";
import styled from "styled-components";
import combineConfigs from "../../../../components/Chart/src/combineConfigs";
import { WithHoverEvents } from "../../../../components/Chart/src/components/WithHoverEvents";
import gradientConfig from "../../../../components/Chart/src/configs/gradient/gradientConfig";
import dailyIntervalConfig from "../../../../components/Chart/src/configs/granularity/dailyIntervalConfig";
import firstAndLastDateTicks from "../../../../components/Chart/src/configs/ticks/firstAndLastDateTicks";
import trendConfig from "../../../../components/Chart/src/configs/trendConfig";
import noZoomConfig from "../../../../components/Chart/src/configs/zoom/noZoomConfig";
import ResponsiveChart from "../../../../components/Chart/src/ResponsiveChart";

function toGraphData(data) {
    return [{ data: data.map(({ date, value }) => [dayjs.utc(date).toDate(), value]) }];
}

export interface IchartPoint {
    date: string;
    value: number;
}

export interface ISmallAreaGradientChartProps {
    data: IchartPoint[];
    gradientProps: {
        fillColor: string;
        stop1Color: string;
        stop2Color: string;
    };
    xAxisTickLabelFormat: string;
    graphConfig?: any;
    initialSelectedPoint?: number;

    children(IchartPoint, pointIndex?: number): ReactNode;
}

const ChartContainer = styled.div`
    display: flex;
    flex-grow: 1;
    max-width: 100%;
`;
ChartContainer.displayName = "ChartContainer";

export const SmallAreaGradientChartWithInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    max-width: 100%;
    overflow: hidden;
`;
SmallAreaGradientChartWithInfoContainer.displayName = "SmallAreaGradientChartWithInfoContainer";

const SmallAreaGradientChartWithInfo: any = ({
    data,
    gradientProps,
    children,
    xAxisTickLabelFormat,
    graphConfig,
    initialSelectedPoint = data.length - 1,
}: ISmallAreaGradientChartProps) => {
    const graphData = toGraphData(data);
    const type = "area";
    const [{ data: chartSeries }] = graphData;
    const graphParams = {
        ...gradientProps,
        type,
        graphData,
        firstDateTick: _.head(chartSeries)[0],
        lastDateTick: _.last(chartSeries)[0],
        xAxisTickLabelFormat,
    };
    const config = combineConfigs(graphParams, [
        graphConfig,
        dailyIntervalConfig,
        gradientConfig,
        trendConfig,
        firstAndLastDateTicks,
        noZoomConfig,
        {
            chart: {
                margin: [0, 10, 20, 5],
                spacing: [0, 9, 0, 9],
            },
        },
    ]);
    return (
        <WithHoverEvents type={type} config={config} initialSelectedPoint={initialSelectedPoint}>
            {({ config, selectedPointIndex, afterRender }) => (
                <SmallAreaGradientChartWithInfoContainer>
                    {selectedPointIndex !== null
                        ? children(data[selectedPointIndex], selectedPointIndex)
                        : children(null, null)}
                    <ResponsiveChart
                        type={type}
                        config={config}
                        data={graphData}
                        afterRender={afterRender}
                    />
                </SmallAreaGradientChartWithInfoContainer>
            )}
        </WithHoverEvents>
    );
};

SmallAreaGradientChartWithInfo.displayName = "SmallAreaGradientChartWithInfo";

SmallAreaGradientChartWithInfo.defaultProps = {
    graphConfig: {},
};

SmallAreaGradientChartWithInfo.propTypes = {
    data: propTypes.arrayOf(
        propTypes.shape({
            date: propTypes.string.isRequired,
            value: propTypes.oneOfType([propTypes.string, propTypes.number]),
        }),
    ).isRequired,
    gradientProps: propTypes.shape({
        fillColor: propTypes.string,
        stop1Color: propTypes.string,
        stop2Color: propTypes.string,
    }).isRequired,
    xAxisTickLabelFormat: propTypes.string.isRequired,
    graphConfig: propTypes.object,
    children: propTypes.func.isRequired,
};

export default SmallAreaGradientChartWithInfo;
