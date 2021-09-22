import * as React from "react";

import { StatelessComponent } from "react";
import { WebsiteTooltip } from "../../Tooltip/WebsiteTooltip/WebsiteTooltip";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { trackEvent } from "../SWReactTableUtils";
import { UpgradeLink } from "./UpgradeLink";

export const WebsiteTooltipTopNoExpandCell: StatelessComponent<ITableCellProps> = ({
    row,
    value,
    tableMetadata,
    tableOptions,
}) => {
    const children = row.Children || [],
        wrapperClass = tableMetadata.hasChilds ? "link-cell domain-cell" : "link-cell cell-padding";

    if (value !== "grid.upgrade") {
        return (
            <div className={wrapperClass}>
                <img
                    src={row.Icon || row.Favicon}
                    className="favicon swTable-websiteTooltipCell-favicon"
                />
                <WebsiteTooltip domain={value}>
                    <a href={row.url}>
                        <div
                            className={
                                children.length && tableOptions.tableType != "swTable--simple"
                                    ? "swTable-content-small text"
                                    : "swTable-content-large text"
                            }
                            onClick={() => {
                                trackEvent(tableOptions, "Internal Link", value, "click");
                            }}
                        >
                            {value}
                        </div>
                    </a>
                </WebsiteTooltip>
                <a
                    className="swTable-linkOut sw-icon-bounce-rate"
                    href={`http://${value}`}
                    onClick={() => {
                        trackEvent(tableOptions, "External Link", value, "click");
                    }}
                    target="_blank"
                />
            </div>
        );
    } else {
        return <UpgradeLink />;
    }
};
WebsiteTooltipTopNoExpandCell.displayName = "WebsiteTooltipTopNoExpandCell";
