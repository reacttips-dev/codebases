import { SWReactIcons } from "@similarweb/icons";
import * as React from "react";
import { StatelessComponent } from "react";
import { AppTooltip } from "../../../../../.pro-features/components/tooltips/src/AppTooltip/AppTooltip";
import { AssetsService } from "../../../../services/AssetsService";
import { WebsiteTooltip } from "../../Tooltip/WebsiteTooltip/WebsiteTooltip";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { trackEvent } from "../SWReactTableUtils";
import { OuterIcon } from "../StyledComponents/OuterIcon";

export const AppAndWebsiteCell: StatelessComponent<ITableCellProps> = (props) => {
    return props.row.Type === "website" ? <WebsiteCell {...props} /> : <AppCell {...props} />;
};

export const WebsiteCell: any = ({ row, value, metadata, tableOptions }) => {
    const onOuterClick = () => {
        trackEvent(tableOptions, "External Link", value, "click");
    };

    return (
        <div className="app-website-cell">
            <div className="icon-wrapper">
                <img src={row.Icon || row.Favicon} className="favicon" />
            </div>
            <WebsiteTooltip domain={value}>
                <div className="app-website-cell-text-wrapper website-cell-width">
                    <a
                        className="app-website-cell-text"
                        href={row.url}
                        onClick={() => {
                            trackEvent(metadata, "Internal Link", value, "click");
                        }}
                    >
                        {value}
                    </a>
                </div>
            </WebsiteTooltip>
            <a
                className="swTable-linkOut"
                href={`http://${value}`}
                onClick={onOuterClick}
                target="_blank"
            >
                <OuterIcon />
            </a>
        </div>
    );
};

export const AppCell: any = ({ row, metadata, tableOptions }) => {
    const onOuterClick = () => {
        trackEvent(options, "External Link", title, "click");
    };
    let icon = "",
        title = "empty",
        storeIcon = "",
        externalLink = "";
    const options = tableOptions || metadata;

    if (row.Tooltip) {
        icon = row.Tooltip.Icon || row.Tooltip.icon || row.Tooltip.Icon128 || "";
        title = row.Tooltip.Title;
        storeIcon = row.Tooltip.AppStore === "Google" ? "google-play" : "i-tunes";
        externalLink =
            row.Tooltip.AppStore === "Google"
                ? `https://play.google.com/store/apps/details?id=${row.App || row.AppID}`
                : `https://itunes.apple.com/app/id${row.App || row.AppID}`;
    }

    return (
        <div className="app-website-cell">
            <div className="icon-wrapper">
                <img src={icon} className="favicon-app" />
            </div>
            <AppTooltip
                app={row.Tooltip}
                appId={row.App || row.AppID}
                store={row.Tooltip.AppStore}
                getAssetsUrl={AssetsService.assetUrl.bind(AssetsService)}
            >
                <div className="app-website-cell-text-wrapper app-cell-width">
                    <a
                        className="app-website-cell-text"
                        href={row.url}
                        onClick={() => {
                            trackEvent(metadata, "Internal Link", title, "click");
                        }}
                    >
                        {title}
                    </a>
                </div>
            </AppTooltip>
            <SWReactIcons iconName={storeIcon} className="store-icon" />
            <a
                className="swTable-linkOut"
                href={externalLink}
                onClick={onOuterClick}
                target="_blank"
            >
                <OuterIcon />
            </a>
        </div>
    );
};

AppAndWebsiteCell.displayName = "AppAndWebsiteCell";
