import * as React from "react";
import { StatelessComponent } from "react";
import { ITableHeaderCellProps } from "../interfaces/ITableCellProps";

export const HeaderCellBlank: StatelessComponent<ITableHeaderCellProps> = ({ displayName }) => {
    return (
        <div className="headerCell-blank">
            <div className="headerCell-wide"></div>
            <div className="u-flex-row u-bold u-alignCenter">
                <span className="headerCell-text">{displayName}</span>
            </div>
        </div>
    );
};
HeaderCellBlank.displayName = "HeaderCellBlank";
