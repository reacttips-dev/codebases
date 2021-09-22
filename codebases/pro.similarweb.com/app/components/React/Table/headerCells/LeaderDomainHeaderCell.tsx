import { numberFilter, i18nFilter } from "filters/ngFilters";
import * as React from "react";
import { StatelessComponent } from "react";
import { ITableHeaderCellProps } from "../interfaces/ITableCellProps";
import { SortComponent } from "./DefaultCellHeader";
import * as _ from "lodash";

const getFavIconForSure = (tableData, displayName): string => {
    return _.result(
        _.find(tableData, (item) => {
            const favIcon = item[displayName] && item[displayName].Favicon;
            return favIcon && favIcon.length > 0;
        }),
        `[${displayName}].Favicon`,
    );
};

export const LeaderDomainHeaderCell: StatelessComponent<ITableHeaderCellProps> = (props) => {
    const {
        sortDirection,
        tableData,
        displayName,
        sortable,
        showTotalCount,
        tableMetadata,
        onSort,
    } = props;
    const i18nDisplayName = i18nFilter()(displayName);
    return (
        <div
            className="headerCell headerCell-leader"
            onClick={(e) => {
                onSort(props);
            }}
        >
            <img src={getFavIconForSure(tableData, displayName)} alt={displayName} />
            <span className="headerCell-text" title={i18nDisplayName}>
                {i18nDisplayName}
            </span>
            {sortable && <SortComponent sortDirection={sortDirection} />}
            {showTotalCount ? (
                <div className="headerCell-totalCount">
                    {numberFilter()(tableMetadata.totalCount)}
                </div>
            ) : null}
        </div>
    );
};
LeaderDomainHeaderCell.displayName = "LeaderDomainHeaderCell";
