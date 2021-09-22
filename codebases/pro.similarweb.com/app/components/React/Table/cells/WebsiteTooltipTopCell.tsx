import * as _ from "lodash";
import * as React from "react";
import * as classNames from "classnames";

import { CSSProperties, StatelessComponent } from "react";
import { WebsiteTooltip } from "../../Tooltip/WebsiteTooltip/WebsiteTooltip";
import { toggleSidebar } from "../SWReactTableUtils";
import { i18nFilter } from "filters/ngFilters";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { trackEvent } from "../SWReactTableUtils";
import { UpgradeLink } from "./UpgradeLink";

interface IWebsiteTooltipTopCellProps extends ITableCellProps {
    hideTrackButton?: boolean;
    secondaryIcon?: string;
    secondaryUrl?: string;
    secondaryValue?: string;
}

export const WebsiteTooltipTopCell: StatelessComponent<IWebsiteTooltipTopCellProps> = ({
    row,
    value,
    toggleChildRows,
    showMoreChildRows,
    visibleParents,
    tableMetadata,
    metadata,
    tableOptions,
    hideTrackButton,
    secondaryIcon,
    secondaryUrl,
    secondaryValue,
}) => {
    const children = row.Children || row.children || [],
        isChild = row.parent,
        isExpanded =
            visibleParents && visibleParents[row.index] && visibleParents[row.index].expanded,
        showMore = isChild && row.isLast && row.index + 1 !== row.parent.childsCount,
        showCompanySidebar = tableOptions && tableOptions.showCompanySidebar,
        showMoreStyle: CSSProperties = showMore ? { position: "relative", top: "-6px" } : {},
        classes = classNames(
            "swTable-rowToggle",
            isExpanded ? "sw-icon-collapse" : "sw-icon-expand",
        );

    let wrapperClass = (tableMetadata || metadata)["hasChilds"] ? "domain-cell" : "cell-padding";
    wrapperClass += !showCompanySidebar ? " escape-max-width" : "";

    if (value !== "grid.upgrade") {
        if (secondaryIcon && secondaryUrl && secondaryValue) {
            return (
                <div className={wrapperClass} style={showMoreStyle}>
                    <img
                        src={secondaryIcon}
                        className="favicon swTable-websiteTooltipCell-favicon"
                    />
                    <WebsiteTooltip domain={secondaryValue} hideTrackButton={hideTrackButton}>
                        <div
                            className={"swTable-content-large text"}
                            onClick={() => {
                                trackEvent(
                                    tableOptions || metadata,
                                    "Internal Link",
                                    secondaryValue,
                                    "click",
                                );
                            }}
                        >
                            <a
                                href={secondaryUrl}
                                target="_self"
                                onClick={row.onNavigate || _.noop}
                                className="cell-clickable"
                            >
                                {secondaryValue}
                            </a>
                        </div>
                    </WebsiteTooltip>
                    <a
                        className="swTable-linkOut sw-icon-bounce-rate"
                        href={`http://${value}`}
                        onClick={() => {
                            trackEvent(tableOptions, "External Link", secondaryValue, "click");
                        }}
                        target="_blank"
                    />
                </div>
            );
        } else {
            return (
                <div className={wrapperClass} style={showMoreStyle}>
                    {children.length ? (
                        <i className={classes} onClick={() => toggleChildRows(row, value)} />
                    ) : null}
                    <img
                        src={row.Icon || row.Favicon || row.favicon}
                        className="favicon swTable-websiteTooltipCell-favicon"
                    />
                    <WebsiteTooltip domain={value} hideTrackButton={hideTrackButton}>
                        <div
                            className={
                                children.length
                                    ? "swTable-content-small text"
                                    : "swTable-content-large text"
                            }
                            onClick={() => {
                                trackEvent(
                                    tableOptions || metadata,
                                    "Internal Link",
                                    value,
                                    "click",
                                );
                            }}
                        >
                            {row.url ? (
                                <a
                                    href={row.url}
                                    target="_self"
                                    onClick={row.onNavigate || _.noop}
                                    className="cell-clickable"
                                >
                                    {value}
                                </a>
                            ) : (
                                <span>{value}</span>
                            )}
                        </div>
                    </WebsiteTooltip>
                    {children.length ? (
                        <span className="u-vAlignMiddle">({children.length})</span>
                    ) : null}
                    <a
                        className="swTable-linkOut sw-icon-bounce-rate"
                        href={`http://${value}`}
                        onClick={() => {
                            trackEvent(tableOptions, "External Link", value, "click");
                        }}
                        target="_blank"
                    />
                    {showCompanySidebar ? (
                        <a
                            className="icon discover-row-btn-relative"
                            title={`Discover ${value}`}
                            onClick={(e) => toggleSidebar(value)}
                        >
                            <i className="btn-icon sw-icon-business-info" />
                        </a>
                    ) : null}
                    {showMore ? (
                        <button
                            className="swTable-showMore showMore-reset showMore-translate"
                            onClick={(e) => showMoreChildRows(row, value)}
                        >
                            {i18nFilter()("grid.showmore")}
                        </button>
                    ) : null}
                </div>
            );
        }
    } else {
        return <UpgradeLink hookType="website" />;
    }
};
WebsiteTooltipTopCell.displayName = "WebsiteTooltipTopCell";
