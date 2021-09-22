import * as React from "react";
import * as classNames from "classnames";
import { StatelessComponent } from "react";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { i18nFilter } from "filters/ngFilters";
import { trackEvent } from "../SWReactTableUtils";
import { UpgradeLink } from "./UpgradeLink";

export const GroupedCellSite: StatelessComponent<ITableCellProps> = ({
    value,
    row,
    tableMetadata,
    showMoreChildRows,
    toggleChildRows,
    visibleParents,
    tableOptions,
}) => {
    const children = row.Children || [],
        isChild = row.parent,
        isExpanded = visibleParents[row.index] && visibleParents[row.index].expanded,
        showMore = isChild && row.isLast && row.index + 1 !== row.parent.childsCount,
        classes = classNames(
            "swTable-rowToggle",
            isExpanded ? "sw-icon-collapse" : "sw-icon-expand",
        );

    return value === "grid.upgrade" ? (
        <UpgradeLink />
    ) : (
        <div className="cell-content show-more-container" style={{ left: 9 }}>
            {children.length ? (
                <i className={classes} onClick={(e) => toggleChildRows(row, value)} />
            ) : null}

            <span className="swTable-content text-select" title={value}>
                {value}
            </span>
            {children.length ? (
                <span className="u-vAlignMiddle u-right-padding-6">({children.length})</span>
            ) : null}
            <a
                className="swTable-linkOut sw-icon-bounce-rate"
                href={`http://${value}`}
                onClick={() => {
                    trackEvent(tableOptions, "External Link", value, "click");
                }}
                target="_blank"
            />

            {showMore ? (
                <button
                    className="swTable-showMore showMore-margin"
                    style={{ paddingLeft: 2 }}
                    onClick={(e) => showMoreChildRows(row, value)}
                >
                    {i18nFilter()("grid.showmore")}
                </button>
            ) : null}
        </div>
    );
};
GroupedCellSite.displayName = "GroupedCellSite";
