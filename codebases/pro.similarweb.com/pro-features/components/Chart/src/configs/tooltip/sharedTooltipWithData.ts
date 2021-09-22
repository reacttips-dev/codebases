import _ from "lodash";
import dayjs from "dayjs";
import { formatTooltipPointWithConfidence } from "components/Chart/src/data/confidenceProcessor";

export default ({
    filter,
    xAxisFormat,
    data,
    granularity = "Monthly",
    isWindow = false,
    toDateMoment = undefined,
    coloredFontTooltip = true,
}) => {
    return {
        tooltip: {
            shared: true,
            outside: false,
            useHTML: true,
            backgroundColor: "transparent",
            borderWidth: 0,
            padding: 0,
            shadow: false,
            formatter() {
                const lines = [];
                let date;
                switch (granularity) {
                    case "Daily":
                        date = dayjs.utc(this.x).format("dddd, MMM DD, YYYY");
                        break;
                    case "Weekly":
                        const to: any = dayjs.utc(_.last(this?.points?.series?.xData));
                        const from: any = dayjs.utc(this.x);
                        const isLast: boolean = _.last(this?.points?.[0]?.series?.xData) === this.x;
                        let toWeek = dayjs.utc(this.x).add(6, "days");
                        // show partial week in case of last point when start of week and end of week aren't in the same month.
                        if (isLast && !isWindow) {
                            if (from.month() !== toWeek.month()) {
                                toWeek = from.clone().endOf("month").startOf("day").utc();
                            }
                        } else if (isLast && isWindow && toDateMoment) {
                            toWeek = toDateMoment;
                        }
                        date =
                            "From " +
                            dayjs.utc(this.x).format("MMM DD, YYYY") +
                            " to " +
                            toWeek.format("MMM DD, YYYY");
                        break;
                    case "Monthly":
                        date = dayjs.utc(this.x).format("MMM. YYYY");
                        break;
                }
                lines.push(
                    // eslint-disable-next-line max-len
                    '<div style="background-color: white;padding: 5px 5px 12px 5px;box-shadow: 0 1px 3px rgba(0,0,0,0.15);border: 1px solid rgba(0,0,0,0.15);border-radius: 4px;">' +
                        '<div style="font-weight: bold" class="date">' +
                        date +
                        "</div>",
                );
                data.sort((a, b) => (b?.tooltipIndex < a?.tooltipIndex ? 1 : -1));
                _.forEach(data, (graphData: any) => {
                    const { name, color, seriesSubtitle } = graphData;
                    const point: any = _.filter(graphData.data, (point) => point.x === this.x);
                    const valueFormatted = formatTooltipPointWithConfidence(
                        point?.[0]?.y,
                        _.get(point, "[0][confidence]", undefined),
                        filter,
                    );
                    lines.push(`<div style="display: flex;align-items: baseline; min-width:180px; max-width: 300px; padding: 1px 10px;">
                                <span class="item-marker" style="flex-shrink:0; background:${color};"></span>
                                <div style="display: flex;flex-direction: column; width: calc(100% - 64px); ">
                                    <span class="item-name">${name}</span>
                                     ${
                                         seriesSubtitle
                                             ? `<span class="sub-item-name">${seriesSubtitle}</span>`
                                             : ""
                                     }
                                </div>
                                <span class="item-value" style="margin-left:4px;color:${
                                    coloredFontTooltip ? color : "#7F8B97"
                                };">${valueFormatted}</span>
                            </div>`);
                });
                lines.push(`</div>`);
                return lines.join("");
            },
        },
    };
};
