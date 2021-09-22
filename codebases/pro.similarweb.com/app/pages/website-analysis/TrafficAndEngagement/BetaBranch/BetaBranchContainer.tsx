import SWReactRootComponent from "decorators/SWReactRootComponent";
import React, { useCallback, useMemo, useState } from "react";
import BetaBranchOptInBanner from "pages/website-analysis/TrafficAndEngagement/BetaBranch/BetaBranchOptInBanner";
import BetaBranchFeedbackSurvey from "pages/website-analysis/TrafficAndEngagement/BetaBranch/BetaBranchFeedbackSurvey";
import { ThankYouModal } from "components/OptIn/components/ThankYouModal";
import { Injector } from "common/ioc/Injector";
import { ThankYouModalImage } from "pages/website-analysis/TrafficAndEngagement/BetaBranch/ThankYouModalImage";
import { allTrackers } from "services/track/track";
import { ResetBetaBranchFlagModal } from "pages/website-analysis/TrafficAndEngagement/BetaBranch/ResetBetaBranchFlagModal";
import { connect } from "react-redux";
import {
    estimatedVsGaSwitchToggle,
    hideWebsourceTooltip,
    toggleResetBetaBranchModal,
} from "actions/commonActions";

export const BetaBranchContext = React.createContext(undefined);
const betaBranchContainer = (props) => {
    const { isResetBetaModalOpen } = props;
    const [isBetaBranchFeedbackSurveyOpen, setIsBetaBranchFeedbackSurveyOpen] = useState(false);
    const [isBetaBranchThankUModalOpen, setIsBetaBranchThankUModalOpen] = useState(false);
    const onCloseThankUModal = useCallback(() => {
        setIsBetaBranchThankUModalOpen(false);
    }, []);

    const onGAButtonClick = useCallback(() => {
        setIsBetaBranchThankUModalOpen(false);
        const $modal = Injector.get<any>("$modal");
        allTrackers.trackEvent("Connect GA", "open", `Connect GA`);
        $modal.open({
            templateUrl: "/app/components/GA-verify/ga-wizard.html",
            controller: "gaVerifyModalCtrl",
            windowClass: "ga-modal",
        });
    }, []);

    const { chosenSitesService } = React.useMemo(
        () => ({
            chosenSitesService: Injector.get("chosenSites") as any,
        }),
        [],
    );
    const { hasGaToken, privacyStatus } = chosenSitesService.getPrimarySite() as any;

    const thankYouModalProps = {
        title: "beta.branch.feedback.thank.you.modal.title",
        closeLabel: "beta.branch.feedback.thank.you.modal.close.label",
        gaButtonLabel: "beta.branch.feedback.thank.you.modal.gabutton.label",
        ThankUModalImage: ThankYouModalImage,
        hasGaToken,
        privacyStatus,
        onCloseClick: onCloseThankUModal,
        onGAButtonClick,
    };

    const onCloseResetClick = useCallback(() => {
        props.closeResetBetaBranchModal();
    }, []);

    const onContinueResetModalClick = useCallback(() => {
        props.closeResetBetaBranchModal();
        Injector.get("swNavigator").updateParams(isResetBetaModalOpen.updateParams);
    }, [isResetBetaModalOpen]);

    const resetBetaBranchProps = {
        title: "beta.branch.reset.modal.title",
        subtitle: "beta.branch.reset.modal.subtitle",
        onCloseClick: onCloseResetClick,
        onContinueClick: onContinueResetModalClick,
        continueLabel: "beta.branch.reset.modal.continue.label",
        closeLabel: "beta.branch.reset.modal.close.label",
    };
    return (
        <BetaBranchContext.Provider
            value={{
                isBetaBranchFeedbackSurveyOpen,
                setIsBetaBranchFeedbackSurveyOpen,
                setIsBetaBranchThankUModalOpen,
            }}
        >
            <BetaBranchOptInBanner />
            <BetaBranchFeedbackSurvey />
            <ThankYouModal isOpen={isBetaBranchThankUModalOpen} {...thankYouModalProps} />
            <ResetBetaBranchFlagModal
                isOpen={isResetBetaModalOpen?.isOpen}
                {...resetBetaBranchProps}
            />
        </BetaBranchContext.Provider>
    );
};

function mapDispatchToProps(dispatch) {
    return {
        closeResetBetaBranchModal: () => {
            dispatch(toggleResetBetaBranchModal(false, undefined));
        },
    };
}

function mapStateToProps({ common: { isResetBetaModalOpen } }) {
    return {
        isResetBetaModalOpen,
    };
}

export default SWReactRootComponent(
    connect(mapStateToProps, mapDispatchToProps)(betaBranchContainer),
    "BetaBranchContainer",
);
