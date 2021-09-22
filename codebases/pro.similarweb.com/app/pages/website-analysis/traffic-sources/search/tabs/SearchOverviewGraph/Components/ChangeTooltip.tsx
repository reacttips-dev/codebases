import { i18nFilter, percentageSignFilter } from "filters/ngFilters";
import ReactDOMServer from "react-dom/server";
import * as React from "react";
import { ChangeTooltip } from "@similarweb/ui-components/dist/chartTooltips";
import styled from "styled-components";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { getTooltipHeader } from "UtilitiesAndConstants/UtilitiesComponents/chartTooltipHeaderWithMTDSupport";

const TooltipWrapper = styled.div`
    padding: 10px 15px 15px;
    background-color: ${colorsPalettes.carbon[0]};
    box-shadow: 0 3px 6px 0 ${rgba(colorsPalettes.carbon[200], 0.5)};
    border-radius: 5px;
    > div {
        width: 300px;
    }
`;

export function changeTooltipFormatter(
    name,
    yFormatter,
    isWindow,
    duration,
    isPercents = false,
    granularity,
    lastSupportedDate,
    getChangeColor = undefined,
) {
    return function () {
        const { points } = this;
        // sort by x by chronological order
        points.forEach((p) => p.series.data.sort((a, b) => (a.x > b.x ? 1 : -1)));
        const changeTooltipProp = (points) => {
            return points.map((point) => {
                const sortedDataPoints = point.series.data.sort((p1, p2) => p1.x - p2.x);
                const pointIndex = sortedDataPoints.findIndex((p) => p.x === point.x);
                const previousPointData = sortedDataPoints[pointIndex ? pointIndex - 1 : 0];
                const isNew = previousPointData.y === 0 && point.y !== 0;
                const changeString = isNew && i18nFilter()("common.tooltip.change.new");
                const changeValue = previousPointData.y ? point.y / previousPointData.y - 1 : 0;
                const changeDisplayValue =
                    changeString || !changeValue
                        ? changeString
                        : percentageSignFilter()(changeValue, 0);
                return {
                    value: yFormatter({ value: point.y }),
                    color: point.series.color,
                    displayName: point.series.name,
                    change: changeDisplayValue,
                };
            });
        };

        const changeTooltipProps = {
            header: getTooltipHeader(granularity, points, lastSupportedDate),
            ...(getChangeColor && { getChangeColor }),
            tableHeaders: [
                { position: 1, displayName: name },
                { position: 0, displayName: i18nFilter()("common.tooltip.domain") },
                { position: 2, displayName: i18nFilter()("common.tooltip.change") },
            ],
            tableRows: changeTooltipProp(points),
        };
        return ReactDOMServer.renderToString(
            <TooltipWrapper>
                <ChangeTooltip {...changeTooltipProps} />
            </TooltipWrapper>,
        );
    };
}
