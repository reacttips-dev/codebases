import { swSettings } from "common/services/swSettings";
import { i18nFilter } from "filters/ngFilters";
import React, { useState } from "react";
import { openUnlockModal } from "services/ModalService";
import { allTrackers } from "services/track/track";
import TrialService from "services/TrialService";
import { getListItemsByI18n } from "utils";
import TrialButton from "../../../../../app/components/React/TrialButton/TrialButton";
import LocationService from "../../../../components/Modals/src/UnlockModal/LocationService";
import {
    NoTouchList,
    NoTouchPanel,
    NoTouchPanelColumn,
    NoTouchPrice,
    NoTouchText,
    NoTouchTitle,
    NoTouchTitleNote,
} from "../../../NoTouch";
import {
    StyledTrialExpiredNoTouch,
    StyledTrialExpiredNoTouchButtonCaption,
    StyledTrialExpiredNoTouchButtonWrap,
    StyledTrialExpiredNoTouchContainer,
    StyledTrialExpiredNoTouchImage,
    StyledTrialExpiredNoTouchLink,
    StyledTrialExpiredNoTouchSubtitle,
    StyledTrialExpiredNoTouchTitle,
} from "./StyledComponents";

const TrialExpiredNoTouch = () => {
    const swSites = swSettings.swsites;
    const workspace = new TrialService().getWorkspaceName();

    const [isPremiumListExpanded, setPremiumListExpanded] = useState(false);

    const onContactClick = () => {
        openUnlockModal(
            {
                modal: "Default",
                slide: "Default",
            },
            `${LocationService.getCurrentLocation()}/Trial Expired`,
            false,
        );
        allTrackers.trackEvent(
            "solution trial end screen",
            "click",
            `Premium/contact us/${workspace}`,
        );
    };

    return (
        <StyledTrialExpiredNoTouch>
            <StyledTrialExpiredNoTouchContainer>
                <StyledTrialExpiredNoTouchTitle>
                    {i18nFilter()("trial_expired.no_touch.title")}
                </StyledTrialExpiredNoTouchTitle>
                <StyledTrialExpiredNoTouchSubtitle
                    dangerouslySetInnerHTML={{
                        __html: i18nFilter()("trial_expired.no_touch.subtitle"),
                    }}
                />
                <NoTouchPanel isActive={true}>
                    <NoTouchPanelColumn>
                        <NoTouchTitle>
                            {i18nFilter()(`hook_no_touch.${workspace}.basic_title`)}
                            <NoTouchTitleNote>
                                {i18nFilter()(`hook_no_touch.${workspace}.basic_title_note`)}
                            </NoTouchTitleNote>
                        </NoTouchTitle>
                        <NoTouchText>
                            {i18nFilter()(`hook_no_touch.${workspace}.basic_text`)}
                        </NoTouchText>
                        <NoTouchPrice>
                            {i18nFilter()(`hook_no_touch.${workspace}.basic_price`)}
                        </NoTouchPrice>
                    </NoTouchPanelColumn>
                    <NoTouchPanelColumn>
                        <NoTouchList title={"Package Features"}>
                            {getListItemsByI18n(`hook_no_touch.${workspace}.basic_list.line_`)}
                        </NoTouchList>
                    </NoTouchPanelColumn>
                    <NoTouchPanelColumn>
                        <StyledTrialExpiredNoTouchButtonWrap>
                            <a
                                href={`${swSites.login}/purchase?workspace=${workspace}`}
                                target="_blank"
                                onClick={() => {
                                    allTrackers.trackEvent(
                                        "solution trial end screen",
                                        "click",
                                        `Buy NT/go to payment page/${workspace}`,
                                    );
                                }}
                            >
                                <TrialButton>
                                    {i18nFilter()("hook_no_touch.button_purchase.text")}
                                </TrialButton>
                            </a>
                            <StyledTrialExpiredNoTouchButtonCaption>
                                Trial Expired
                            </StyledTrialExpiredNoTouchButtonCaption>
                        </StyledTrialExpiredNoTouchButtonWrap>
                    </NoTouchPanelColumn>
                </NoTouchPanel>

                <NoTouchPanel>
                    <NoTouchPanelColumn>
                        <NoTouchTitle>
                            {i18nFilter()(`hook_no_touch.${workspace}.premium_title`)}
                        </NoTouchTitle>
                        <NoTouchText>
                            {i18nFilter()(`hook_no_touch.${workspace}.premium_text`)}
                        </NoTouchText>
                        <StyledTrialExpiredNoTouchImage />
                    </NoTouchPanelColumn>
                    <NoTouchPanelColumn>
                        <NoTouchList title={"Package Features"}>
                            {getListItemsByI18n(
                                `hook_no_touch.${workspace}.premium_list.line_`,
                            ).filter((item, i) => {
                                if (!isPremiumListExpanded) {
                                    if (i < 3) {
                                        return item;
                                    }
                                } else {
                                    return item;
                                }
                            })}
                        </NoTouchList>
                        {!isPremiumListExpanded && (
                            <StyledTrialExpiredNoTouchLink
                                onClick={() => {
                                    setPremiumListExpanded(true);
                                }}
                            >
                                {i18nFilter()(`hook_no_touch.${workspace}.premium_link.text`)}
                            </StyledTrialExpiredNoTouchLink>
                        )}
                    </NoTouchPanelColumn>
                    <NoTouchPanelColumn>
                        <StyledTrialExpiredNoTouchButtonWrap>
                            <TrialButton type="outlined" onClick={onContactClick}>
                                {i18nFilter()("hook_no_touch.button_contact.text")}
                            </TrialButton>
                        </StyledTrialExpiredNoTouchButtonWrap>
                    </NoTouchPanelColumn>
                </NoTouchPanel>
            </StyledTrialExpiredNoTouchContainer>
        </StyledTrialExpiredNoTouch>
    );
};

export default TrialExpiredNoTouch;
