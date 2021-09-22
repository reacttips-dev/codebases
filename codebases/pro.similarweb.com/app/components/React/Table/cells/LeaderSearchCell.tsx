import * as classNames from "classnames";
import { percentageSignFilter, tinyFractionApproximationFilter } from "filters/ngFilters";
import * as React from "react";
import { StatelessComponent } from "react";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { WinnerIcon } from "./LeaderDefaultCell";

export const LeaderSearchCell: StatelessComponent<ITableCellProps> = ({ value }) => {
    const realValue = value["Value"],
        isLeader = value["IsLeader"],
        classes = classNames(
            "u-flex-row value",
            isLeader ? "value--leader" : "no-leader-icon-offset",
        );

    return (
        <div className="leader-cell">
            {realValue === 0 ? (
                <span className={classes}>N/A</span>
            ) : (
                <span className={classes}>
                    {isLeader ? <WinnerIcon iconName="winner" /> : null}
                    {tinyFractionApproximationFilter()(percentageSignFilter()(realValue, 2), 0.01)}
                </span>
            )}
        </div>
    );
};
LeaderSearchCell.displayName = "LeaderSearchCell";
