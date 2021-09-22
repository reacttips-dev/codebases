import * as React from "react";
import * as classNames from "classnames";

import { StatelessComponent } from "react";
import { WebsiteTooltip } from "../../Tooltip/WebsiteTooltip/WebsiteTooltip";
import { toggleSidebar } from "../SWReactTableUtils";
import { i18nFilter } from "filters/ngFilters";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { trackEvent } from "../SWReactTableUtils";
import { UpgradeLink } from "./UpgradeLink";

export const IndustryTrafficSource: StatelessComponent<ITableCellProps> = ({
    value,
    row,
    tableMetadata,
    toggleChildRows,
    showMoreChildRows,
    visibleParents,
    tableOptions,
    groupable,
}) => {
    const children = row.Children || [],
        isChild = row.parent,
        isExpanded = visibleParents
            ? visibleParents[row.index] && visibleParents[row.index].expanded
            : false,
        showMore = isChild && row.isLast && row.index + 1 !== row.parent.childsCount,
        showMoreStyle = showMore ? { position: "relative" as "absolute", top: "-6px" } : {},
        style = Object.assign({}, showMoreStyle, {
            marginLeft: children.length && groupable ? "19px" : "",
        }),
        classes = classNames(
            "swTable-rowToggle",
            isExpanded ? "sw-icon-collapse" : "sw-icon-expand",
        );

    return value === "grid.upgrade" ? (
        <UpgradeLink hookType="website" />
    ) : (
        <div className="cell-content">
            {children.length && groupable ? (
                <i
                    className={classes}
                    onClick={(e) => toggleChildRows(row, value)}
                    style={{ left: "0px" }}
                ></i>
            ) : null}
            {row.SourceType === "Referral" || row.SourceType === "Display Ad" ? (
                <span style={style}>
                    <img src={row.Icon || row.Favicon} className="favicon" />
                    <WebsiteTooltip domain={value}>
                        <a href={row.url} style={{ paddingLeft: "2px" }}>
                            <div
                                className={
                                    children.length
                                        ? "swTable-content-small"
                                        : "swTable-content-large"
                                }
                                onClick={(e) =>
                                    trackEvent(tableOptions, "Internal Link", value, "click")
                                }
                            >
                                {value}
                            </div>
                        </a>
                    </WebsiteTooltip>
                    {children.length ? (
                        <span className="u-vAlignMiddle">({children.length})</span>
                    ) : null}
                    <a
                        className="swTable-linkOut sw-link-out"
                        href={`http://${value}`}
                        onClick={() => {
                            trackEvent(tableOptions, "External Link", value, "click");
                        }}
                        target="_blank"
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
                    onClick={(e) => showMoreChildRows(row, value)}
                >
                    {i18nFilter()("grid.showmore")}
                </button>
            ) : null}
        </div>
    );
};
IndustryTrafficSource.displayName = "IndustryTrafficSource";
