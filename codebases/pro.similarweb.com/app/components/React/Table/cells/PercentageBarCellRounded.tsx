import { percentageFilter } from "filters/ngFilters";
import * as React from "react";
import { StatelessComponent } from "react";
import styled from "styled-components";
import { ProgressBar } from "../../ProgressBar/ProgressBar";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { colorsPalettes } from "@similarweb/styles";

const Value = styled.span`
    margin-right: 8px;
    flex: 0 0 auto;
    width: 40px;
`;
Value.displayName = "Value";

const ValueRight = styled.span`
    display: flex;
    justify-content: flex-end;
    width: 40px;
    flex: 0 0 auto;
    margin-left: 8px;
`;
ValueRight.displayName = "ValueRight";

const ProgressBarContainer = styled.div`
    display: flex;
    flex-grow: 0;
    flex-basis: 300px;
    .sw-progress-bar {
        align-self: center;
    }
`;
ProgressBarContainer.displayName = "ProgressBarContainer";

export const PercentageBarCellRounded: StatelessComponent<ITableCellProps> = ({
    value,
    GAVerifiedIcon,
    hideZeroValue = false,
}) => {
    const width = value && value[0] ? value[0] * 100 : 0;
    const hasValues = value?.length && ((value[0] || 0) > 0 || (value[1] || 0) > 0);

    const noDataText = "N/A";

    if (hasValues) {
        const leftValue = percentageFilter()(value[0], 1);
        const rightValue = percentageFilter()(value[1], 1);
        return (
            <ProgressBarContainer>
                <Value>{leftValue}%</Value>
                <ProgressBar width={width} isCompare={true} />
                <ValueRight>{rightValue}%</ValueRight>
                {GAVerifiedIcon}
            </ProgressBarContainer>
        );
    } else {
        return (
            <ProgressBarContainer>
                <Value>{noDataText}</Value>
                <ProgressBar width={0} innerColor={colorsPalettes.carbon[50]} isCompare={false} />
                <ValueRight>{noDataText}</ValueRight>
            </ProgressBarContainer>
        );
    }
};
PercentageBarCellRounded.displayName = "PercentageBarCellRounded";
