export interface IChartConfigCategory {
    display: string;
    dataKey: string;
}

interface IBarChartConfig {
    valueFormatter: (any) => string;
    categories: IChartConfigCategory[];
}

export const barChartConfig = ({ valueFormatter, categories }: IBarChartConfig) => {
    return {
        chart: {
            height: null,
            margin: [20, 20, 30, 50],
            spacing: [10, 0, 0, 0],
            type: "column",
            borderColor: "#FFFFFF",
            style: { fontFamily: "Arial", fontSize: "11px" },
            animation: true,
            events: {},
        },
        legend: { enabled: false },
        title: { text: null },
        tooltip: { enabled: false },
        xAxis: {
            categories,
            lineColor: "#e4e4e4",
            gridLineColor: "#e4e4e4",
            tickWidth: 0,
            labels: {
                align: "center",
                rotation: 0,
                useHTML: true,
                style: {
                    fontSize: "14px",
                    textAlign: "center",
                    fontFamily: '"Roboto", sans-serif',
                },
                formatter: function () {
                    return this.value.display;
                },
            },
        },
        yAxis: {
            gridLineColor: "#e4e4e4",
            min: null,
            startOnTick: false,
            endOnTick: true,
            title: null,
            opposite: false,
            showLastLabel: true,
            labels: {
                align: "right",
                enabled: true,
                useHTML: true,
                x: -10,
                style: {
                    fontSize: "12px",
                    textTransform: "uppercase",
                    fontFamily: '"Roboto", sans-serif',
                    color: "#aaa",
                },
                formatter: function () {
                    return valueFormatter(this.value);
                },
            },
        },
        plotOptions: {
            column: {
                pointPadding: 0.15,
                borderWidth: 0,
                pointWidth: null,
                minPointLength: 3,
                dataLabels: {
                    enabled: true,
                    color: "#707070",
                    useHTML: true,
                    style: {
                        fontFamily: '"Roboto", sans-serif',
                        fontSize: "14px",
                        fontWeight: "400",
                    },
                    crop: false,
                    overflow: "none",
                    formatter: function () {
                        return valueFormatter(this.y);
                    },
                },
                states: { hover: { enabled: false } },
                maxPointWidth: 40,
                pointRange: 1,
                grouping: true,
            },
        },
    };
};

export const makeDashedColor = (color) => ({
    pattern: {
        path: {
            d: "M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11",
            fill: color,
            strokeWidth: 3.5,
            stroke: "rgba(255, 255, 255, 0.075)",
        },
        width: 10,
        height: 10,
        backgroundColor: color,
    },
});

export const barChartGraphDashed = (
    data: { data: { color: string }[] }[],
    isPointDashed: (any) => boolean,
) => {
    return data.map((series) => ({
        ...series,
        data: series.data.map((point) => ({
            ...point,
            color: isPointDashed(point) ? makeDashedColor(point.color) : point.color,
        })),
    }));
};
