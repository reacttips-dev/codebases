import dayjs from "dayjs";
import { changeFilter, i18nFilter, percentageSignFilter } from "filters/ngFilters";
import ReactDOMServer from "react-dom/server";
import { ChangeTooltip } from "@similarweb/ui-components/dist/chartTooltips";
import styled from "styled-components";
import {
    getMetricTooltipHeader,
    getYaxisFormat,
} from "pages/website-analysis/traffic-sources/mmx/components/ChannelAnalysisChart/ChannelAnalysisChartConfig";
import * as _ from "lodash";
import { PartialText } from "pages/website-analysis/traffic-sources/mmx/components/ChannelAnalysisChart/StyledComponents";
import { formatDate } from "utils";
import { swSettings } from "common/services/swSettings";

const TooltipWrapper = styled.div`
    padding: 10px 15px 5px;
    border-radius: 5px;
`;

const StyledPartialText = styled(PartialText)`
    margin: 0;
`;

export function changeTooltipFormatter(
    metric,
    granularity,
    isMTDOn,
    mtdEndDate,
    isPercent,
    periodDuration,
    isWindow,
    getChangeColor,
) {
    return function () {
        const { points } = this;
        // sort by x by chronological order
        points.forEach((p) => p.series.data.sort((a, b) => (a.x > b.x ? 1 : -1)));

        let showChange =
            !isWindow && !isPercent && !(periodDuration === 0 && granularity === "Monthly");

        const getTooltipHeader = () => {
            const format =
                granularity === "Monthly"
                    ? "MMM YYYY"
                    : granularity === "Daily"
                    ? "dddd, MMM DD, YYYY"
                    : "MMM DD, YYYY";
            if (granularity !== "Daily") {
                const from = dayjs.utc(points[0].key);
                const to = from.clone();
                const t: any = _.last(points[0].series.points);
                const isLast = t.x === points[0].x;
                let toWeek = to.add(6, "days");
                if (isLast) {
                    if (isMTDOn) {
                        toWeek = dayjs(mtdEndDate);
                    } else {
                        if (from.month() !== toWeek.month()) {
                            toWeek = from.clone().endOf("month").startOf("day").utc();
                        }
                    }
                }
                const isPartial =
                    granularity === "Weekly"
                        ? !toWeek.isSame(to, "day")
                        : !isMTDOn
                        ? false
                        : dayjs.utc(mtdEndDate).isAfter(swSettings.current.endDate);
                showChange = showChange && isLast ? !isPartial : showChange;

                return (
                    <>
                        {"From " +
                            from.format("MMM DD, YYYY") +
                            " to " +
                            (granularity === "Weekly"
                                ? toWeek.format("MMM DD, YYYY")
                                : isPartial && isLast
                                ? dayjs.utc(mtdEndDate).format("MMM DD, YYYY")
                                : from.clone().endOf("month").format("MMM DD, YYYY"))}
                        {isPartial && isLast ? (
                            <StyledPartialText>
                                {i18nFilter()(
                                    granularity === "Weekly"
                                        ? "mmx.channelanalysis.graph.tooltip.partialweek"
                                        : "mmx.channelanalysis.graph.tooltip.partialmonth",
                                )}
                            </StyledPartialText>
                        ) : null}
                    </>
                );
            } else {
                return formatDate(points[0].key, null, format);
            }
        };

        const changeTooltipProp = () => {
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
                        change = change !== 0 && changeFilter()(change, 0);
                    }
                }

                return {
                    value: isPercent
                        ? percentageSignFilter()(point.y, 2)
                        : getYaxisFormat(metric, point.y, isPercent),
                    color: point.series.color,
                    displayName: point.series.name,
                    change: change,
                };
            });
        };

        const changeTooltipProps = {
            header: getTooltipHeader(),
            tableHeaders: [
                { position: 1, displayName: getMetricTooltipHeader(metric) },
                { position: 0, displayName: "Domain" },
                { position: 2, displayName: "Change" },
            ],
            tableRows: changeTooltipProp(),
            showChangeColumn: showChange,
        };

        if (getChangeColor) {
            changeTooltipProps["getChangeColor"] = getChangeColor;
        }

        return ReactDOMServer.renderToString(
            <TooltipWrapper>
                <ChangeTooltip {...changeTooltipProps} />
            </TooltipWrapper>,
        );
    };
}
