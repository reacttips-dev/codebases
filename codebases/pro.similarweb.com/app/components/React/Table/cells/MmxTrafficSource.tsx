import * as React from "react";
import * as classNames from "classnames";

import { StatelessComponent } from "react";
import { WebsiteTooltip } from "../../Tooltip/WebsiteTooltip/WebsiteTooltip";
import { toggleSidebar } from "../SWReactTableUtils";
import { i18nFilter } from "filters/ngFilters";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { trackEvent } from "../SWReactTableUtils";
import { UpgradeLink } from "./UpgradeLink";

export const MmxTrafficSource: StatelessComponent<ITableCellProps> = ({
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
                <i className={classes} onClick={(e) => toggleChildRows(row, value)}></i>
            ) : null}
            {row.SourceType === "Referral" || row.SourceType === "Display Ad" ? (
                <span>
                    <img src={row.Icon || row.Favicon} className="favicon" />
                    <WebsiteTooltip domain={value}>
                        <a href={row.url} style={{ paddingLeft: "2px" }}>
                            <div
                                className="swTable-content"
                                onClick={(e) =>
                                    trackEvent(tableOptions, "Internal Link", value, "click")
                                }
                            >
                                {value}
                            </div>
                        </a>
                    </WebsiteTooltip>
                    <a
                        className="swTable-linkOut sw-link-out"
                        href={`http://${value}`}
                        target="_blank"
                        onClick={(e) => trackEvent(tableOptions, "External Link", value, "click")}
                    ></a>
                    {tableOptions.showCompanySidebar ? (
                        <a
                            className="icon discover-row-btn-relative"
                            title={`Discover ${value}`}
                            onClick={(e) => toggleSidebar(value)}
                        >
                            <i className="btn-icon sw-icon-business-info" />
                        </a>
                    ) : null}
                </span>
            ) : (
                <span>
                    <img
                        src={row.Icon || row.Favicon}
                        className="favicon"
                        style={{ marginRight: "4px" }}
                    />
                    {value}
                </span>
            )}
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
MmxTrafficSource.displayName = "MmxTrafficSource";
