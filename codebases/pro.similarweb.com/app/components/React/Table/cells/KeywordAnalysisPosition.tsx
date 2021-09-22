import * as React from "react";
import { StatelessComponent } from "react";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { noDataFilter, numberFilter } from "filters/ngFilters";
import { RightAlignCell } from "./WaKeywordPosition";

export const KeywordAnalysisPosition: StatelessComponent<ITableCellProps> = ({ value }) => {
    if (value === "NaN") {
        return null;
    }
    return (
        <RightAlignCell className="cell-innerText">
            {value === -1 || value === null
                ? "-"
                : noDataFilter()(numberFilter()(value, 0), "^$", "-")}
        </RightAlignCell>
    );
};
KeywordAnalysisPosition.displayName = "KeywordAnalysisPosition";
