import { pureNumberFilterWithZeroCount } from "filters/ngFilters";
import * as React from "react";
import { StatelessComponent } from "react";
import { ITableCellProps } from "../interfaces/ITableCellProps";

export const ChangeAbs: StatelessComponent<ITableCellProps> = ({ value }) => {
    const signClass = value < 0 ? "down2 negative" : value > 0 ? "up2 positive" : "";
    return (
        <div className="text-right changePercentage">
            <span className={`sw-icon-arrow-${signClass}`}>
                {" "}
                {pureNumberFilterWithZeroCount(Math.abs(value), 2)}
            </span>
        </div>
    );
};
