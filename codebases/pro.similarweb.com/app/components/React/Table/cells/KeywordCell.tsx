import * as React from "react";
import { StatelessComponent } from "react";
import { trackEvent } from "../SWReactTableUtils";
import { OuterIcon } from "../StyledComponents/OuterIcon";
import { SWReactIcons } from "@similarweb/icons";

export const KeywordCell: StatelessComponent<any> = ({ row, value, metadata, tableOptions }) => {
    const onOuterClick = () => {
        trackEvent(tableOptions, "External Link", value, "click");
    };

    return (
        <div className="keyword-cell">
            <SWReactIcons iconName="search" className="search-icon" />
            <div className="keyword-cell-text-wrapper">
                <a
                    className="keyword-cell-text"
                    href={row.url}
                    title={value}
                    target="_self"
                    onClick={() => {
                        trackEvent(metadata, "Internal Link", value, "click");
                    }}
                >
                    {value}
                </a>
            </div>
            <a
                className="swTable-linkOut"
                href={`https://google.com/search?q=${value}`}
                onClick={onOuterClick}
                target="_blank"
            >
                <OuterIcon />
            </a>
        </div>
    );
};
KeywordCell.displayName = "KeywordCell";
