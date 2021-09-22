import * as _ from "lodash";
import * as React from "react";
import { StatelessComponent } from "react";
import Chart from "../../../../components/Chart/src/Chart";
import chartConfig from "./chartConfig";

export interface IScatterData {
    name?: string;
    icon?: string;
    color?: string;
    link?: string;
    data: IScatterChartPoint[];
}

export interface IScatterMetric {
    name: string;
    valueFormat?: (value) => string;
    highLabel: string;
    lowLabel: string;
    midValue?: number;
}

export interface IScatterChartPoint {
    x: number;
    y: number;
}

interface IScatterChartProps {
    data: IScatterData[];
    config?: any;
    metrics?: {
        [dimension: string]: IScatterMetric;
    };
    options?: {
        efficiencyZones?: boolean;
    };
    translate?: any;
}

const CHART_TYPE = "scatter";
const MINMAX_PADDING_BIG_MULTIPLIER = 0.15;
const MINMAX_PADDING_SMALL_MULTIPLIER = 0.05;

export function getAxisMinMax(
    { minX, minY, maxX, maxY },
    { bigMultiplier, smallMultiplier } = {
        bigMultiplier: MINMAX_PADDING_BIG_MULTIPLIER,
        smallMultiplier: MINMAX_PADDING_SMALL_MULTIPLIER,
    },
) {
    let xMultiplier;
    let yMultiplier;

    if (maxX - minX > maxY - minY) {
        xMultiplier = bigMultiplier;
        yMultiplier = smallMultiplier;
    } else {
        xMultiplier = smallMultiplier;
        yMultiplier = bigMultiplier;
    }

    const stepX = maxX * xMultiplier;
    const stepY = maxY * yMultiplier;

    const getValue = (value, step, sign) => {
        if (sign === "-") {
            const min = value - step;

            return min <= 0 ? 0 : min;
        }

        return value + step;
    };

    return {
        minX: getValue(minX, stepX, "-"),
        minY: getValue(minY, stepY, "-"),
        maxX: getValue(maxX, stepX, "+"),
        maxY: getValue(maxY, stepY, "+"),
    };
}

export function getMinMaxFromData(data: IScatterData[]): { [x: string]: number } {
    const getFirstPoint = (axis: string): number => _.get(data, `[0].data[0].${axis}`);
    let maxX;
    let maxY;
    let minX = (maxX = getFirstPoint("x"));
    let minY = (maxY = getFirstPoint("y"));

    data.forEach((item) => {
        if (!_.isArray(item.data)) {
            return;
        }

        item.data.forEach((points) => {
            // we do extra condition to avoid extra assignment
            if (minX > points.x) {
                minX = points.x;
            } else if (maxX < points.x) {
                maxX = points.x;
            }

            if (minY > points.y) {
                minY = points.y;
            } else if (maxY < points.y) {
                maxY = points.y;
            }
        });
    });

    return { minX, minY, maxX, maxY };
}

export const ConversionScatterChart: StatelessComponent<IScatterChartProps> = ({
    data,
    config,
    metrics,
    options: { efficiencyZones },
    translate,
}) => {
    const { minX: oMinX, minY: oMinY, maxX: oMaxX, maxY: oMaxY } = getMinMaxFromData(data);
    const { minX, minY, maxX, maxY } = getAxisMinMax({
        minX: oMinX,
        minY: oMinY,
        maxX: oMaxX,
        maxY: oMaxY,
    });
    const midValues = {
        x: oMinX + (oMaxX - oMinX) / 2,
        y: oMinY + (oMaxY - oMinY) / 2,
    };

    Object.keys(metrics).forEach((dimension) => {
        if (metrics[dimension].midValue) {
            midValues[dimension] = metrics[dimension].midValue;
        }
    });

    const finalConfig = chartConfig(
        {
            type: CHART_TYPE,
            config,
            metrics,
            axis: { minX, minY, maxX, maxY },
            midValues,
            efficiencyZones,
        },
        translate,
    );

    return <Chart type={CHART_TYPE} data={data} config={finalConfig} />;
};

ConversionScatterChart.defaultProps = {
    options: { efficiencyZones: true },
};
