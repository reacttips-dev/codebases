import * as React from "react";
import { StatelessComponent } from "react";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { percentageFilter } from "filters/ngFilters";
import {
    ShareBar,
    ShareBarValue,
    IShareBarProps,
    ShareBarChart,
    ShareBarChartBackground,
} from "@similarweb/ui-components/dist/share-bar";
import styled from "styled-components";
import * as _ from "lodash";

export const TrafficShareCellContainer = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
`;
TrafficShareCellContainer.displayName = "TrafficShareCellContainer";

export const Bar = styled.div`
    width: 100%;

    ${ShareBarValue} {
        width: 56px;
    }

    ${ShareBarChart} {
        height: 8px;
    }

    ${ShareBarChartBackground} {
        border-radius: 1px;
    }
`;

//TODO: should add compare support
export const ShareBarCell: StatelessComponent<IShareBarProps & ITableCellProps> = ({
    children = null,
    hideValue = false,
    ...props
}) => {
    const { value } = props;
    const noDataValue = "N/A";
    const percentageValue = percentageFilter()(value || 0, 2, noDataValue);
    const floatValue = parseFloat(percentageValue);
    const formattedValue = _.isNaN(floatValue)
        ? noDataValue === percentageValue
            ? percentageValue
            : percentageValue + "%"
        : floatValue / 100;

    return (
        <TrafficShareCellContainer>
            <Bar>
                <ShareBar value={formattedValue} hideChangeValue={true} hideValue={hideValue} />
            </Bar>
            {children}
        </TrafficShareCellContainer>
    );
};

ShareBarCell.displayName = "ShareBar";
