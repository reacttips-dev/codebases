import React from "react";
import { categoryIconFilter, parentCategoryFilter, subCategoryFilter } from "filters/ngFilters";
import { ITableCellProps } from "../interfaces/ITableCellProps";

interface IReferringCategoryCell extends ITableCellProps {
    getLink?: (value: string) => string;
}

export const ReferringCategorySimpleCell: React.FC<IReferringCategoryCell> = ({ value }) => {
    return (
        <div className="swTable-categoryCell">
            <i
                className={`sprite-category u-right-padding-6 ${categoryIconFilter()(
                    parentCategoryFilter()(value),
                )}`}
            />
            <span>{subCategoryFilter()(value)}</span>
        </div>
    );
};
ReferringCategorySimpleCell.displayName = "ReferringCategorySimpleCell";
