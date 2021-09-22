import { i18nFilter, percentageSignFilter } from "filters/ngFilters";
import ReactDOMServer from "react-dom/server";
import * as React from "react";
import { ChangeTooltip } from "@similarweb/ui-components/dist/chartTooltips";
import styled from "styled-components";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { getTooltipHeader } from "UtilitiesAndConstants/UtilitiesComponents/chartTooltipHeaderWithMTDSupport";

const TooltipWrapper = styled.div<{ showChange?: boolean }>`
    padding: 10px 15px 15px;
    background-color: ${colorsPalettes.carbon[0]};
    box-shadow: 0 3px 6px 0 ${rgba(colorsPalettes.carbon[200], 0.5)};
    border-radius: 5px;
    > div {
        width: ${({ showChange }) => (showChange ? "330px" : null)};
        > div {
            justify-content: space-between;
        }
    }
`;

const ChangeHeaderContainer = styled.div`
    text-align: right;
`;

const MonthlyGranularity = "Monthly";
export function changeTooltipFormatter(name, yFormatter, isWindow, duration) {
    return function () {
        const { points } = this;
        // sort by x by chronological order
        points.forEach((p) => p.series.data.sort((a, b) => (a.x > b.x ? 1 : -1)));

        const showChange = !isWindow && duration !== "1m";

        const getChangeColumnHeader = () => {
            return <ChangeHeaderContainer>Change</ChangeHeaderContainer>;
        };

        const changeTooltipProp = (points) => {
            return points.map((point, index) => {
                let change: string | number;

                if (showChange) {
                    const currentIndex = points[index].series.xData.findIndex((x) => x === point.x);
                    const prevPointVal = points[index].series.yData[currentIndex - 1];

                    if (prevPointVal === 0) {
                        change = point.y === 0 ? 0 : i18nFilter()("common.tooltip.change.new");
                    } else {
                        change = prevPointVal ? point.y / prevPointVal - 1 : 0;
                    }

                    if (typeof change !== "string") {
                        // SIM-33040
                        if (!isNaN(change) && Number(Number(change).toFixed(2)) === 0) {
                            change = 0;
                        }
                        change = change !== 0 && percentageSignFilter()(change, 0);
                    }
                }
                return {
                    value: yFormatter({ value: point.y }),
                    color: point.series.color,
                    displayName: point.series.name,
                    change: change,
                };
            });
        };

        const changeTooltipProps = {
            header: getTooltipHeader(MonthlyGranularity, points, null),
            tableHeaders: [
                { position: 0, displayName: "Domain" },
                { position: 1, displayName: name },
                { position: 2, displayName: getChangeColumnHeader() },
            ],
            tableRows: changeTooltipProp(points),
            showChangeColumn: showChange,
        };
        return ReactDOMServer.renderToString(
            <TooltipWrapper showChange={showChange}>
                <ChangeTooltip {...changeTooltipProps} />
            </TooltipWrapper>,
        );
    };
}
