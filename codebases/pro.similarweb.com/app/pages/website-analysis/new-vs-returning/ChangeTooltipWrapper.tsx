import dayjs, { Dayjs } from "dayjs";
import { i18nFilter, percentageSignFilter } from "filters/ngFilters";
import ReactDOMServer from "react-dom/server";
import { ChangeTooltip } from "@similarweb/ui-components/dist/chartTooltips";
import styled from "styled-components";
import _ from "lodash";
import { formatTooltipPointWithConfidence } from "components/Chart/src/data/confidenceProcessor";

const TooltipWrapper = styled.div`
    padding: 10px 15px 5px;
    border-radius: 5px;
`;

export interface ITooltipFormatter {
    props: {
        granularity: string;
        isWindow: boolean;
        showChange: boolean;
        valueFilter: any;
        data: any;
    };
    getTooltipHeader: (points, granularity, showChange, isMTDOn?, mtdEndDate?) => any;
    getTableHeaders: () => any;
}

export function TooltipFormatter({ props, getTooltipHeader, getTableHeaders }) {
    return function () {
        const { granularity, valueFilter, isWindow, showChange = false, data } = props;
        const { points } = this;
        // sort by x by chronological order
        points.forEach((p) => p.series.data.sort((a, b) => (a.x > b.x ? 1 : -1)));

        const changeTooltipProp = () => {
            data.sort((a, b) => (b?.tooltipIndex < a?.tooltipIndex ? 1 : -1));
            return data.map((graphData: any) => {
                let change: string | number;
                const { name, color } = graphData;
                const point = _.filter(graphData.data, (point) => point.x === this.x);
                const currentPointIndex = _.findIndex(
                    graphData?.data,
                    (point: any) => point.x === this.x,
                );
                const prevPointVal = graphData?.data[currentPointIndex - 1];
                if (prevPointVal?.y === 0) {
                    change = point?.[0]?.y === 0 ? 0 : i18nFilter()("common.tooltip.change.new");
                } else {
                    change = prevPointVal?.y ? point?.[0]?.y / prevPointVal?.y - 1 : 0;
                }

                if (typeof change !== "string") {
                    change = change !== 0 && percentageSignFilter()(change, 1);
                }
                const valueFormatted = formatTooltipPointWithConfidence(
                    point[0].y,
                    _.get(point, "[0][confidence]", undefined),
                    valueFilter,
                );
                return showChange
                    ? {
                          value: valueFormatted,
                          color: color,
                          displayName: name,
                          change,
                      }
                    : {
                          value: valueFormatted,
                          color: color,
                          displayName: name,
                      };
            });
        };

        const changeTooltipProps = {
            header: getTooltipHeader(this, granularity, isWindow),
            tableHeaders: getTableHeaders(),
            tableRows: changeTooltipProp(),
            showChangeColumn: showChange,
        };

        return ReactDOMServer.renderToString(
            <TooltipWrapper>
                <ChangeTooltip {...changeTooltipProps} />
            </TooltipWrapper>,
        );
    };
}

export const getTooltipHeader = (self, granularity, isWindow, toDateMoment) => {
    let date;
    switch (granularity) {
        case "Daily":
            date = dayjs.utc(self.x).format("dddd, MMM DD, YYYY");
            break;
        case "Weekly":
            const from: Dayjs = dayjs.utc(self.x);
            const isLast: boolean = _.last(self?.points?.[0]?.series?.xData) === self.x;
            let toWeek = dayjs.utc(self.x).add(6, "days");
            // show partial week in case of last point when start of week and end of week aren't in the same month.
            if (isLast && !isWindow) {
                if (from.month() !== toWeek.month()) {
                    toWeek = from.clone().endOf("month").startOf("day").utc();
                }
            } else if (isLast && isWindow && toDateMoment) {
                toWeek = toDateMoment;
            }
            date =
                "From " +
                dayjs.utc(self.x).format("MMM DD, YYYY") +
                " to " +
                toWeek.format("MMM DD, YYYY");
            break;
        case "Monthly":
            date = dayjs.utc(self.x).format("MMM. YYYY");
            break;
    }
    return date;
};

export const getTableHeaders = (showChange) => {
    const res = [
        { position: 0, displayName: "Audience" },
        { position: 1, displayName: "Unique Visitors" },
    ];
    if (showChange) {
        res.push({ position: 2, displayName: "Change" });
    }
    return res;
};
