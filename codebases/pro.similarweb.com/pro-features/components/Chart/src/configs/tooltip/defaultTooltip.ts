import _ from "lodash";
import dayjs from "dayjs";

export default ({
    filter,
    showSeriesBulletColor = true,
    granularity = "Monthly",
    isWindow = false,
    windowToDate = undefined,
}) => {
    return {
        tooltip: {
            useHTML: true,
            shared: false,
            backgroundColor: "#fff",
            borderWidth: 0,
            borderColor: "#AAA",
            style: {
                color: "#707070",
                fontFamily: '"Roboto", sans-serif',
                fontSize: "14px",
            },
            formatter() {
                const valueFormatted =
                    _.get(this.point, "[confidence]", undefined) >= 0.3
                        ? "~ " + filter[0]()(this.point.y, filter[1])
                        : filter[0]()(this.point.y, filter[1]);
                const from = this.x;
                let date;
                switch (granularity) {
                    case "Daily":
                        date = dayjs.utc(this.x).format("dddd, MMM DD, YYYY");
                        break;
                    case "Weekly":
                        const to: any = dayjs.utc(_.last(this.series.xData));
                        const from: any = dayjs.utc(this.x);
                        const isLast: boolean = _.last(this.series.xData) === this.x;
                        let toWeek = dayjs.utc(this.x).add(6, "days");
                        // show partial week in case of last point when start of week and end of week aren't in the same month.
                        if (isLast && !isWindow) {
                            if (from.month() !== toWeek.month()) {
                                toWeek = from.clone().endOf("month").startOf("day").utc();
                            }
                        } else if (isLast && isWindow && windowToDate) {
                            toWeek = windowToDate;
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
                const lines = [];
                lines.push('<div style="font-weight: bold" class="date">' + date + "</div>");
                if (showSeriesBulletColor) {
                    lines.push(
                        `<div style="display: flex;align-items: baseline; max-width: 280px; padding: 1px 10px">`,
                    );
                    lines.push(
                        `<span style="width: 10px; height: 10px; border-radius: 10px; margin-right: 8px;flex-shrink:0; background:${this.point.series.color};"></span>`,
                    );
                } else {
                    lines.push(
                        `<div style="display: flex;align-items: baseline; max-width: 280px; padding: 1px 6px">`,
                    );
                }
                lines.push(`<div style="display: flex;flex-direction: column; width: calc(100% - 20px); ">
                                    <span class="item-name">${this.point.series.name}</span>
                                </div>
                                <span class="item-value" style="margin-left:4px;color:${this.series.color};">${valueFormatted}</span>
                            </div>`);
                return lines.join("");
            },
        },
    };
};
