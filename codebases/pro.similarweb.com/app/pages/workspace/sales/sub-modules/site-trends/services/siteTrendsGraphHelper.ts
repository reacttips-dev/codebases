import { getValueFormatterByUnits } from "pages/workspace/sales/sub-modules/site-trends/helpers";
import dateTimeService from "services/date-time/dateTimeService";
import { watermarkService } from "common/services/watermarkService";

const siteTrendsGraphHelper = () => {
    const formatterLabelY = (unit: string = "") => {
        return function () {
            if (this.value === 0 && !unit) {
                return "0";
            }
            return getValueFormatterByUnits(unit)(this.value);
        };
    };

    return {
        getConfig(startPoint: number, unit?: string) {
            return {
                chart: {
                    zoomType: null,
                    events: {
                        load: function () {
                            watermarkService.add.call(this, {
                                opacity: 0.1,
                                width: 90,
                                height: 13,
                            });
                        },
                    },
                },
                legend: {
                    enabled: false,
                },
                xAxis: {
                    type: "datetime",
                    tickLength: 8,
                    tickWidth: 1,
                    minPadding: 0,
                    title: {
                        text: null,
                    },
                    labels: {
                        enabled: true,
                        staggerLines: 2,
                        formatter() {
                            return dateTimeService.formatWithMoment(this.value, "MMM YYYY");
                        },
                        align: "center",
                        style: {
                            color: "rgba(42, 62, 82, 0.6)",
                            fontSize: "10px",
                        },
                    },
                    endOnTick: true,
                    startOnTick: true,
                    tickPositioner() {
                        return [this.dataMin, startPoint, this.dataMax];
                    },
                },
                yAxis: {
                    min: 0,
                    gridLineWidth: 0,
                    labels: {
                        enabled: true,
                        formatter: formatterLabelY(unit),
                    },
                },
                plotOptions: {
                    area: {
                        color: "#4f8df9",
                        fillColor: "rgb(208,223,250)",
                    },
                    series: {
                        pointInterval: 24 * 3600 * 1000,
                        lineWidth: 2,
                        marker: {
                            enabled: false,
                            radius: 5,
                            states: {
                                hover: {
                                    enabled: true,
                                    fillColor: "#4f8df9",
                                    radius: 5,
                                },
                            },
                        },
                        states: {
                            hover: {
                                enabled: true,
                                lineWidth: 2,
                            },
                        },
                    },
                },
                tooltip: {
                    enabled: false,
                },
            };
        },
    };
};

export default siteTrendsGraphHelper();
