import { colorsPalettes, rgba } from "@similarweb/styles";
import combineConfigs from "../../../../components/Chart/src/combineConfigs";
import noLegendConfig from "../../../../components/Chart/src/configs/legend/noLegendConfig";
import CrossedLinesConfig from "../../../../components/Chart/src/configs/plotLines/CrossedLinesConfig";
import PolygonEfficiencyZonesConfig from "../../../../components/Chart/src/configs/polygon/PolygonEfficiencyZonesConfig";
import noStickyTracking from "../../../../components/Chart/src/configs/tracking/noStickyTracking";
import xAxisMinMaxConfig from "../../../../components/Chart/src/configs/xAxis/xAxisMinMaxConfig";
import xAxisNoTickBorders from "../../../../components/Chart/src/configs/xAxis/xAxisNoTickBorders";
import yAxisMinMaxConfig from "../../../../components/Chart/src/configs/yAxis/yAxisMinMaxConfig";
import yAxisNoTickBorders from "../../../../components/Chart/src/configs/yAxis/yAxisNoTickBorders";
import bothAxisZoomConfig from "../../../../components/Chart/src/configs/zoom/bothAxisZoomConfig";
import { dataLabelWithIcon } from "../../../../components/Chart/src/dataLabels/dataLabelWithIcon";
import ScatterMetricTooltip from "./ScatterMetricTooltip";

const PLOT_LINE_COLOR = colorsPalettes.carbon[100];
const AXIS_LINE_COLOR = colorsPalettes.carbon[200];
const AXIS_TITLE_COLOR = colorsPalettes.carbon[200];
const AXIS_LABELS_COLOR = colorsPalettes.carbon[200];
const GRID_LINE_COLOR = colorsPalettes.carbon[25];

function tooltipPositioner(boxWidth, boxHeight, point) {
    const chart = this.chart;
    const chartRight = chart.plotLeft + chart.plotWidth;
    const PADDING = 20;
    const LABEL_SIZE = 24;
    const ALIGNMENT_STEP = 75;
    const startX = point.plotX + ALIGNMENT_STEP + LABEL_SIZE / 2;
    const middledByX = boxWidth / 2;

    let tooltipX = startX - middledByX;
    let tooltipY = point.plotY - boxHeight - PADDING;

    if (startX + middledByX > chartRight) {
        tooltipX -= startX + middledByX - chartRight;
    }

    if (tooltipX < chart.plotLeft) {
        tooltipX += chart.plotLeft - tooltipX;
    }

    if (tooltipY < chart.plotTop) {
        tooltipY = point.plotY + PADDING + LABEL_SIZE / 2;
    }

    return {
        x: tooltipX,
        y: tooltipY,
    };
}
function scatterDataLabelFormatter() {
    const {
        options: { icon, color, link, singleLob },
        name,
    } = this.series;

    return dataLabelWithIcon({ icon, color, link, name, singleLob });
}

export default (
    {
        type,
        config,
        metrics,
        axis: { minX, minY, maxX, maxY },
        midValues: { x: midX, y: midY },
        efficiencyZones,
    },
    translate,
) =>
    combineConfigs({ type }, [
        xAxisMinMaxConfig({ min: minX, max: maxX }),
        yAxisMinMaxConfig({ min: minY, max: maxY }),
        yAxisNoTickBorders,
        xAxisNoTickBorders,
        noLegendConfig,
        bothAxisZoomConfig,
        noStickyTracking,
        efficiencyZones && PolygonEfficiencyZonesConfig({ minX, minY, maxX, maxY, midX, midY }),
        efficiencyZones && CrossedLinesConfig({ xValue: midX, yValue: midY }, PLOT_LINE_COLOR),
        {
            chart: {
                spacingTop: 24,
                height: "450px",
            },
            tooltip: {
                useHTML: true,
                shape: "callout",
                backgroundColor: "transparent",
                shadow: false,
                borderWidth: 0,
                padding: 0,
                formatter: ScatterMetricTooltip(metrics, { midX, midY }, translate),
                positioner: tooltipPositioner,
            },
            plotOptions: {
                series: {
                    stacking: "normal",
                },
                scatter: {
                    marker: {
                        enabled: false,
                        fillColor: "transparent",
                        lineWidth: 0,
                        radius: 1,
                        states: {
                            hover: {
                                enabled: false,
                            },
                        },
                    },
                    dataLabels: {
                        enabled: true,
                        padding: -20,
                        useHTML: true,
                        allowOverlap: true,
                        style: {
                            pointerEvents: "none",
                        },
                        formatter: scatterDataLabelFormatter,
                    },
                },
            },
            xAxis: {
                gridLineWidth: 1,
                gridLineColor: GRID_LINE_COLOR,
                labels: {
                    y: 25,
                    style: {
                        color: AXIS_LABELS_COLOR,
                    },
                    useHTML: true,
                },
                lineColor: AXIS_LINE_COLOR,
                tickPixelInterval: 120,
                title: {
                    margin: 16,
                    style: {
                        color: AXIS_TITLE_COLOR,
                        textTransform: "uppercase",
                        fontSize: "12px",
                        fontFamily: "Roboto",
                    },
                },
            },
            yAxis: {
                title: {
                    margin: 16,
                    style: {
                        color: AXIS_TITLE_COLOR,
                        textTransform: "uppercase",
                        fontSize: "12px",
                        fontFamily: "Roboto",
                    },
                },
                lineWidth: 1,
                lineColor: AXIS_LINE_COLOR,
                gridLineColor: GRID_LINE_COLOR,
                tickWidth: 1,
                tickPixelInterval: 35,
                labels: {
                    step: 2,
                    style: {
                        color: AXIS_LABELS_COLOR,
                    },
                    useHTML: true,
                },
            },
        },
        config || {},
    ]);
