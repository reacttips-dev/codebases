import * as React from "react";
import { StatelessComponent } from "react";
import { ITableCellProps } from "../interfaces/ITableCellProps";

export const LinkImpersonate: StatelessComponent<ITableCellProps> = ({
    row,
    value,
    onItemClick,
}) => {
    return (
        <div className="cell-innerText u-truncate">
            <div className="u-link" onClick={() => onItemClick(row, row.Id, value)}>
                <span title={value}>{value}</span>
            </div>
        </div>
    );
};
LinkImpersonate.displayName = "LinkImpersonate";
