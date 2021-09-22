import { timeFilter } from "filters/ngFilters";
import * as React from "react";
import { StatelessComponent } from "react";
import { ITableCellProps } from "../interfaces/ITableCellProps";

export const TimeCell: StatelessComponent<ITableCellProps> = ({ value }) => {
    return (
        <div className="TimeCell">
            <span className="value">{timeFilter()(value, null)}</span>
        </div>
    );
};
TimeCell.displayName = "TimeCell";
