import { IPopupConfig } from "@similarweb/ui-components/dist/popup";
import { PopupHoverContainer } from "@similarweb/ui-components/dist/popup-hover-container";
import classNames from "classnames";
import * as PropTypes from "prop-types";
import * as React from "react";
import { ReactNode } from "react";
import { InjectableComponentClass } from "../../InjectableComponent/InjectableComponent";
import { PlainTooltipContent } from "./PlainTooltipContent";

export interface IPlainTooltipProps {
    text: ReactNode;
    enabled?: boolean;
    placement?: string;
    cssClass?: string;
    cssClassContent?: string;
    maxWidth?: number;
    defaultOpen?: boolean;
    dangerouslySetInnerHTML?: boolean;
    variation?: string;
    closePopupOnClick?: boolean;
}

/**
 * a Tooltip that just shows text
 */
export class PlainTooltip extends InjectableComponentClass<IPlainTooltipProps, {}> {
    public static propTypes = {
        text: PropTypes.node,
        placement: PropTypes.string,
        cssClass: PropTypes.string,
        cssClassContent: PropTypes.string,
        maxWidth: PropTypes.number,
        enabled: PropTypes.bool,
        dangerouslySetInnerHTML: PropTypes.bool,
        variation: PropTypes.string,
        closePopupOnClick: PropTypes.bool,
    };

    public static defaultProps = {
        text: "MISSING_TEXT",
        cssClass: "plainTooltip-element",
        cssClassContent: "plainTooltip-content",
        enabled: true,
        placement: "top",
        variation: "normal",
        maxWidth: 250,
        dangerouslySetInnerHTML: false,
        closePopupOnClick: false,
    };

    public render() {
        const config: IPopupConfig = {
            enabled: this.props.enabled,
            placement: this.props.placement,
            maxWidth: this.props.maxWidth,
            cssClass: this.props.cssClass,
            cssClassContent: this.props.cssClassContent,
            cssClassContainer: "",
        };
        if (this.props.variation === "white") {
            config.cssClass = classNames(
                this.props.cssClass,
                "plainTooltip-element plainTooltip-element-white",
            );
        }
        return (
            <PopupHoverContainer
                content={() => (
                    <PlainTooltipContent
                        text={this.props.text}
                        dangerouslySetInnerHTML={this.props.dangerouslySetInnerHTML}
                    />
                )}
                config={config}
                closePopupOnClick={this.props.closePopupOnClick}
            >
                {this.props.children}
            </PopupHoverContainer>
        );
    }
}
