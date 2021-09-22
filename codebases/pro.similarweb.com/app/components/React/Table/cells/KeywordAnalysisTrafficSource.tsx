import * as classNames from "classnames";
import { Injector } from "common/ioc/Injector";
import { UpgradeLink } from "components/React/Table/cells/UpgradeLink";
import { i18nFilter, TrafficSourcesSearchHrefFilter } from "filters/ngFilters";
import * as _ from "lodash";
import * as React from "react";
import { CSSProperties, StatelessComponent } from "react";
import { WebsiteTooltip } from "../../Tooltip/WebsiteTooltip/WebsiteTooltip";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { trackEvent } from "../SWReactTableUtils";

export const KeywordAnalysisTrafficSource: StatelessComponent<ITableCellProps> = ({
    value,
    row,
    toggleChildRows,
    showMoreChildRows,
    visibleParents,
    tableOptions,
    webSource,
}) => {
    const children = row.Children || [];
    const isChild = row.parent;
    const isExpanded = _.result(visibleParents, `${row.index}.expanded`);
    const showMore = isChild && row.isLast && row.index + 1 !== row.parent.childsCount;
    const showMoreStyle: CSSProperties = showMore ? { position: "relative", top: "-6px" } : {};
    const classes = classNames(
        "swTable-rowToggle",
        isExpanded ? "sw-icon-collapse" : "sw-icon-expand",
    );
    const swNavigator = Injector.get("swNavigator");
    const i18n = i18nFilter();

    return (
        <div className="domain-cell">
            {children.length ? (
                <i className={classes} onClick={() => toggleChildRows(row, value)} />
            ) : null}
            <div className="swTable-keywordCell" style={showMoreStyle}>
                <img alt="" src={row.Icon || row.Favicon} className="favicon" />
                {value !== "grid.upgrade" ? (
                    <WebsiteTooltip domain={value}>
                        <a
                            href={
                                row.href ??
                                TrafficSourcesSearchHrefFilter(swNavigator)(value, webSource)
                            }
                            className="text"
                        >
                            <span
                                className="swTable-content"
                                onClick={() =>
                                    trackEvent(tableOptions, "Internal Link", value, "click")
                                }
                            >
                                {value}
                            </span>
                        </a>
                    </WebsiteTooltip>
                ) : (
                    <UpgradeLink hookType="website" />
                )}
                {children.length ? (
                    <span className="u-vAlignMiddle">({children.length})</span>
                ) : null}
                <a
                    className="swTable-linkOut sw-link-out"
                    href={`http://${value}`}
                    onClick={() => trackEvent(tableOptions, "External Link", value, "click")}
                    target="_blank"
                />
            </div>
            {showMore ? (
                <button
                    className="swTable-showMore showMore-margin"
                    onClick={() => showMoreChildRows(row, value)}
                >
                    {i18n("grid.showmore")}
                </button>
            ) : null}
        </div>
    );
};

KeywordAnalysisTrafficSource.displayName = "KeywordAnalysisTrafficSource";
