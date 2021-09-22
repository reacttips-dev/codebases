import * as React from "react";
import { StatelessComponent } from "react";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { swNumberFilter } from "filters/ngFilters";
import { RightAlignCell } from "components/React/Table/cells/WaKeywordPosition";

export const NumberCommaCell: StatelessComponent<ITableCellProps> = ({ value, GAVerifiedIcon }) => {
    return (
        <div className="number-comma-cell">
            <RightAlignCell className="number-comma-cell">
                <span className="value">{swNumberFilter()(value || 0)}</span>
                {GAVerifiedIcon}
            </RightAlignCell>
        </div>
    );
};
NumberCommaCell.displayName = "NumberCommaCell";
