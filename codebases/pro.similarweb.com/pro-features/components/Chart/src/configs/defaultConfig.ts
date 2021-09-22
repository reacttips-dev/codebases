export default ({ type }) => {
    return {
        chart: {
            type,
            zoomType: "x",
        },
        credits: {
            enabled: false,
        },
        exporting: {
            enabled: false,
        },
        yAxis: {
            title: {
                text: null,
            },
        },
        title: {
            style: {
                display: "none",
            },
        },
    };
};
