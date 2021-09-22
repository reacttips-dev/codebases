import * as React from "react";

import { StatelessComponent } from "react";
import { i18nFilter } from "filters/ngFilters";
import { ITableCellProps } from "../interfaces/ITableCellProps";

export const AdsenseCell: StatelessComponent<ITableCellProps> = ({ value, tooltip }) => {
    return value ? (
        <div className="u-alignCenter">
            <i
                className="sw-icon-checkmark_circle"
                title={i18nFilter()(
                    tooltip || "analysis.all.table.columns.googleAds.value.tooltip",
                )}
            ></i>
        </div>
    ) : null;
};
AdsenseCell.displayName = "AdsenseCell";
