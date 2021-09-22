import * as React from "react";
import { i18nCategoryFilter } from "filters/ngFilters";
import { StatelessComponent } from "react";
import { ITableCellProps } from "../interfaces/ITableCellProps";

export const CategoryFilterCell: StatelessComponent<ITableCellProps & { filter?: Function }> = ({
    value,
    onItemClick,
    filter,
}) => {
    return (
        <a onClick={(e) => onItemClick("category", value)} className="category-filter-cell">
            {filter(value)}
        </a>
    );
};
CategoryFilterCell.displayName = "CategoryFilterCell";
CategoryFilterCell.defaultProps = {
    filter: i18nCategoryFilter(),
};
