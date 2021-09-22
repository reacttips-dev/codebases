/**
 * a Tooltip that shows website data
 */

import * as React from "react";
import * as PropTypes from "prop-types";
import { PopupHoverContainer } from "@similarweb/ui-components/dist/popup-hover-container";
import { WebsiteTooltipContent } from "./WebsiteTooltipContent";
import { FunctionComponent } from "react";

interface IWebsiteTooltipProps {
    domain: string;
    placement?: string;
    hideTrackButton?: boolean;
    debounce?: number;
    appendTo?: string;
}

export const WebsiteTooltip: FunctionComponent<IWebsiteTooltipProps> = (props) => {
    return (
        <PopupHoverContainer
            content={() => (
                <WebsiteTooltipContent
                    domain={props.domain}
                    hideTrackButton={props.hideTrackButton}
                />
            )}
            config={{
                placement: props.placement,
                cssClassContent: "Popup-content-infoCard",
                cssClassContainer: "Popup-Container-infoCard",
                width: 394,
                height: 204,
                allowHover: true,
                closeDelay: 50,
            }}
            debounce={props.debounce}
            appendTo={props.appendTo}
        >
            {props.children}
        </PopupHoverContainer>
    );
};

WebsiteTooltip.propTypes = {
    domain: PropTypes.string,
    placement: PropTypes.string,
    hideTrackButton: PropTypes.bool,
};

WebsiteTooltip.defaultProps = {
    domain: null,
    placement: "top-left",
};

WebsiteTooltip.displayName = "WebsiteTooltip";
