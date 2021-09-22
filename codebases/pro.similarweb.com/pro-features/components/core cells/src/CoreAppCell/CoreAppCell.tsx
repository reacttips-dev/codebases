import * as PropTypes from "prop-types";
import * as React from "react";
import { StatelessComponent } from "react";
import { AppTooltip } from "../../../tooltips/src/AppTooltip/AppTooltip";
import { AppContent, AppIcon, AppRow, HoverIcon, Icon } from "./StyledComponents";

const CoreAppCell: StatelessComponent<ICoreAppCellProps> = ({
    value,
    row,
    appInfo,
    store,
    getInternalLink,
    onTrackInternalLink,
    getExternalLink,
    onTrackExternalLink,
    getAssetsUrl,
    showStoreIcon,
    bold,
}) => {
    enum Type {
        App = "app",
    }

    const storeIcon = store === "Google" || store === "0" ? "google-play" : "i-tunes";
    return (
        <AppRow bold={bold}>
            <AppIcon iconType={Type.App} iconName={appInfo.title} iconSrc={appInfo.icon} />
            <AppContent
                hasStore={showStoreIcon}
                hasLeader={row.isLeader}
                hasExternalLink={getExternalLink}
            >
                <AppTooltip
                    app={appInfo}
                    appId={row.mainItem || row.appId}
                    store={row.tooltip.appStore}
                    placement="top"
                    getAssetsUrl={getAssetsUrl}
                >
                    {getInternalLink ? (
                        <a
                            className="CoreAppCell-app-text CoreAppCell-link"
                            href={getInternalLink(row)}
                            onClick={() => onTrackInternalLink(row)}
                        >
                            {value}
                        </a>
                    ) : (
                        <span className="CoreAppCell-app-text">{value}</span>
                    )}
                </AppTooltip>
                {showStoreIcon && <Icon iconName={storeIcon} />}
                {row.isLeader && <Icon iconName="winner" bold={true} />}
                {getExternalLink && (
                    <a
                        href={getExternalLink(row)}
                        onClick={() => onTrackExternalLink(row)}
                        target="_blank"
                    >
                        <HoverIcon iconName="link-out" />
                    </a>
                )}
            </AppContent>
        </AppRow>
    );
};
CoreAppCell.displayName = "CoreAppCell";

CoreAppCell.propTypes = {
    value: PropTypes.string.isRequired,
    row: PropTypes.object.isRequired,
    appInfo: PropTypes.shape({
        appStore: PropTypes.string,
        title: PropTypes.string,
        author: PropTypes.string,
        icon: PropTypes.string,
        price: PropTypes.string,
        category: PropTypes.string,
    }).isRequired,
    store: PropTypes.string.isRequired,
    getInternalLink: PropTypes.func,
    onTrackInternalLink: PropTypes.func,
    getExternalLink: PropTypes.func,
    onTrackExternalLink: PropTypes.func,
    getAssetsUrl: PropTypes.func.isRequired,
    showStoreIcon: PropTypes.bool,
    bold: PropTypes.bool,
};

export interface IAppInfo {
    appStore?: string;
    title?: string;
    author?: string;
    icon?: string;
    price?: string;
    category?: string;
}

export interface ICoreAppCellProps {
    value: string;
    row: any;
    appInfo: IAppInfo;
    store: string;
    getInternalLink?: (row) => string;
    onTrackInternalLink?: (a?, b?, c?, d?) => void;
    getExternalLink?: (row) => string;
    onTrackExternalLink?: (a?, b?, c?, d?) => void;
    getAssetsUrl: (suffix) => string;
    showStoreIcon?: boolean;
    bold?: boolean;
}

export default CoreAppCell;
