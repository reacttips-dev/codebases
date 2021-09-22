import * as React from "react";
import { StatelessComponent } from "react";
import { ITableHeaderCellProps } from "../interfaces/ITableCellProps";
import { appTitleFilter, appIconFilter } from "filters/ngFilters";
import { Injector } from "common/ioc/Injector";
import { chosenItems } from "common/services/chosenItems";

export const SiteNameImage: StatelessComponent<ITableHeaderCellProps> = (props) => {
    const { field, onSort } = props;
    return (
        <span
            className="site-item-container"
            onClick={(e) => {
                onSort(props);
            }}
        >
            <span className="icon-legend-container">
                <img className="item-icon" src={appIconFilter(chosenItems)(field)} />
            </span>
            <span className="item-text">{appTitleFilter(chosenItems)(field)}</span>
        </span>
    );
};
SiteNameImage.displayName = "SiteNameImage";
