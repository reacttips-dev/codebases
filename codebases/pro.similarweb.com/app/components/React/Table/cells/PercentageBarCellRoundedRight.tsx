import { TrafficShareTooltip } from "components/tooltips/src/TrafficShareTooltip/TrafficShareTooltip";
import { i18nFilter, percentageFilter } from "filters/ngFilters";
import * as React from "react";
import { StatelessComponent } from "react";
import styled from "styled-components";
import { ProgressBar } from "../../ProgressBar/ProgressBar";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { colorsPalettes } from "@similarweb/styles";

const ValueRight = styled.span`
    display: flex;
    justify-content: flex-end;
    width: 40px;
    flex: 0 0 auto;
    margin-left: 8px;
`;
ValueRight.displayName = "ValueRight";

const Value = styled.span`
    margin-right: 8px;
    flex: 0 0 auto;
    width: 40px;
`;
Value.displayName = "Value";

const ProgressBarContainer = styled.div.attrs({
    className: "swTable-progressBar",
})`
    .sw-progress-bar {
        border-radius: 1px;
    }
`;
ProgressBarContainer.displayName = "ProgressBarContainer";

interface IPercentageBarCellRoundedRightProps extends ITableCellProps {
    percentageFilterFraction?: number;
    showTooltip?: boolean;
    tooltipBottomLabel?: string;
    tooltipTopLabel?: string;
}

export const tooltipData = (value, topLabelKey, bottomLabelKey, percentageFilterFraction) => {
    const getText = (value) => percentageFilter()(value, percentageFilterFraction) + "%";
    return [
        {
            color: colorsPalettes.carbon[0],
            backgroundColor: colorsPalettes.blue[500],
            width: 0.22,
            text: getText(value),
            name: i18nFilter()(topLabelKey),
        },
        {
            color: colorsPalettes.carbon[0],
            backgroundColor: colorsPalettes.sky[300],
            width: 0.22,
            text: getText(1 - value),
            name: i18nFilter()(bottomLabelKey),
        },
    ];
};

export const PercentageBarCellRoundedRight: StatelessComponent<IPercentageBarCellRoundedRightProps> = ({
    value,
    GAVerifiedIcon,
    percentageFilterFraction,
    showTooltip,
    tooltipTopLabel,
    tooltipBottomLabel,
}) => {
    const width = value && value[0] ? value[0] * 100 : 0;
    return value ? (
        <TrafficShareTooltip
            trafficShareProps={tooltipData(
                value[0],
                tooltipTopLabel,
                tooltipBottomLabel,
                percentageFilterFraction,
            )}
            title={String()}
            enabled={showTooltip}
        >
            <div style={{ display: "flex", width: "100%" }}>
                <Value>{percentageFilter()(value[0], percentageFilterFraction)}%</Value>
                <ProgressBarContainer>
                    <ProgressBar width={width} className="u-full-width" isCompare={true} />
                </ProgressBarContainer>
                <ValueRight>{percentageFilter()(value[1], percentageFilterFraction)}%</ValueRight>
                {GAVerifiedIcon}
            </div>
        </TrafficShareTooltip>
    ) : (
        <div style={{ color: colorsPalettes.carbon[500] }}>N/A</div>
    );
};

PercentageBarCellRoundedRight.defaultProps = {
    percentageFilterFraction: 1,
    showTooltip: false,
};

PercentageBarCellRoundedRight.displayName = "PercentageBarCellRoundedRight";
