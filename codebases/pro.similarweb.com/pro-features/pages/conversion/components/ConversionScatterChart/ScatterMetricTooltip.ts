import { icons } from "@similarweb/icons";
import { colorsPalettes, rgba } from "@similarweb/styles";
import * as _ from "lodash";

const HIGH_GRADE_COLOR = colorsPalettes.green.s100;
const LOW_GRADE_COLOR = colorsPalettes.red.s100;
const TOOLTIP_CONTAINER_PADDING = "18px 16px 16px";
const TOOLTIP_BACKGROUND = colorsPalettes.carbon[0];
const TOOLTIP_TEXT_COLOR = colorsPalettes.carbon[500];
const TOOLTIP_HINT_TEXT_COLOR = colorsPalettes.carbon[400];
const TOOLTIP_HINT_BACKGROUND = rgba(colorsPalettes.red.s100, 0.05);

function buildTooltipMetrics(metrics) {
    const cellStyle = "padding: 8px 0;font-size: 14px;font-family: Roboto;";
    return `<table style="pointer-events: all; border-spacing: 0; margin-top: 12px;">
            ${metrics
                .map((metric) => {
                    return `<tr>
                    <td style="${cellStyle}">${metric.name}</td>
                    <td style="${cellStyle} text-align:right;padding-left: 20px; padding-right: 8px;">${
                        metric.value
                    }</td>
                    <td style="${cellStyle} color: ${
                        metric.isHigh ? HIGH_GRADE_COLOR : LOW_GRADE_COLOR
                    }">${metric.label}</td>
                </tr>`;
                })
                .join("")}
        </table>`;
}

export default function (metricData, { midX, midY }, translate) {
    return function () {
        const {
            options: { singleLob, segmentName },
            name,
        } = this.series;
        const metricValues =
            metricData &&
            Object.keys(metricData).map((dimension) => {
                const value = this.point[dimension];
                const gradeComparable = dimension === "x" ? midX : midY;
                const isHigh = value > gradeComparable;
                const label = isHigh
                    ? metricData[dimension].highLabel
                    : metricData[dimension].lowLabel;
                const valueFormatter =
                    _.isFunction(metricData[dimension].valueFormat) &&
                    metricData[dimension].valueFormat;

                return {
                    name: metricData[dimension].name,
                    value: valueFormatter ? valueFormatter(value) : value,
                    label,
                    isHigh,
                };
            });
        const style = `<style type="text/css">
            .ScatterMetricTooltip {
                background: ${TOOLTIP_BACKGROUND};
                border-radius: 6px;
                box-shadow: 0 8px 8px 0 rgba(0, 0, 0, .24), 0 0 8px 0 rgba(0, 0, 0, .12);
            }
            .ScatterMetricTooltip-Container {
                box-sizing: border-box;
                padding: ${TOOLTIP_CONTAINER_PADDING};
                font-size: 14px;
                font-family: Roboto;
                color: ${TOOLTIP_TEXT_COLOR};
            }
            .ScatterMetricTooltip-Title {
                font-size: 16px;
                font-family: Roboto;
                color: ${TOOLTIP_TEXT_COLOR};
            }
            .ScatterMetricTooltip-Hint {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                width: 100%;
                padding: 7px;
                background: ${TOOLTIP_HINT_BACKGROUND};
                border-radius: 5px;
                box-sizing: border-box;
                margin-top: 12px;
            }
            .ScatterMetricTooltip-HintText {
                color: ${TOOLTIP_HINT_TEXT_COLOR};
                font-size: 12px;
            }
            .ScatterMetricTooltip-HintIcon {
                width: 16px;
                height: 16px;

                margin-right: 3px;
            }
            .ScatterMetricTooltip-HintIcon path {
                fill: ${TOOLTIP_HINT_TEXT_COLOR};
            }
        </style>`;

        return `${style}<div class="ScatterMetricTooltip">
            <div class="ScatterMetricTooltip-Container">
                <strong class="ScatterMetricTooltip-Title">${name}</strong>
                ${
                    singleLob === false
                        ? `<div class="ScatterMetricTooltip-Hint">
                        <div class="ScatterMetricTooltip-HintIcon">${icons.alerts}</div>
                        <div class="ScatterMetricTooltip-HintText">
                            ${translate("conversion.scatter.tooltip.lobhint", {
                                category: segmentName,
                            })}
                        </div>
                    </div>`
                        : ""
                }
                ${metricValues ? buildTooltipMetrics(metricValues) : ""}
            </div>
        </div>`;
    };
}
