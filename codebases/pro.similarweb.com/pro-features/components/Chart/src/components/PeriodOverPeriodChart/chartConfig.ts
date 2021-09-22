import { colorsPalettes } from "@similarweb/styles";
import _ from "lodash";
import dayjs from "dayjs";
import numeral from "numeral";
import combineConfigs from "../../combineConfigs";
import monthlyIntervalConfig from "../../configs/granularity/monthlyIntervalConfig";
import noLegendConfig from "../../configs/legend/noLegendConfig";
import xAxisCategoryConfig from "../../configs/xAxis/xAxisCategoryConfig";
import xAxisCrosshair from "../../configs/xAxis/xAxisCrosshair";
import xAxisLabelsConfig from "../../configs/xAxis/xAxisLabelsConfig";
import yAxisGridLineConfig from "../../configs/yAxis/yAxisGridLineConfig";
import yAxisLabelsConfig from "../../configs/yAxis/yAxisLabelsConfig";
import noZoomConfig from "../../configs/zoom/noZoomConfig";

const containerStyle = `width: 300px;box-sizing: border-box;padding: 0 8px; color: ${colorsPalettes.carbon[200]}`;
const columnContainerStyle = `width: 416px;box-sizing: border-box;padding: 0 8px; color: ${colorsPalettes.carbon[200]}`;
const rowStyle = `width: 100%;display: table;table-layout: fixed;border-collapse: collapse;margin: 0;`;
const headerRowStyle = `${rowStyle}margin: 2px 0;border-bottom: 1px solid ${colorsPalettes.carbon[200]}`;
const cellStyle = `display: table-cell;vertical-align: middle;text-align: right;`;
const columnCellStyle = `${cellStyle}width: 70px;`;
const columntLegendCellStyle = `${cellStyle}width: 130px;`;

const getTableHeaderRowMarkup = (point1, point2) => {
    const point1ListItem = point1
        ? `<li style="${cellStyle}color: ${point1.color}">${dayjs
              .utc(point1.point.originalX ?? point1.x)
              .format("MMM YYYY")}</li>`
        : ``;
    const point2ListItem = point2
        ? `<li style="${cellStyle}color: ${point2.color}">${dayjs
              .utc(point2.x)
              .format("MMM YYYY")}</li>`
        : ``;
    return `
        <ul style="${headerRowStyle}">
            <li style="${cellStyle}"></li>
            ${point1ListItem}
            ${point2ListItem}
            <li style="${cellStyle}color: ${colorsPalettes.midnight[400]}">Change</li>
        </ul>
    `;
};

const getTableBarHeaderRowMarkup = (point1, point2, durations) => {
    const point1ListItem = point1
        ? `<li style="${columntLegendCellStyle}color: ${point1.color}">${durations[0]}</li>`
        : ``;
    const point2ListItem = point2
        ? `<li style="${columntLegendCellStyle}color: ${point2.color}">${durations[1]}</li>`
        : ``;

    return `
        <ul style="${headerRowStyle}">
            <li style="${columnCellStyle}"></li>
            ${point1ListItem}
            ${point2ListItem}
            <li style="${columnCellStyle}color: ${colorsPalettes.midnight[400]}">Change</li>
        </ul>
    `;
};

