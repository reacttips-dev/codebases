import * as _ from "lodash";

export default () => {
    return {
        tooltip: {
            positioner: function (labelWidth, labelHeight, point) {
                const plotTopOffset = 10,
                    horizontalOffset = 20;
                let tooltipX;
                const tooltipY = this.chart.plotTop + plotTopOffset;

                // Source: http://ahumbleopinion.com/customizing-highcharts-tooltip-positioning/
                if (point.plotX + labelWidth > this.chart.plotWidth) {
                    tooltipX = point.plotX + this.chart.plotLeft - labelWidth - horizontalOffset;
                } else {
                    tooltipX = point.plotX + this.chart.plotLeft + horizontalOffset;
                }

                return {
                    x: tooltipX,
                    y: tooltipY,
                };
            },
        },
    };
};
