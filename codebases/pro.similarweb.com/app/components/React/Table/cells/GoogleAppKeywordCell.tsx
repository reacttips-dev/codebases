import * as React from "react";
import { StatelessComponent } from "react";
import { trackEvent } from "../SWReactTableUtils";

export const GoogleAppKeywordCell: StatelessComponent<any> = ({ row, value, tableOptions }) => {
    return (
        <div className="swTable-keywordCell u-relative u-full-width">
            <span>
                <a
                    href={row.href}
                    className="swTable-content"
                    target="_self"
                    onClick={() => {
                        trackEvent(tableOptions, "Internal Link", value, "click");
                    }}
                >
                    {value}
                </a>
            </span>
            <a
                className="magnifySearch sw-btn-search-press"
                href={`https://play.google.com/store/search?q=${value}&c=apps`}
                target="_blank"
                onClick={() => {
                    trackEvent(tableOptions, "External Link", value, "click");
                }}
            />
        </div>
    );
};
GoogleAppKeywordCell.displayName = "GoogleAppKeywordCell";
