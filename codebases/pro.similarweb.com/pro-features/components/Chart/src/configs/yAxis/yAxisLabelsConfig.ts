export default ({ yAxisFormatter }) => {
    return {
        yAxis: {
            labels: {
                formatter: function () {
                    return yAxisFormatter(this);
                },
            },
        },
    };
};
