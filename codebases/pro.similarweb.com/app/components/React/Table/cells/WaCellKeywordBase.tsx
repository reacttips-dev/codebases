import * as React from "react";
import { StatelessComponent } from "react";
import { allTrackers } from "services/track/track";
import { keywordAnalysisHrefFilter, adsFilterFilter } from "filters/ngFilters";
import { Injector } from "common/ioc/Injector";

interface KeywordCellProps {
    keyword: string;
    allowLinking: boolean;
    childCount: number;
    showGoogleSearch: boolean;
    showAdSearch: boolean;
}

export const WaCellKeywordBase: StatelessComponent<KeywordCellProps> = ({
    keyword,
    allowLinking,
    childCount,
    showGoogleSearch,
    showAdSearch,
}) => {
    function trackKeyword() {
        allTrackers.trackEvent("Internal Link", "click", "Table/" + keyword);
    }
    const swNavigator = Injector.get("swNavigator");

    return (
        <div className="swTable-keywordCell" style={{ position: "relative", width: "100%" }}>
            <span>
                {" "}
                {allowLinking ? (
                    <span>
                        <a
                            href={keywordAnalysisHrefFilter(swNavigator)(keyword, null)}
                            onClick={trackKeyword}
                            className="swTable-content"
                        >
                            {keyword}
                        </a>
                    </span>
                ) : (
                    <span>
                        {" "}
                        <span className="swTable-content">{keyword}</span>{" "}
                    </span>
                )}{" "}
            </span>
            {childCount ? <span>{`(${childCount})`}</span> : null}
            {showGoogleSearch ? (
                <a
                    className="magnifySearch sw-btn-search-press"
                    href={`https://google.com/search?q=${keyword}`}
                    target="_blank"
                />
            ) : null}
            {showAdSearch ? (
                <a
                    className="btn-search-ads"
                    href={adsFilterFilter(swNavigator)(keyword)}
                    target="_self"
                >
                    Ads
                </a>
            ) : null}
        </div>
    );
};
WaCellKeywordBase.displayName = "WaCellKeywordBase";
