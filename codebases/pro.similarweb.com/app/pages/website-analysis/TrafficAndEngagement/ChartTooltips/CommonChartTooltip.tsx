import { colorsPalettes } from "@similarweb/styles";
import { ChangeTooltip } from "@similarweb/ui-components/dist/chartTooltips/src/ChangeTooltip";
import { percentageSignFilter } from "filters/ngFilters";
import { i18nFilter } from "filters/ngFilters";
import React from "react";
import { getTooltipHeader } from "UtilitiesAndConstants/UtilitiesComponents/chartTooltipHeaderWithMTDSupport";

const MonthlyGranularity = "Monthly";

export const getChange = (previousDataPoint, change) =>
    previousDataPoint
        ? change !== 0 && percentageSignFilter()(change, 2)
        : i18nFilter()("common.tooltip.change.new");

export const CompareModeTooltip = (props) => {
    const {
        points,
        yFormatter,
        getChangeColor,
        timeGranularity,
        lastSupportedDate,
        meta,
        totalAggregate,
    } = props;
    const { isSingleMode, isOneWebSource } = meta;

    const changeTooltipProp = ({ y, series, point }) => {
        const pointIndex = point.index;
        const previousDataPoint =
            pointIndex === 0 ? series.data[pointIndex].y : series.data[pointIndex - 1].y;
        const change = y / previousDataPoint - 1;
        return {
            value: yFormatter({ value: y }),
            color: series.color,
            displayName: series.name,
            change: previousDataPoint !== 0 && getChange(previousDataPoint, change),
        };
    };
    const changeTooltipProps = {
        header: getTooltipHeader(timeGranularity, points, lastSupportedDate),
        getChangeColor,
        tableHeaders: [
            { position: 1, displayName: props.name },
            { position: 0, displayName: "Domain" },
            { position: 2, displayName: "Change" },
        ],
        tableRows: points.map(changeTooltipProp),
        showChangeColumn: timeGranularity === MonthlyGranularity,
    };
    // adding the "total" row
    if (isSingleMode && !isOneWebSource && points[0] && points[1] && totalAggregate) {
        const totalValue = totalAggregate(points[0].y, points[1].y);
        const totalFistDataPoint = points[0].series.data[0].y + points[1].series.data[0].y;
        const totalChange = totalValue / totalFistDataPoint - 1;

        const total = {
            color: colorsPalettes.sky[300],
            value: yFormatter({ value: totalValue }),
            displayName: "Total",
            change: isFinite(totalChange) && totalChange !== 0 && getChange(null, totalChange),
            type: "total",
        };
        const totalProps = {
            tableRows: [...changeTooltipProps.tableRows, total],
        };
        const changeTooltipPropsWithTotal = { ...changeTooltipProps, ...totalProps };
        return <ChangeTooltip {...changeTooltipPropsWithTotal} />;
    }
    return <ChangeTooltip {...changeTooltipProps} />;
};
