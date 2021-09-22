export default ({ type }) => {
    const interval = 24 * 3600 * 1000;
    return {
        xAxis: {
            type: "datetime",
        },
        plotOptions: {
            [type]: {
                marker: {
                    enabled: false,
                },
            },
            series: {
                pointInterval: interval,
                marker: {
                    radius: 4.5,
                    states: {
                        hover: {
                            enabled: true,
                            lineWidth: 1,
                            lineColor: "#fff",
                            radius: 6,
                        },
                    },
                },
                states: {
                    hover: {
                        enabled: true,
                    },
                },
            },
        },
    };
};