const getTableRowMarkup = (yAxisFormatter, point1, point2, type = "line", metric = null) => {
    const change = Array.isArray(point1.point.change)
        ? point1.point.change[0]
        : point1.point.change;
    let changeColor = _.isNumber(change)
        ? change > 0
            ? colorsPalettes.green.s100
            : colorsPalettes.red.s100
        : colorsPalettes.carbon[200];

    if (metric === "BounceRate") {
        changeColor = _.isNumber(change)
            ? change > 0
                ? colorsPalettes.red.s100
                : colorsPalettes.green.s100
            : colorsPalettes.carbon[200];
    }
    const dataCellStyle = type === "column" ? columntLegendCellStyle : cellStyle;

    // Render point values only if we have data for them
    const point1ListItem = point1
        ? ` <li style="${dataCellStyle}">${yAxisFormatter({
              value: point1.y,
              confidence: point1?.point?.confidence,
          })}</li>`
        : ``;
    const point2ListItem = point2
        ? `<li style="${dataCellStyle}">${yAxisFormatter({
              value: point2.y,
              confidence: point2?.point?.confidence,
          })}</li>`
        : ``;

    // Render change value only if we have data for both points, and change value.
    const changeFormatted = change && point1 && point2 ? numeral(change).format("0[.]00%") : "-";
    const changeListItem = `<li style="${cellStyle}color: ${changeColor}">${changeFormatted}</li>`;

    return `
        <ul style="${rowStyle}">
            <li>
                <span style="${
                    type === "column" ? "width: 70px;" : ""
                }display: table-cell;vertical-align: middle;max-width: 80px;overflow: hidden;text-overflow: ellipsis;" title="${
        point1.series.name
    }">
                    ${point1.series.name}
                </span>
            </li>
            ${point1ListItem}
            ${point2ListItem}
            ${changeListItem}
        </ul>
    `;
};

const defaultTooltip = function (yAxisFormatter, type, durations, metric) {
    const point1 = this.points[0];
    const point2 = this.points[1];
    return `<div style="${type === "column" ? columnContainerStyle : containerStyle}">
            ${
                type === "column"
                    ? getTableBarHeaderRowMarkup(point1, point2, durations)
                    : getTableHeaderRowMarkup(point1, point2)
            }
            ${getTableRowMarkup(yAxisFormatter, point1, point2, type, metric)}
        </div>`;
};

const columnTooltip = function (yAxisFormatter) {
    const pointsLength = this.points.length;
    const series1Point1 = this.points[pointsLength - 2];
    const series1Point2 = this.points[pointsLength - 1];
    const series2Point1 = this.points[0];
    const series2Point2 = this.points[1];
    const sum1 = series1Point1.y + series2Point1.y;
    const sum2 = series1Point2.y + series2Point2.y;
    const totalPoint1 = {
        series: {
            name: "All Traffic",
        },
        y: sum1,
        point: {
            change: (sum2 - sum1) / sum1,
        },
    };
    const totalPoint2 = {
        series: {
            name: "All Traffic",
        },
        y: sum2,
    };
    return `<div style="${containerStyle}">
            ${getTableHeaderRowMarkup(series1Point1, series1Point2)}
            ${getTableRowMarkup(yAxisFormatter, series1Point1, series1Point2)}
            ${getTableRowMarkup(yAxisFormatter, series2Point1, series2Point2)}
            ${getTableRowMarkup(yAxisFormatter, totalPoint1, totalPoint2)}
        </div>`;
};

export default ({
    type,
    yAxisFormatter,
    xAxisFormatter,
    isStackedColumn,
    categoryXSeries,
    legendDurations,
    height,
    metric,
}) =>
    combineConfigs({ type, yAxisFormatter, xAxisFormatter }, [
        monthlyIntervalConfig,
        yAxisLabelsConfig,
        categoryXSeries ? xAxisCategoryConfig : null,
        xAxisLabelsConfig,
        type === "column" ? noZoomConfig : null,
        yAxisGridLineConfig,
        type === "column" ? null : xAxisCrosshair,
        noLegendConfig,
        {
            plotOptions: {
                column: {
                    stacking: isStackedColumn ? "normal" : null,
                },
            },
            tooltip: {
                shared: true,
                useHTML: true,
                style: {
                    margin: 0,
                },
                padding: 4,
                backgroundColor: colorsPalettes.carbon[0],
                borderWidth: 0,
                borderColor: colorsPalettes.carbon[50],
                formatter() {
                    return isStackedColumn
                        ? columnTooltip.call(this, yAxisFormatter)
                        : defaultTooltip.call(this, yAxisFormatter, type, legendDurations, metric);
                },
            },
            chart: {
                height,
            },
        },
    ]);
