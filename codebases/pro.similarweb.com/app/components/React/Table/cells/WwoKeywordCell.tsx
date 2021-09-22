import * as React from "react";
import { StatelessComponent } from "react";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { keywordAnalysisHrefFilter, searchAdsFilterFilter } from "filters/ngFilters";
import { Injector } from "common/ioc/Injector";
import { trackEvent } from "../SWReactTableUtils";

export const WwoKeywordCell: StatelessComponent<ITableCellProps> = ({
    value,
    tableOptions,
    row,
}) => {
    const swNavigator = Injector.get("swNavigator");

    const renderLink = () => {
        if (tableOptions.renderTextInsteadOfLinks) {
            return (
                <div className="swTable-content-large">
                    <div className="u-truncate">{value}</div>
                </div>
            );
        }

        return (
            <a
                href={swNavigator.href("keywordAnalysis-overview", {
                    ...swNavigator.getParams(),
                    keyword: value,
                })}
                className="swTable-content-large"
            >
                <div
                    className="u-truncate"
                    onClick={() => {
                        trackEvent(tableOptions, "Internal Link", `Table/${value}`, "click");
                    }}
                >
                    {value}
                </div>
            </a>
        );
    };

    return (
        <div className="wwo-keyword-cell">
            {renderLink()}
            <a
                href={`https://google.com/search?q=${value}`}
                className="magnifySearch sw-btn-search-press"
                target="_blank"
            />
            <a
                className="btn-search-ads"
                href={searchAdsFilterFilter(swNavigator, row.linkState)(value)}
                target="_self"
            >
                Ads
            </a>
        </div>
    );
};
WwoKeywordCell.displayName = "WwoKeywordCell";
