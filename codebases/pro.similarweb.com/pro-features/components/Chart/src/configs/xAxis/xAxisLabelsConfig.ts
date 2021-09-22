export default ({ xAxisFormatter }) => {
    return {
        xAxis: {
            labels: {
                formatter: function () {
                    return xAxisFormatter(this);
                },
            },
        },
    };
};
