import * as React from "react";
import * as classNames from "classnames";
import { percentageFilter, minVisitsFilter, abbrNumberFilter } from "filters/ngFilters";
import { ProgressBar } from "../../ProgressBar/ProgressBar";
import { StatelessComponent } from "react";
import { ITableCellProps } from "../interfaces/ITableCellProps";

export const BarTrafficShare: StatelessComponent<ITableCellProps> = ({
    value,
    progressBarTooltip,
}) => {
    function onMouseOver(e) {
        $(e.currentTarget)
            .parents(
                ".dashboard-wrap .swWidget-component,.dashboard-wrap .swTable,.dashboard-wrap .swTable-cell",
            )
            .css("overflow", "visible");
    }
    function onMouseOut(e) {
        $(e.currentTarget)
            .parents(
                ".dashboard-wrap .swWidget-component,.dashboard-wrap .swTable,.dashboard-wrap .swTable-cell",
            )
            .css("overflow", "hidden");
    }
    const width = value ? value * 100 : 0;

    return (
        <div
            className={classNames("swTable-progressBar", {
                "scss-tooltip scss-tooltip--ne": progressBarTooltip,
            })}
            onMouseOver={(e) => onMouseOver(e)}
            onMouseOut={(e) => onMouseOut(e)}
            data-scss-tooltip={
                progressBarTooltip < 5000
                    ? minVisitsFilter()(progressBarTooltip)
                    : `${abbrNumberFilter()(progressBarTooltip)} referred visits`
            }
        >
            <ProgressBar width={width} />
            <span className="min-value">{percentageFilter()(value, 2)}%</span>
        </div>
    );
};
BarTrafficShare.displayName = "BarTrafficShare";
