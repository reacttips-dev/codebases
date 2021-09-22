import { Button } from "@similarweb/ui-components/dist/button";
import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import React from "react";
import { openUnlockModal } from "services/ModalService";
import { allTrackers } from "services/track/track";
import TrialService from "services/TrialService";
import styled from "styled-components";
import LocationService from "../../../../.pro-features/components/Modals/src/UnlockModal/LocationService";

export const TRIAL_BANNER_HEIGHT = 54;

const basicTheme = {
    color: "#2a3e52",
    background: "#ffeaa8",
};

const trialTheme = {
    color: "#2b3b67",
    background: "#dfdeff",
};

const i18n = i18nFilter();

const TrialBannerContent = styled.div`
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: ${TRIAL_BANNER_HEIGHT}px;
    font-size: 1rem;
    color: ${(props) => props.theme.color};
    background: ${(props) => props.theme.background};
`;

const TrialBannerText = styled.div`
    margin-right: 16px;
`;

const TrialBanner = () => {
    const isNoTouch = swSettings.components.Home.resources.CanPurchaseNoTouch;
    const { accountId } = swSettings.user;

    const trialService = new TrialService();
    const isTrial = trialService.isTrial();

    if (!isTrial) {
        return null;
    }

    const getDaysLeftText = () => {
        const daysLeft = trialService.getDaysLeft();

        if (daysLeft < 1) {
            return i18n(
                "trial_banner.bold_text.expired",
                {},
                i18n("trial_banner.bold_text.expired"),
            );
        }

        const countTypeDays = daysLeft > 1 ? "plural" : "single";

        return i18n(`trial_banner.bold_text.${countTypeDays}`, { number: daysLeft });
    };

    const daysLeftText = getDaysLeftText();
    const text = i18n(
        `trial_banner.text.${accountId}`,
        { daysLeftText },
        i18n("trial_banner.text"),
    );
    const buttonText = i18n(
        `trial_banner.button.text.${accountId}`,
        {},
        i18n("trial_banner.button.text"),
    );

    return (
        <TrialBannerContent theme={basicTheme}>
            <TrialBannerText>
                <span dangerouslySetInnerHTML={{ __html: text }} />
            </TrialBannerText>
            <Button
                type="upsell"
                style={{ lineHeight: "normal" }}
                onClick={() => {
                    openUnlockModal(
                        {
                            modal: "Default",
                            slide: "Default",
                            isNoTouch,
                        },
                        `${LocationService.getCurrentLocation()}/TrialBanner`,
                        !isNoTouch,
                    );
                    if (isNoTouch) {
                        allTrackers.trackEvent(
                            "hook/Contact Us/Pop Up",
                            "click",
                            `${LocationService.getCurrentLocation()}/nt hook`,
                        );
                    }
                }}
            >
                {buttonText}
            </Button>
        </TrialBannerContent>
    );
};

(TrialBanner as React.FunctionComponent).displayName = "TrialBanner";

SWReactRootComponent(TrialBanner, "TrialBanner");

export default TrialBanner;
