import * as React from "react";
import { StatelessComponent } from "react";
import { AppTooltip } from "../../../../../.pro-features/components/tooltips/src/AppTooltip/AppTooltip";
import { AssetsService } from "../../../../services/AssetsService";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { trackEvent } from "../SWReactTableUtils";
import { UpgradeLink } from "./UpgradeLink";

export const AppTooltipCell: StatelessComponent<ITableCellProps> = ({
    value,
    row,
    tableMetadata,
    metadata,
    tableOptions,
}) => {
    let icon = "",
        externalLink = "",
        title = "empty";

    const options = tableOptions || metadata;

    if (row.Tooltip) {
        icon = row.Tooltip.Icon || row.Tooltip.icon || row.Tooltip.Icon128 || "";
        externalLink =
            row.Tooltip.AppStore === "Apple"
                ? "https://itunes.apple.com/app/id" + row.App
                : "https://play.google.com/store/apps/details?id=" + row.App;
        title = row.Tooltip.Title;
    }
    if (value !== "grid.upgrade") {
        return (
            <div>
                <img src={icon} className="favicon app-cell-margin" />
                <AppTooltip
                    app={row.Tooltip}
                    appId={row.App}
                    store={row.Tooltip.AppStore}
                    getAssetsUrl={AssetsService.assetUrl.bind(AssetsService)}
                >
                    <a
                        href={row.url}
                        onClick={() => {
                            trackEvent(options, "Internal Link", title, "click");
                        }}
                    >
                        <div className="swTable-content">{title}</div>
                    </a>
                </AppTooltip>
                <a
                    className="swTable-linkOut sw-icon-bounce-rate"
                    href={externalLink}
                    target="_blank"
                    onClick={() => {
                        trackEvent(options, "External Link", title, "click");
                    }}
                ></a>
            </div>
        );
    } else {
        return <UpgradeLink />;
    }
};
AppTooltipCell.displayName = "AppTooltipCell";
