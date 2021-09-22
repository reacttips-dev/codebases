import { abbrNumberFilter, minVisitsFilter, percentageFilter } from "filters/ngFilters";
import React from "react";
import styled from "styled-components";

import { colorsPalettes } from "@similarweb/styles";

import { ITableCellProps } from "../interfaces/ITableCellProps";
import { ProgressBarContainer } from "./ProgressBarContainer";

const MINIMUM_TRAFFIC_THRESHOLD = 5000;

interface ITrafficScoreProps extends ITableCellProps {
    innerColor: string;
}

/**
 * Formats the tooltip traffic data
 * just keeping up with the existing logic that TrafficScore
 * component has. it returns a number or boolean.
 * I couldn't change it since it'll break things ¯\_(ツ)_/¯
 */
const resolveVisitsPercentage = (row, progressBarTooltip) => {
    const tooltipTrafficData = row[progressBarTooltip];
    if (tooltipTrafficData) {
        // Encapsulate any data that is bellow 5,000 visits using minVisitsFilter
        // otherwise - abbreviate the number to a displayable format.
        const isBelowMinimumTraffic = tooltipTrafficData < MINIMUM_TRAFFIC_THRESHOLD;
        return isBelowMinimumTraffic
            ? minVisitsFilter()(tooltipTrafficData)
            : abbrNumberFilter()(tooltipTrafficData);
    }

    // in case no data is present, return false ¯\_(ツ)_/¯
    return false;
};

/**
 * Overrides progressBar style to remove round borders
 */
const ProgressBarWrapper = styled.div`
    .sw-progress-bar {
        border-radius: 1px;
    }
`;

export const TrafficScore = (props: ITrafficScoreProps) => {
    const { value, row, progressBarTooltip, innerColor, hideZeroValue = false } = props;

    const filledBarPercentage = value ? value * 100 : 0;
    const tooltipVisits = resolveVisitsPercentage(row, progressBarTooltip);

    const hasValue = value && typeof value !== "undefined" && value > 0;
    const shouldHideValue = !hasValue && hideZeroValue;
    const valuePercentage = shouldHideValue ? "N/A" : percentageFilter()(value || 0, 2) + "%";

    return (
        <ProgressBarWrapper>
            <ProgressBarContainer
                progressBarWidth={value}
                visits={tooltipVisits}
                valuePercents={value}
                innerColor={innerColor}
                height={8}
            />
        </ProgressBarWrapper>
    );
};

TrafficScore.displayName = "TrafficScore";
