import { SWReactIcons } from "@similarweb/icons";
import * as classNames from "classnames";
import { swSettings } from "common/services/swSettings";
import * as PropTypes from "prop-types";
import * as React from "react";
import { allTrackers } from "services/track/track";
import I18n from "../../Filters/I18n";
import { InjectableComponentClass } from "../../InjectableComponent/InjectableComponent";

let $modal, $rootScope: any;
export class GAPromoTooltipContentFooter extends InjectableComponentClass<any, any> {
    static propTypes = {
        isActive: PropTypes.bool,
        isPrivate: PropTypes.bool,
        openTooltip: PropTypes.bool,
        closeTooltip: PropTypes.func,
        linkText: PropTypes.string,
        metric: PropTypes.string,
    };

    private isAccountGAConnected: boolean;
    private verificationType: string;

    constructor(props) {
        super(props);
        $modal = this.injector.get("$modal");
        $rootScope = this.injector.get("$rootScope");

        const metric = props.metric ? `${props.metric}/` : "";

        this.isAccountGAConnected = props.isAccountGAConnected;
        if (this.props.isPrivate) {
            this.verificationType = `${metric}Private`;
        } else {
            if (this.props.isActive) {
                this.verificationType = `${metric}Public`;
            } else {
                this.verificationType = `${metric}Non-Verified`;
            }
        }
    }

    track(suggestConect: boolean, force?: boolean) {
        if (force) {
            allTrackers.trackEvent(
                "Popup",
                "click",
                suggestConect
                    ? "Introduction popup Connect GA/Get your website verified"
                    : "Introduction popup Connect GA/Learn more",
            );
        } else {
            allTrackers.trackEvent(
                "Popup",
                "click",
                suggestConect
                    ? `${this.verificationType}/Get your website verified`
                    : `${this.verificationType}/Learn more`,
            );
        }
    }

    onClick() {
        if (!this.isAccountGAConnected) {
            $modal.open({
                templateUrl: "/app/components/GA-verify/ga-wizard.html",
                controller: "gaVerifyModalCtrl",
                windowClass: "ga-modal",
                scope: $rootScope,
            });
        } else {
            window.open("https://support.similarweb.com/hc/en-us/articles/208420125");
        }
        this.track(!this.isAccountGAConnected, this.props.openTooltip);
        if (this.props.closePopup) {
            this.props.closePopup();
        }
    }

    render() {
        if (swSettings.components.Home.resources.GaMode !== "Skip") {
            if (!this.isAccountGAConnected) {
                return (
                    <div
                        className="ga-promo-tooltip-content-footer"
                        onClick={this.onClick.bind(this)}
                    >
                        <span className="ga-verified-icon" />
                        <span className="verified-data-promotion-text">
                            <I18n>common.estimation.vs.verified.footer.text</I18n>
                        </span>
                        <SWReactIcons iconName="chev-right" />
                    </div>
                );
            } else {
                return (
                    <div className={classNames("GAVerified-tooltip-link")}>
                        <a onClick={this.onClick.bind(this)}>
                            <I18n>{this.props.linkText}</I18n>
                        </a>
                    </div>
                );
            }
        } else {
            return <div className={classNames("GAVerified-tooltip-link")} />;
        }
    }
}
