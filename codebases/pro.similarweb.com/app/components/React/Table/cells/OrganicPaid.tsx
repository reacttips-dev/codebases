import { colorsPalettes } from "@similarweb/styles";
import { TrafficShareTooltip } from "components/tooltips/src/TrafficShareTooltip/TrafficShareTooltip";
import { percentageFilter, percentageSignFilter } from "filters/ngFilters";
import { i18nFilter } from "filters/ngFilters";
import React from "react";
import styled from "styled-components";
import { ProgressBar } from "../../ProgressBar/ProgressBar";
import { ITableCellProps } from "../interfaces/ITableCellProps";

const resolveFilledBarPercent = (row: { Organic: number; Paid: number }, value?: number) => {
    if (row.Organic === 0 && row.Paid === 0) {
        return 100;
    }

    return value ? value * 100 : 0;
};

export const formatPercentageString = (value: number) => {
    return `${percentageFilter()(value, 2)}%`;
};

/**
 * Wraps the entire OrganicPaid component
 * overrides the progressBar style to remove round
 * borders, and attaches css class swTable-progressBar
 */
const OrganicPaidWrapper = styled.div.attrs({
    className: "swTable-progressBar",
})`
    .sw-progress-bar {
        border-radius: 1px;
    }
`;

const OrganicPaidWrapperWithPercentage = styled.div.attrs({
    className: "swTable-progressBar",
})`
    .sw-progress-bar {
        width: 65px;
        border-radius: 1px;
    }
`;
const RightPercentage = styled.div`
    width: 42px;
    padding-right: 8px;
`;

const LeftPercentage = styled.div`
    display: flex;
    justify-content: flex-end;
    width: 55px;
    padding-left: 8px;
`;
export const tooltipData = (value) => [
    {
        color: colorsPalettes.carbon[0],
        backgroundColor: colorsPalettes.blue[500],
        width: 0.22,
        text: formatPercentageString(value),
        name: i18nFilter()("share.tooltip.organic"),
    },
    {
        color: colorsPalettes.carbon[0],
        backgroundColor: colorsPalettes.sky[300],
        width: 0.22,
        text: formatPercentageString(1 - value),
        name: i18nFilter()("share.tooltip.paid"),
    },
];

export const OrganicPaid = (props: ITableCellProps) => {
    const { row, value } = props;
    const decimal = value > 0.999 ? 0 : 1;
    const organicPercentage = percentageSignFilter()(value, decimal);
    const paidPercentage =
        organicPercentage === "100%"
            ? percentageSignFilter()(0, decimal)
            : percentageSignFilter()(1 - value, decimal);
    return props.showPercentage ? (
        <div style={{ display: "flex" }}>
            <RightPercentage>{organicPercentage}</RightPercentage>
            <OrganicPaidWrapperWithPercentage>
                <ProgressBar
                    width={resolveFilledBarPercent(row, value)}
                    className="u-full-width"
                    isCompare={true}
                    height={8}
                />
            </OrganicPaidWrapperWithPercentage>
            <LeftPercentage>{paidPercentage}</LeftPercentage>
        </div>
    ) : (
        <TrafficShareTooltip trafficShareProps={tooltipData(value)} title={""}>
            <OrganicPaidWrapper>
                <ProgressBar
                    width={resolveFilledBarPercent(row, value)}
                    className="u-full-width"
                    isCompare={true}
                    height={8}
                />
            </OrganicPaidWrapper>
        </TrafficShareTooltip>
    );
};
OrganicPaid.displayName = "OrganicPaid";
