import * as React from "react";
import { StatelessComponent } from "react";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { appRankChangeFilter } from "filters/ngFilters";

export const Change: StatelessComponent<ITableCellProps> = ({ value }) => {
    const signClass = value < 0 ? "down2 negative" : value > 0 ? "up2 positive" : "";
    return (
        <div className="text-right changePercentage">
            <span className={`sw-icon-arrow-${signClass}`}>
                {" "}
                {appRankChangeFilter()(value, " ")}
            </span>
        </div>
    );
};
Change.displayName = "Change";
