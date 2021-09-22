import { ServerUrl } from "exporters/HighchartExport";
import { ChartMarkerService } from "services/ChartMarkerService";
import angular from "angular";
import * as _ from "lodash";

angular.module("sw.common").factory("swChartConfig", function () {
    const lineConfig = {
        chart: {
            events: {},
            zoomType: "x",
            marginTop: 38,
            spacingLeft: 0,
            spacingTop: 15,
            spacingRight: 0,
            marginLeft: 100,
            marginRight: 50,
            renderTo: null,
        },
        title: {
            text: null,
        },
        subtitle: {},
        series: [],
        credits: {},
        plotOptions: {
            line: {
                shadow: {
                    color: "rgba(0,0,0,0.2)",
                    offsetX: 0,
                    offsetY: -2,
                    opacity: 0.5,
                    width: 3,
                },
            },
        },
        navigator: {
            enabled: false,
        },
        colors: ["#8E70E0", "#00B5F0", "#71CA2F", "#F60", "#F3C"],
        exporting: {
            enabled: false,
            url: ServerUrl,
            chartOptions: {
                chart: {
                    spacingLeft: 0,
                    spacingRight: 10,
                    spacingTop: 10,
                    spacingBottom: 20,
                    width: 800,
                    height: 400,
                    marginLeft: 100,
                    marginRight: 100,
                    marginBottom: 40,
                    marginTop: 100,
                },
                legend: {
                    floating: false,
                    x: 0,
                    y: 0,
                    itemMarginTop: 30,
                    itemMarginBottom: 5,
                },
            },
        },
        xAxis: {
            type: "datetime",
            tickInterval: 2678400000,
            maxZoom: 1209600000,
            title: {
                text: null,
            },
            gridLineDashStyle: "solid",
            gridLineColor: "#e2e2e2",
            gridLineWidth: 1,
            lineWidth: 1,
            tickWidth: 1,
            minPadding: 0,
            minorGridLineWidth: 0,
            startOnTick: true,
            showFirstLabel: true,
            labels: {
                align: "center",
                x: null,
                style: {
                    color: "#666",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    fontFamily: "'Roboto', sans-serif",
                },
                enabled: true,
            },
        },
        yAxis: {
            title: {
                enabled: false,
            },
            gridLineColor: "rgba(200,200,200,0.4)",
            gridLineWidth: 1,
            gridLineDashStyle: "solid",
            lineWidth: 1,
            min: 0,
            labels: {
                style: {
                    color: "#999",
                    fontFamily: "Arial",
                    fontSize: "11px",
                },
            },
            showFirstLabel: false,
        },
        tooltip: {
            shared: true,
            crosshairs: [
                {
                    width: 1,
                    color: "#e2e2e2",
                    zIndex: 5,
                },
                null,
            ],
        },
        legend: {
            floating: true,
            x: 0,
            y: -15,
            borderRadius: 0,
            borderWidth: 0,
            symbolWidth: 20,
            symbolRadius: 10,
            useHTML: true,
            align: "left",
            layout: "horizontal",
            verticalAlign: "top",
            enabled: false,
        },
    };

    // * Return The Service *
    return {
        getLineConfig: function (config) {
            const res = angular.copy(lineConfig);

            res.xAxis.tickInterval = config.interval;
            config.series.forEach(function (item, index) {
                const color = res.colors[index];
                res.series.push({
                    name: item.title,
                    color: color,
                    marker: {
                        symbol: `url(${ChartMarkerService.createMarkerSrc(color)})`,
                    },
                    data: item.data,
                });
            });

            return res;
        },
    };
});
