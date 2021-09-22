import { percentageFilter } from "filters/ngFilters";
import * as React from "react";
import { StatelessComponent } from "react";
import styled from "styled-components";
import { ITableCellProps } from "../interfaces/ITableCellProps";

export const PercentageCell: StatelessComponent<ITableCellProps> = (props) => {
    const { value, className } = props;
    const valuePercents = percentageFilter()(value || 0, 2) + "%";
    return (
        <div className={className}>
            <span className="min-value">{valuePercents}</span>
        </div>
    );
};
PercentageCell.displayName = "PercentageCell";

export const PercentageCellRightAlign = styled(PercentageCell)`
    text-align: right;
`;
