export default ({}) => {
    return {
        plotOptions: {
            series: {
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: false,
                        },
                    },
                },
            },
        },
    };
};
