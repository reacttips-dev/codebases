import { IconButton } from "@similarweb/ui-components/dist/button";
import { Injector } from "common/ioc/Injector";
import classNames from "classnames";
import { trackEvent } from "components/React/Table/SWReactTableUtils";
import * as React from "react";
import { FC } from "react";
import { allTrackers } from "../../../../services/track/track";
import { PlainTooltip } from "../../Tooltip/PlainTooltip/PlainTooltip";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { UpgradeLink } from "./UpgradeLink";
import { clearURl } from "pages/app performance/src/page/single/usage section/formatters";

// adsUrl is optional prop to override the default ads Url link
export const SearchKeywordCell: FC<
    ITableCellProps & { adsUrl?: string; withAdsLink?: boolean; withGoogleLink?: boolean }
> = ({
    tableOptions,
    value,
    row,
    adsUrl,
    onItemClick,
    disabled = false,
    withAdsLink = true,
    withGoogleLink = true,
}) => {
    const swNavigator = Injector.get("swNavigator") as any;
    const chosenSites = Injector.get("chosenSites") as any;
    const { isWWW, country, duration, webSource } = swNavigator.getParams();
    const adsFilter = Injector.get<any>("adsFilterFilter");
    const externalTracking = (keyword) => () =>
        allTrackers.trackEvent("External link", "open", `Table/${keyword}/serp`);
    if (value === "grid.upgrade") {
        return <UpgradeLink hookType="keywords" />;
    }
    let keywordsAnalysisDestUrl = row.url;
    if (isWWW && country && duration && webSource) {
        keywordsAnalysisDestUrl = swNavigator.getStateUrl("keywordAnalysis_overview", {
            isWWW,
            country,
            duration,
            keyword: value,
        });
    }
    const renderLink = () => {
        if (!keywordsAnalysisDestUrl || swNavigator.current().name.match(/accountreview_/)) {
            return <span className="swTable-content">{value}</span>;
        }

        return (
            <a
                href={disabled ? undefined : clearURl(keywordsAnalysisDestUrl)}
                className={classNames("swTable-content", disabled && "swTable-content--disabled")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={
                    disabled
                        ? undefined
                        : () => {
                              if (onItemClick) {
                                  onItemClick(value);
                              } else {
                                  trackEvent(tableOptions, "Internal Link", value, "click");
                              }
                          }
                }
            >
                {value}
            </a>
        );
    };
    return (
        <div className="swTable-keywordCell u-relative u-full-width table-cell-buttons-container separate-text-from-buttons">
            <span className="search-keyword">{renderLink()}</span>
            {!disabled && (
                <span className="link-buttons-container">
                    {withAdsLink &&
                        (adsUrl || webSource === "Desktop") &&
                        !chosenSites.isCompare() && (
                            <PlainTooltip
                                cssClass="plainTooltip-element search-keyword-cell-tooltip"
                                text="analysis.source.search.keywords.table.button.ads"
                                placement="top"
                            >
                                <a
                                    href={adsUrl || adsFilter(value).replace(/%3B/g, ";")}
                                    target={"_blank"}
                                    rel="noopener noreferrer"
                                >
                                    <IconButton iconName="search-ads" type="flat" iconSize="xs" />
                                </a>
                            </PlainTooltip>
                        )}
                    {withGoogleLink && (
                        <PlainTooltip
                            cssClass="plainTooltip-element search-keyword-cell-tooltip"
                            text="analysis.source.search.keywords.table.button.serp"
                            placement="top"
                        >
                            <a
                                href={`https://google.com/search?q=${value}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={externalTracking(value)}
                            >
                                <IconButton iconName="google-search" type="flat" iconSize="xs" />
                            </a>
                        </PlainTooltip>
                    )}
                </span>
            )}
        </div>
    );
};
SearchKeywordCell.displayName = "SearchKeywordCell";
