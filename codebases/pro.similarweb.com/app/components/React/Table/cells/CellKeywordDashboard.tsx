import * as React from "react";
import { StatelessComponent } from "react";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { trackEvent } from "../SWReactTableUtils";
import { UpgradeLink } from "./UpgradeLink";

export const CellKeywordDashboard: StatelessComponent<ITableCellProps> = ({
    value,
    row,
    tableMetadata,
    tableOptions,
}) => {
    const children = row.Children || [];
    return value !== "grid.upgrade" ? (
        <div className="swTable-keywordCell u-relative u-full-width">
            <span>
                <a
                    href={row.url}
                    className="swTable-content"
                    target="_self"
                    onClick={() => {
                        trackEvent(tableOptions, "Internal Link", value, "click");
                    }}
                >
                    {value}
                </a>
            </span>
            {children.length ? (
                <span className="u-vAlignMiddle">({row.Children.length})</span>
            ) : null}
            <a
                className="magnifySearch sw-btn-search-press"
                href={`https://google.com/search?q=${value}`}
                target="_blank"
                onClick={() => {
                    trackEvent(tableOptions, "External Link", value, "click");
                }}
            />
            {/*<a className="btn-search-ads" href={this.$filter("adsFilter")(value)} target="_self">Ads</a>*/}
        </div>
    ) : (
        <UpgradeLink />
    );
};
CellKeywordDashboard.displayName = "CellKeywordDashboard";
