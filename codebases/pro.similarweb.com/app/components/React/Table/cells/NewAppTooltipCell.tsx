import { TABLE_COLORS } from "constants/TableColors";
import * as React from "react";
import { AppTooltip } from "../../../../../.pro-features/components/tooltips/src/AppTooltip/AppTooltip";
import { AssetsService } from "../../../../services/AssetsService";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { trackEvent } from "../SWReactTableUtils";
import { UpgradeLink } from "./UpgradeLink";

export const NewAppTooltipCell: React.StatelessComponent<ITableCellProps> = ({
    value,
    row,
    tableMetadata,
    tableOptions,
    isLegendItem,
}) => {
    const shades = TABLE_COLORS.cohort.single;
    const legendItemColor = shades[shades.length - 1];
    let icon = "",
        externalLink = "",
        title = "empty";
    if (row.Tooltip) {
        icon = row.Tooltip.Icon || row.Tooltip.icon || row.Tooltip.Icon128 || "";
        externalLink =
            row.Tooltip.AppStore === "Google"
                ? "https://play.google.com/store/apps/details?id=" + row.App
                : "https://itunes.apple.com/app/id" + row.App;
        title = row.Tooltip.Title;
    }
    if (value !== "grid.upgrade") {
        return (
            <div className="center-vertical-cell">
                <div className="thumbnail">
                    <img src={icon} className="favicon app-cell-margin" />
                    {isLegendItem ? (
                        <div
                            className="thumbnail-legend-item"
                            style={{ backgroundColor: legendItemColor }}
                        ></div>
                    ) : null}
                </div>
                <div className="fill-to-end u-truncate">
                    <AppTooltip
                        app={row.Tooltip}
                        appId={row.App}
                        store={row.Tooltip.AppStore}
                        getAssetsUrl={AssetsService.assetUrl.bind(AssetsService)}
                    >
                        <a
                            href={row.url}
                            onClick={() => {
                                trackEvent(tableOptions, "Internal Link", title, "click");
                            }}
                        >
                            {title}
                        </a>
                    </AppTooltip>
                    <a
                        className="swTable-linkOut-right sw-icon-bounce-rate"
                        href={externalLink}
                        target="_blank"
                        onClick={() => {
                            trackEvent(tableOptions, "External Link", title, "click");
                        }}
                    ></a>
                </div>
            </div>
        );
    } else {
        return <UpgradeLink />;
    }
};
