import * as React from "react";
import { StatelessComponent } from "react";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { Injector } from "common/ioc/Injector";
import { keywordAnalysisHrefFilter, adsFilterFilter } from "filters/ngFilters";
import { trackEvent } from "../SWReactTableUtils";
import { UpgradeLink } from "./UpgradeLink";

export const CellKeywordContent: StatelessComponent<ITableCellProps> = ({
    value,
    row,
    tableOptions,
    tableMetadata,
    showAdsButton,
}) => {
    const children = row.Children || [];
    const swNavigator = Injector.get("swNavigator");
    return value === "grid.upgrade" ? (
        <UpgradeLink />
    ) : (
        <div className="swTable-keywordCell u-relative u-full-width">
            <span>
                <a
                    href={keywordAnalysisHrefFilter(swNavigator)(value, null)}
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
            {showAdsButton ? (
                <a
                    className="btn-search-ads"
                    href={adsFilterFilter(swNavigator)(value)}
                    target="_self"
                >
                    Ads
                </a>
            ) : null}
        </div>
    );
};
CellKeywordContent.displayName = "CellKeywordContent";
