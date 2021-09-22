import * as React from "react";
import * as PropTypes from "prop-types";
import { InjectableComponentClass } from "../../InjectableComponent/InjectableComponent";
import { VerifiedDataToggleInfoTooltipContent } from "./VerifiedDataToggleInfoTooltipContent";
import { PopupHoverContainer } from "@similarweb/ui-components/dist/popup-hover-container";

export interface IVerifiedDataToggleInfoTooltip {
    enabled?: boolean;
    placement?: string;
    cssClass?: string;
    cssClassContent?: string;
}

export class VerifiedDataToggleInfoTooltip extends InjectableComponentClass<any, any> {
    static propTypes = {
        enabled: PropTypes.bool,
        placement: PropTypes.string,
        cssClass: PropTypes.string,
        cssClassContent: PropTypes.string,
    };

    static defaultProps = {
        enabled: true,
        placement: "bottom",
        cssClass: "verified-data-toggle-info-tooltip-element",
        cssClassContent: "verified-data-toggle-info-tooltip-element-content",
        allowHover: true,
    };

    render() {
        return (
            <PopupHoverContainer
                content={() => <VerifiedDataToggleInfoTooltipContent />}
                config={{
                    enabled: this.props.enabled,
                    placement: this.props.placement,
                    cssClass: this.props.cssClass,
                    cssClassContent: this.props.cssClassContent,
                    allowHover: this.props.allowHover,
                }}
            >
                {this.props.children}
            </PopupHoverContainer>
        );
    }
}
