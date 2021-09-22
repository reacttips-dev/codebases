import * as _ from "lodash";

const getTallestColumn = (chart) => {
    return _.maxBy(chart.hoverPoints, (point: any) => point.y);
};

export function tooltipPositioner(width, height, point) {
    const topPoint = getTallestColumn(this.chart);
    const { top } = topPoint.graphic.element.getBoundingClientRect();
    const leftColumn = this.chart.hoverPoints[0];
    const leftColumnElement = leftColumn.graphic.element;
    const tooltipDimension = {
        xGap: 100,
        yGap: 20,
        height: height,
        width: width,
    };

    if (point.plotX + width > this.chart.plotWidth) {
        tooltipDimension.xGap = point.plotX + width - this.chart.plotWidth;
    }

    if (point.plotY + height < this.chart.plotHeight) {
        tooltipDimension.yGap += point.plotY;
    }

    return {
        x: leftColumnElement.getBoundingClientRect().left - tooltipDimension.xGap,
        y: top - (tooltipDimension.height + tooltipDimension.yGap),
    };
}
