import { abbrNumberFilter, minVisitsFilter, percentageFilter } from "filters/ngFilters";
import * as React from "react";
import { StatelessComponent } from "react";
import { ITableCellProps } from "../interfaces/ITableCellProps";

export const TrafficShareDashboard: StatelessComponent<ITableCellProps> = ({
    value,
    row,
    progressBarTooltip,
}) => {
    const width = value ? value * 100 : 0,
        visits = row[progressBarTooltip]
            ? row[progressBarTooltip] < 5000
                ? minVisitsFilter()(row[progressBarTooltip])
                : abbrNumberFilter()(row[progressBarTooltip])
            : false,
        valuePercents = percentageFilter()(value || 0, 2) + "%";

    return <div>{valuePercents}</div>;
};
TrafficShareDashboard.displayName = "TrafficShareDashboard";
