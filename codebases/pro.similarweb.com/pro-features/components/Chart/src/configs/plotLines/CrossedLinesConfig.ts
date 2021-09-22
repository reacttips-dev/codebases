export default ({ xValue, yValue }, color?) => ({}) => {
    return {
        xAxis: {
            plotLines: [
                {
                    width: 1,
                    color,
                    dashStyle: "LongDash",
                    value: xValue,
                    zIndex: 4,
                },
            ],
        },
        yAxis: {
            plotLines: [
                {
                    width: 1,
                    color,
                    dashStyle: "LongDash",
                    value: yValue,
                    zIndex: 4,
                },
            ],
        },
    };
};
