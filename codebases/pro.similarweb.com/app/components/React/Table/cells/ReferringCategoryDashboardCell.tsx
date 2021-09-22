import * as React from "react";
import { StatelessComponent } from "react";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import {
    i18nCategoryFilter,
    subCategoryFilter,
    categoryIconFilter,
    parentCategoryFilter,
} from "filters/ngFilters";
import { trackEvent } from "../SWReactTableUtils";

export const ReferringCategoryDashboardCell: StatelessComponent<ITableCellProps> = ({
    value,
    tableOptions,
}) => {
    return (
        <div className="swTable-categoryCell">
            <i
                className={`sprite-category u-right-padding-6 ${categoryIconFilter()(
                    parentCategoryFilter()(value),
                )}`}
            />
            <span
                title={i18nCategoryFilter()(value)}
                onClick={() => {
                    trackEvent(tableOptions, "Internal Link", value, "click");
                }}
            >
                {subCategoryFilter()(value)}
            </span>
        </div>
    );
};
ReferringCategoryDashboardCell.displayName = "ReferringCategoryDashboardCell";
