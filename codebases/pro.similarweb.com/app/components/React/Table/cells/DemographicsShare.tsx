import { abbrNumberFilter, minVisitsFilter, percentageFilter } from "filters/ngFilters";
import * as React from "react";
import { StatelessComponent } from "react";
import { ProgressBar } from "../../ProgressBar/ProgressBar";
import { PlainTooltip } from "../../Tooltip/PlainTooltip/PlainTooltip";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { ProgressBarContainer } from "./ProgressBarContainer";

export const DemographicsShare: StatelessComponent<ITableCellProps> = ({
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
        valuePercents = value ? percentageFilter()(value || 0, 2) + "%" : "N/A";

    return (
        <ProgressBarContainer
            progressBarWidth={width}
            visits={visits}
            valuePercents={valuePercents}
        />
    );
};
DemographicsShare.displayName = "DemographicsShare";
