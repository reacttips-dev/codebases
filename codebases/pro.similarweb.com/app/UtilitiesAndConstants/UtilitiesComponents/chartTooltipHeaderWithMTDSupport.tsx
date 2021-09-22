import styled from "styled-components";
import dayjs from "dayjs";
import { colorsPalettes } from "@similarweb/styles";
import { i18nFilter } from "filters/ngFilters";

export const TooltipPartialText = styled.div`
    font-size: 12px;
    line-height: 16px;
    padding: 4px 8px;
    font-weight: 400;
    background: ${colorsPalettes.carbon["50"]};
    border-radius: 4px;
    margin-top: 8px;
`;

const granularityNameToMomentUnit = {
    Daily: "days",
    Weekly: "weeks",
    Monthly: "months",
};

export const getTooltipHeaderElement = (timeGranularity, date, lastSupportedDate) => {
    const dateMoment = dayjs.utc(date);
    const isPartial = dayjs(dateMoment)
        .add(1, granularityNameToMomentUnit[timeGranularity])
        .subtract(1, "days")
        .isAfter(dayjs.utc(lastSupportedDate));
    let text, partialText;
    if (timeGranularity === "Monthly") {
        text =
            dateMoment.format("MMMM YYYY") +
            (isPartial ? ` (Until ${dayjs.utc(lastSupportedDate).format("MMM DD")})` : "");
        partialText = isPartial ? i18nFilter()("common.tooltip.show.partial.month") : "";
    } else if (timeGranularity === "Weekly") {
        const toWeek = dayjs(dateMoment).add(6, "days");
        const toDate = toWeek.isAfter(lastSupportedDate) ? dayjs.utc(lastSupportedDate) : toWeek;
        text = `From ${dateMoment.format("MMM DD, YYYY")} to ${toDate.format("MMM DD, YYYY")}`;
        partialText = isPartial ? i18nFilter()("common.tooltip.show.partial.week") : "";
    } else {
        text = dateMoment.format("dddd, MMM DD, YYYY");
    }
    return (
        <>
            <span>{text}</span>
            {partialText && <TooltipPartialText>{partialText}</TooltipPartialText>}
        </>
    );
};

export const getTooltipHeader = (timeGranularity: string, points, lastSupportedDate = undefined) =>
    getTooltipHeaderElement(timeGranularity, points[0].x, lastSupportedDate);
