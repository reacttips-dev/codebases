import { PopupHoverContainer } from "@similarweb/ui-components/dist/popup-hover-container";
import * as PropTypes from "prop-types";
import * as React from "react";
import { StatelessComponent } from "react";
import LinkProvider from "../../../WithLink/src/LinkProvider";
import { AppTooltipContent } from "./AppTooltipContent";

/**
 * a Tooltip that that shows an app description
 */

interface IAppTooltipProps {
    app?: any;
    appId?: string;
    store?: string;
    getAssetsUrl?: any;
    enabled?: boolean;
    placement?: string;
    debounce?: number;
    appendTo?: string;
    cssClass?: string;
    cssClassContent?: string;
}

export const AppTooltip: StatelessComponent<IAppTooltipProps> = ({
    app,
    appId,
    store,
    getAssetsUrl,
    debounce,
    appendTo,
    enabled,
    placement,
    cssClass,
    cssClassContent,
    children,
}) => {
    return (
        <PopupHoverContainer
            content={() => <AppTooltipContent app={app} appId={appId} store={store} />}
            config={{
                enabled,
                placement,
                cssClassContent: "Popup-content-infoCard",
                cssClassContainer: "Popup-Container-infoCard",
                width: 394,
                height: 204,
                allowHover: true,
                closeDelay: 50,
            }}
            debounce={debounce}
            appendTo={appendTo}
        >
            {children}
        </PopupHoverContainer>
    );
};
AppTooltip.propTypes = {
    app: PropTypes.object,
    appId: PropTypes.string,
    store: PropTypes.string,
    enabled: PropTypes.bool,
    placement: PropTypes.string,
    debounce: PropTypes.number,
    appendTo: PropTypes.string,
    cssClass: PropTypes.string,
    cssClassContent: PropTypes.string,
    getAssetsUrl: PropTypes.func,
};

AppTooltip.defaultProps = {
    enabled: true,
    placement: "top-left",
    cssClass: "appTooltip-element",
    cssClassContent: "appTooltip-element-content",
};
