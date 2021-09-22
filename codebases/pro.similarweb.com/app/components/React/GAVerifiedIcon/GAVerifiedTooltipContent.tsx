import { swSettings } from "common/services/swSettings";
import * as React from "react";
import { StatelessComponent } from "react";
import * as PropTypes from "prop-types";
import * as classNames from "classnames";
import * as _ from "lodash";
import I18n from "../Filters/I18n";
import { GAPromoTooltipContentFooter } from "../Tooltip/VerifiedDataToggleInfoTooltip/GAPromoTooltipContentFooter";
import { Injector } from "common/ioc/Injector";

export interface IGAVerifiedTooltipContent {
    isActive: boolean;
    isPrivate: boolean;
    openTooltip: boolean;
    title: string;
    body: string;
    linkText: string;
    metric: string;
    closeTooltip?(): () => any;
    /**
     * ClosePopup function gets injected into this component via the PopupHoverContainer component.
     * upon rendering this component as a popup's content, the popup automatically renders it with closePopup as a property.
     */
    closePopup?: () => void;
}

function isFunction(value) {
    return typeof value === "function";
}

const GAVerifiedTooltipContent: StatelessComponent<IGAVerifiedTooltipContent> = ({
    title,
    body,
    linkText,
    closeTooltip,
    isActive,
    isPrivate,
    openTooltip,
    metric,
    closePopup,
}) => {
    const isAccountGAConnected =
        swSettings.components.Home.resources.IsConnectedGoogleAnalyticsAccount;
    return (
        <div className={classNames("GAVerified-tooltip-content")}>
            <div className={classNames("GAVerified-tooltip-title")}>
                <I18n>{title}</I18n>
            </div>
            <div className={classNames("GAVerified-tooltip-text")}>
                <I18n>{body}</I18n>
            </div>
            <div className="verified-data-toggle-info-tooltip-element-inner-footer">
                <div
                    className={classNames({
                        "verified-data-toggle-info-tooltip-element-inner-footer--full-width": !isAccountGAConnected,
                    })}
                >
                    <GAPromoTooltipContentFooter
                        metric={metric}
                        openTooltip={openTooltip}
                        closeTooltip={closeTooltip}
                        closePopup={closePopup}
                        isAccountGAConnected={isAccountGAConnected}
                        isActive={isActive}
                        isPrivate={isPrivate}
                        linkText={linkText}
                    />
                </div>
            </div>
        </div>
    );
};

GAVerifiedTooltipContent.propTypes = {
    isActive: PropTypes.bool,
    isPrivate: PropTypes.bool,
    openTooltip: PropTypes.bool,
    metric: PropTypes.string,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    linkText: PropTypes.string.isRequired,
    closeTooltip: PropTypes.func,
};

export default GAVerifiedTooltipContent;
