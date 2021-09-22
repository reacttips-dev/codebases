import * as classNames from "classnames";
import * as React from "react";
import { StatelessComponent } from "react";
import { changeFilter } from "../../../../filters/ngFilters";
import { ITableCellProps } from "../interfaces/ITableCellProps";

export const ChangePercentageDashboard: StatelessComponent<ITableCellProps> = ({ value }) => {
    const classes = classNames("changePercentageDashboard", {
        negative: value < 0,
        positive: value > 0,
    });
    const iconClasses = classNames("changePercentage-icon", {
        "sw-icon-arrow-up5": value > 0,
        "sw-icon-arrow-down5": value < 0,
    });
    return (
        <div className={classes}>
            <i className={iconClasses} /> {changeFilter()(Math.abs(value), undefined)}
        </div>
    );
};
ChangePercentageDashboard.displayName = "ChangePercentageDashboard";
