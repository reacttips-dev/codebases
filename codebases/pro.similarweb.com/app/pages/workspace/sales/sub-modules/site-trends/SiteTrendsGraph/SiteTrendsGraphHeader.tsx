import React from "react";
import { ChangeValue } from "@similarweb/ui-components/dist/change-value";
import dateTimeService from "services/date-time/dateTimeService";
import {
    StyledTrendsGraphTitle,
    StyledTrendsGraphSubTitle,
    StyledSiteTrendsGraphHeader,
    StyledTrendsGraphTitleValue,
} from "./styles";
import { formatAsPercents } from "../../benchmarks/helpers";
import { getValueFormatterByUnits } from "pages/workspace/sales/sub-modules/site-trends/helpers";
import { Trend } from "pages/workspace/sales/sub-modules/site-trends/types";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";

const formatDate = "MMM YYYY";

type SiteTrendsGraphHeaderProps = {
    currentData: Trend;
    endDate: string;
    unites?: string;
};

const SiteTrendsGraphHeader: React.FC<SiteTrendsGraphHeaderProps> = (props) => {
    const { endDate, currentData, unites = "" } = props;
    const { date: startDate, avgValue, change } = currentData;
    const endPoint = dateTimeService.formatWithMoment(endDate, formatDate);
    const startPoint = dateTimeService.formatWithMoment(startDate, formatDate);

    const titleValue = getValueFormatterByUnits(unites)(avgValue);

    const changeValue = formatAsPercents(Math.abs(change));
    const isDecrease = change < 0 ? true : false;

    return (
        <StyledSiteTrendsGraphHeader>
            <StyledTrendsGraphTitle>
                <StyledTrendsGraphTitleValue>
                    <PlainTooltip
                        placement="top"
                        maxWidth={300}
                        tooltipContent={"Average value for the selected period"}
                    >
                        <span>{titleValue}</span>
                    </PlainTooltip>
                </StyledTrendsGraphTitleValue>
                <ChangeValue value={changeValue} isDecrease={isDecrease} />
            </StyledTrendsGraphTitle>
            <StyledTrendsGraphSubTitle>
                <span>{startPoint}</span>
                {" - "}
                <span>{endPoint}</span>
            </StyledTrendsGraphSubTitle>
        </StyledSiteTrendsGraphHeader>
    );
};

export default SiteTrendsGraphHeader;
