import * as React from "react";
import { StatelessComponent } from "react";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { appTitleFilter, appIconFilter, appColorFilter } from "filters/ngFilters";
import { Injector } from "common/ioc/Injector";
import { chosenItems } from "common/services/chosenItems";

export const SiteColorImage: StatelessComponent<ITableCellProps> = ({ value }) => {
    return (
        <span className="site-item-container">
            <span className="icon-legend-container">
                <img className="item-icon" src={appIconFilter(chosenItems)(value)} />
                <span
                    className="legend-item-circle"
                    style={{ backgroundColor: appColorFilter(chosenItems)(value) }}
                ></span>
            </span>
            <span className="item-text">{appTitleFilter(chosenItems)(value)}</span>
        </span>
    );
};
SiteColorImage.displayName = "SiteColorImage";
