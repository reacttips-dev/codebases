import { i18nFilter } from "filters/ngFilters";
import { func } from "prop-types";
import * as React from "react";
import { openUnlockModal } from "services/ModalService";
import { allTrackers } from "services/track/track";
import LocationService from "../../../Modals/src/UnlockModal/LocationService";
import { trialExpiredArt } from "../../Art/src/WorkspaceArt";
import {
    TrialExpiredButton,
    TrialExpiredContainer,
    TrialExpiredLink,
    TrialExpiredText,
    TrialExpiredTitle,
    TrialExpiredWrap,
} from "./StyledComponents";

interface ITrialExpiredProps {
    userName: string;
}

interface ITrialExpiredState {
    isContactUsModalOpen: boolean;
}

export class TrialExpired extends React.PureComponent<ITrialExpiredProps, ITrialExpiredState> {
    public static contextTypes = {
        translate: func,
        track: func,
    };

    constructor(props) {
        super(props);

        this.state = {
            isContactUsModalOpen: false,
        };
    }

    public render() {
        return (
            <TrialExpiredWrap>
                <TrialExpiredContainer>
                    {trialExpiredArt}
                    <TrialExpiredTitle>{i18nFilter()("trial_expired.title")}</TrialExpiredTitle>
                    <TrialExpiredText>
                        {i18nFilter()("trial_expired.subtitle")}
                        <br />
                        {i18nFilter()("trial_expired.text")}
                    </TrialExpiredText>
                    <TrialExpiredButton
                        type="trial"
                        onClick={() => {
                            this.onTrialExpiredClick();
                            allTrackers.trackEvent(
                                "solution trial end screen",
                                "click",
                                "talk to us",
                            );
                        }}
                    >
                        {i18nFilter()("trial_expired.button.text")}
                    </TrialExpiredButton>
                    <TrialExpiredText>
                        {i18nFilter()("trial_expired.tip.text")}
                        &nbsp;
                        <TrialExpiredLink onClick={this.onTipLinkClick}>
                            {i18nFilter()("trial_expired.tip.link")}
                        </TrialExpiredLink>
                    </TrialExpiredText>
                </TrialExpiredContainer>
            </TrialExpiredWrap>
        );
    }

    private onTrialExpiredClick = () => {
        this.setState(
            {
                isContactUsModalOpen: false,
            },
            () => {
                openUnlockModal(
                    {
                        modal: "Default",
                        slide: "Default",
                    },
                    `${LocationService.getCurrentLocation()}/TrialExpired`,
                );
            },
        );
    };

    private onTipLinkClick = () => {
        const searchInput: HTMLImageElement = document.querySelector(".universalInput-input");
        if (searchInput) {
            searchInput.focus();
        }
        allTrackers.trackEvent("solution trial end screen", "click", "basic feature");
    };
}
