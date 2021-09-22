import dayjs from "dayjs";

export function chartTooltip(dataObj, startDate, endDate, format, interval) {
    const startOfRange = dayjs.utc(startDate);
    const endOfRange = dayjs.utc(endDate);

    const scope = {
        points: dataObj.points ? dataObj.points : [dataObj],
    };

    // format date
    const key = scope.points[0].key;
    const mDate = dayjs.utc(key);
    const week = mDate.clone().add(6, "days");

    let date;
    switch (interval) {
        case "weekly":
            date =
                "from " +
                mDate.format("LL") +
                " to " +
                (week.isBefore(endOfRange) ? week : endOfRange).format("LL");
            break;
        case "monthly":
            date = mDate.format("MMMM YYYY");
            break;
        case "daily":
            date = mDate.format("dddd,MMM D, YYYY");
            break;
    }

    // build HTML from template
    const lines = [];
    lines[0] = '<div class="date">' + date + "</div>";

    scope.points.forEach((point) => {
        const decimals = point.point.y < 1000 ? 2 : 0;
        lines.push(
            `<span class="highcharts-tooltip-circle" style="background-color: ${
                point.series.color
            }"></span><strong>${point.series.name}</strong> ${format(point.point.y, decimals)}`,
        );
    });

    return lines.join("<br>");
}
