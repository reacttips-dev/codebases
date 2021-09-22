import * as React from "react";
import { StatelessComponent } from "react";
import { ITableCellProps } from "../interfaces/ITableCellProps";

export const SiteColorAndField: StatelessComponent<ITableCellProps> = ({ value }) => {
    return (
        <span className="marker-text-container">
            <span
                className="legend-item-circle"
                style={{ backgroundColor: value.Key || value }}
            ></span>
            <span className="item-text">{value.Value || value}</span>
        </span>
    );
};
SiteColorAndField.displayName = "SiteColorAndField";
