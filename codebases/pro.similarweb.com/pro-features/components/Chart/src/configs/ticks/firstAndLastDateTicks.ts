import dayjs from "dayjs";

export default ({ firstDateTick, lastDateTick, xAxisTickLabelFormat }) => ({
    xAxis: {
        endOnTick: true,
        startOnTick: true,
        labels: {
            formatter() {
                if (this.isFirst) {
                    return dayjs(firstDateTick).utc().format(xAxisTickLabelFormat);
                } else if (this.isLast) {
                    return dayjs(lastDateTick).utc().format(xAxisTickLabelFormat);
                }
                return "";
            },
            align: "center",
            style: {
                color: "rgba(42, 62, 82, 0.6)",
                fontSize: "10px",
            },
        },
        tickPositioner() {
            return [this.dataMin, this.dataMax];
        },
    },
});
