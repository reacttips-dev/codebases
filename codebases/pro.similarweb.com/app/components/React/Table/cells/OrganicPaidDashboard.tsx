import * as React from "react";
import { ProgressBar } from "../../ProgressBar/ProgressBar";
import { StatelessComponent } from "react";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { percentageFilter } from "filters/ngFilters";

export const OrganicPaidDashboard: StatelessComponent<ITableCellProps> = ({ row }) => {
    function getRatio(a, b) {
        if (a > b) return b / a;
        else return a / b;
    }
    const value = row.Organic === 0 || row.Paid === 0 ? 1 : getRatio(row.Organic, row.Paid);
    const width = value ? value * 100 : 0;
    return (
        <div className="swTable-progressBar">
            <span className="min-value" style={{ width: 38 }}>
                {percentageFilter()(value, 2)}%
            </span>
            <ProgressBar width={width} className="u-full-width" isCompare={true} />
            <span className="min-value">{percentageFilter()(1 - value, 2)}%</span>
        </div>
    );
};
OrganicPaidDashboard.displayName = "OrganicPaidDashboard";
