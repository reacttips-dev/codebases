import * as React from "react";
import { StatelessComponent } from "react";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { Injector } from "common/ioc/Injector";
import { UpgradeLink } from "components/React/Table/cells/UpgradeLink";
import { adsFilterFilter, TrafficSourcesSearchHrefFilter } from "filters/ngFilters";
import { trackEvent } from "components/React/Table/SWReactTableUtils";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip";
import { LinkButton } from "components/React/Table/cells/Button";
import { allTrackers } from "services/track/track";
import { LinkIcon } from "pages/workspace/common components/RecommendationsSidebar/StyledComponents";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { keywordService } from "pages/keyword-analysis/keywordService";

export const CellKeywordPhrase: StatelessComponent<ITableCellProps> = ({
    value,
    row,
    tableOptions,
}) => {
    const children = row.Children || [];
    const swNavigator = Injector.get<any>("swNavigator");
    const { isWWW, country, duration, webSource } = swNavigator.getParams();
    const organicOrPaid = "organic";
    let keywordsAnalysisDestUrl = row.url;
    if (isWWW && country && duration && webSource) {
        keywordsAnalysisDestUrl = swNavigator.getStateUrl(`keywordAnalysis.${organicOrPaid}`, {
            isWWW,
            country,
            duration,
            keyword: value,
        });
        if (webSource === "MobileWeb" && keywordService.hasMobileWebSearchPermission) {
            keywordsAnalysisDestUrl = swNavigator.getStateUrl(`keywordAnalysis-mobileweb`, {
                isWWW,
                country,
                duration,
                keyword: value,
            });
        }
    }
    return value === "grid.upgrade" ? (
        <UpgradeLink hookType="keywords" />
    ) : (
        <div className="swTable-keywordCell u-relative u-full-width table-cell-buttons-container separate-text-from-buttons">
            <span className="search-keyword">
                <a
                    href={TrafficSourcesSearchHrefFilter(swNavigator)(undefined, null, [
                        { text: value },
                    ])}
                    className="swTable-content"
                    target="_self"
                    onClick={() => {
                        trackEvent(tableOptions, "Internal Link", value, "click");
                    }}
                >
                    {value}
                </a>
                {children.length ? (
                    <span className="u-vAlignMiddle">({row.Children.length})</span>
                ) : null}
            </span>
            <span className="link-buttons-container">
                <PlainTooltip
                    cssClass="plainTooltip-element search-keyword-cell-tooltip"
                    text="analysis.source.search.keywords.table.button.analyze"
                    placement="top"
                >
                    <a
                        href={keywordsAnalysisDestUrl}
                        target={"_blank"}
                        onClick={() =>
                            allTrackers.trackEvent(
                                "Internal link",
                                "open",
                                `Table/${value}/analyze`,
                            )
                        }
                    >
                        <IconButton iconName="search-keywords" type="flat" iconSize="xs" />
                    </a>
                </PlainTooltip>
                {
                    <PlainTooltip
                        cssClass="plainTooltip-element search-keyword-cell-tooltip"
                        text="analysis.source.search.keywords.table.button.ads"
                        placement="top"
                    >
                        <a
                            href={adsFilterFilter(swNavigator)(value).replace(/%3B/g, ";")}
                            target={"_self"}
                            onClick={() =>
                                allTrackers.trackEvent(
                                    "Internal link",
                                    "open",
                                    `Table/${value}/analyze`,
                                )
                            }
                        >
                            <IconButton iconName="search-ads" type="flat" iconSize="xs" />
                        </a>
                    </PlainTooltip>
                }
                <PlainTooltip
                    cssClass="plainTooltip-element search-keyword-cell-tooltip"
                    text="analysis.source.search.keywords.table.button.serp"
                    placement="top"
                >
                    <a
                        href={`https://google.com/search?q=${value}`}
                        target="_blank"
                        onClick={() =>
                            allTrackers.trackEvent(
                                "Internal link",
                                "open",
                                `Table/${value}/analyze`,
                            )
                        }
                    >
                        <IconButton iconName="google-search" type="flat" iconSize="xs" />
                    </a>
                </PlainTooltip>
            </span>
        </div>
    );
};
CellKeywordPhrase.displayName = "CellKeywordPhrase";
