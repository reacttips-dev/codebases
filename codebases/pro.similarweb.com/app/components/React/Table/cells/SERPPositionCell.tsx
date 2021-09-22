import React, { FC } from "react";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { noDataFilter, numberFilter } from "filters/ngFilters";
import { RightAlignCell } from "./WaKeywordPosition";

export const SERPPositionCell: FC<ITableCellProps> = ({ row: { currentPosition } }) => {
    if (currentPosition === "NaN") {
        return null;
    }
    return (
        <RightAlignCell className="cell-innerText">
            {currentPosition === -1 || currentPosition === null
                ? "-"
                : noDataFilter()(numberFilter()(currentPosition, 0), "^$", "-")}
        </RightAlignCell>
    );
};
SERPPositionCell.displayName = "SERPPositionCell";
