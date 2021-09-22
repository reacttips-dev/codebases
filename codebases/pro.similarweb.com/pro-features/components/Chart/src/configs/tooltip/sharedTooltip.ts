import _ from "lodash";
import dayjs from "dayjs";
import { formatTooltipPointWithConfidence } from "../../data/confidenceProcessor";

export default ({ filter, xAxisFormat }) => {
    return {
        tooltip: {
            shared: true,
            outside: false,
            useHTML: true,
            backgroundColor: "#fff",
            borderWidth: 0,
            formatter: function () {
                const lines = [];
                lines.push(
                    `<div class="date">${dayjs.utc(this.x).utc().format(xAxisFormat)}</div>`,
                );
                _.forEach(this.points, (point: any) => {
                    const valueFormatted = formatTooltipPointWithConfidence(
                        point.y,
                        _.get(point, "[point][confidence]", undefined),
                        filter,
                    );
                    const seriesName = point.series.name;
                    const seriesSubtitle = point.series.userOptions.seriesSubtitle;
                    lines.push(`<div style="display: flex;align-items: baseline; max-width: 280px; padding: 1px 7px">
                                <span class="item-marker" style="flex-shrink:0; background:${
                                    point.series.color
                                };"></span>
                                <div style="display: flex;flex-direction: column; width: calc(100% - 36px); ">
                                    <span class="item-name">${seriesName}</span>
                                     ${
                                         seriesSubtitle
                                             ? `<span class="sub-item-name">${seriesSubtitle}</span>`
                                             : ""
                                     }
                                </div>
                                <span class="item-value" style="margin-left:4px;color:${
                                    point.series.color
                                };">${valueFormatted}</span>
                            </div>`);
                });
                return lines.join("");
            },
        },
    };
};
