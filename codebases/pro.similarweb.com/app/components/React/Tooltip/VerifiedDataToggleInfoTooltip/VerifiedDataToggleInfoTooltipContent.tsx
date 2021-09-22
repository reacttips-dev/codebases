import * as React from "react";
import { InjectableComponentClass } from "../../InjectableComponent/InjectableComponent";
import I18n from "../../Filters/I18n";
import { GAPromoTooltipContentFooter } from "./GAPromoTooltipContentFooter";

export class VerifiedDataToggleInfoTooltipContent extends InjectableComponentClass<any, any> {
    static propTypes = {};

    render() {
        return (
            <div className="">
                <div className="verified-data-toggle-info-tooltip-element-inner-title">
                    <span>
                        <I18n>common.estimation.vs.verified.header.text</I18n>
                    </span>
                    <span className="verified-data-toggle-info-tooltip-element-inner-title-promotion">
                        <I18n>common.estimation.vs.verified.header.text.highlight</I18n>
                    </span>
                </div>
                <div className="verified-data-toggle-info-tooltip-element-inner-content">
                    <span>
                        <I18n>common.estimation.vs.verified.content.text</I18n>
                    </span>
                </div>
                <div className="verified-data-toggle-info-tooltip-element-inner-footer">
                    <GAPromoTooltipContentFooter
                        isAccountGAConnected={false}
                        closeTooltip={this.props.closeTooltip}
                    />
                </div>
            </div>
        );
    }
}
