import * as React from "react";
import * as classNames from "classnames";
import { CSSProperties, StatelessComponent } from "react";
import { i18nFilter } from "filters/ngFilters";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { trackEvent } from "../SWReactTableUtils";
import { UpgradeLink } from "./UpgradeLink";

export const CellSite: StatelessComponent<ITableCellProps> = ({
    row,
    value,
    toggleChildRows,
    showMoreChildRows,
    visibleParents,
    tableMetadata,
    tableOptions,
}) => {
    const children = row.Children || [],
        isChild = row.parent,
        isExpanded = visibleParents[row.index] && visibleParents[row.index].expanded,
        showMore = isChild && row.isLast && row.index + 1 !== row.parent.childsCount,
        showMoreStyle: CSSProperties = showMore ? { position: "relative", top: "-6px" } : {},
        classes = classNames(
            "swTable-rowToggle",
            isExpanded ? "sw-icon-collapse" : "sw-icon-expand",
        ),
        wrapperClass = tableMetadata.hasChilds ? "domain-cell" : "cell-padding";

    if (value !== "grid.upgrade") {
        return (
            <div className={wrapperClass} style={showMoreStyle}>
                {children.length ? (
                    <i className={classes} onClick={() => toggleChildRows(row, value)} />
                ) : null}
                <div
                    className={
                        children.length
                            ? "swTable-content-small text"
                            : "swTable-content-large text"
                    }
                    title={value}
                >
                    {value}
                </div>
                {children.length ? (
                    <span className="u-vAlignMiddle swTable-children-count">
                        ({children.length})
                    </span>
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
                        className="swTable-showMore showMore-margin showMore-margin--no-icon"
                        onClick={(e) => showMoreChildRows(row, value)}
                    >
                        {i18nFilter()("grid.showmore")}
                    </button>
                ) : null}
            </div>
        );
    } else {
        return <UpgradeLink />;
    }
};
CellSite.displayName = "CellSite";
