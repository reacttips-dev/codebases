import * as React from "react";
import { StatelessComponent } from "react";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { i18nCategoryFilter, categoryIconFilter, subCategoryFilter } from "filters/ngFilters";

export const CategoryNoLinkCell: StatelessComponent<ITableCellProps> = ({
    value,
    row,
    isIconHidden,
}) => {
    return (
        <div className="swTable-categoryCell" title={i18nCategoryFilter()(value)}>
            {!isIconHidden ? (
                <i className={`sprite-category ${categoryIconFilter()(row.Category)}`}></i>
            ) : null}
            {subCategoryFilter()(value)}
        </div>
    );
};
CategoryNoLinkCell.displayName = "CategoryNoLinkCell";
