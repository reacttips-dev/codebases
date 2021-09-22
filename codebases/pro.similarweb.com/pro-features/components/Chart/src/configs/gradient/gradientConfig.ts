export default ({ fillColor, stop1Color, stop2Color, type }) => ({
    plotOptions: {
        [type]: {
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1,
                },
                stops: [
                    [0, stop1Color],
                    [1, stop2Color],
                ],
            },
            lineColor: fillColor,
        },
        series: {
            marker: {
                states: {
                    hover: {
                        fillColor,
                    },
                },
            },
        },
    },
});
