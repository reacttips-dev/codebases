/** @similarweb IMPORT */
import { IconButton } from "@similarweb/ui-components/dist/button";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { ProModal } from "components/Modals/src/ProModal";
import I18n from "components/React/Filters/I18n";
import { allTrackers } from "services/track/track";

/** Global IMPORT */
import React, { FC, useEffect, useState } from "react";
import styled from "styled-components";

import {
    SUBSCRIBE_FROM_TOP_BUTTON,
    UNSUBSCRIBE_CANCEL,
    UNSUBSCRIBE_CONFIRMED,
} from "../constants/constants";
import "./EmailDigestContainer.scss";
import { UnsubscribeConfirm } from "./PopUpModal/Unsubscribe/UnsubscribeConfirm";

export const SubscribedContainer = styled.div`
    margin: 0;
`;

const ProModalCustomStyles = {
    content: {
        width: "475px",
        padding: "24px",
    },
};

interface IEmailDigestContainer {
    isImpersonateMode: boolean;
    sizeCurrentLeads: number;
    isSubscriptionActive: boolean;
    isShowUnsubscribeFromUrl: boolean;
    onCloseUnsubscribeEmailDigestModal: (typeOfTrackEvent: string) => void;
    onSubscribeEmailDigest: (isSubscribe: boolean, typeOfTrackEvent: string) => void;
}

export const EmailDigestContainer: FC<IEmailDigestContainer> = ({
    isImpersonateMode,
    sizeCurrentLeads,
    isSubscriptionActive = false,
    isShowUnsubscribeFromUrl,
    onCloseUnsubscribeEmailDigestModal,
    onSubscribeEmailDigest,
}) => {
    const [showUnsubscrideModal, setShowUnsubscrideModal] = useState<boolean>(false);
    const [showedUnsubscribeModalFromUrl, setShowedUnsubscribeModalFromUrl] = useState<boolean>(
        false,
    );
    const [isUserSubscribe, setIsUserSubscribe] = useState<boolean>(isSubscriptionActive);

    useEffect(() => {
        if (isShowUnsubscribeFromUrl && isSubscriptionActive && !showedUnsubscribeModalFromUrl) {
            setShowedUnsubscribeModalFromUrl(true);
            setShowUnsubscrideModal(true);
            allTrackers.trackEvent(
                "Pop up",
                "open",
                "List email update/unsubscribe from top button",
                sizeCurrentLeads,
            );
        }

        setIsUserSubscribe(isSubscriptionActive);
    }, [isSubscriptionActive, isShowUnsubscribeFromUrl]);

    const onClickBtnSubscribe = async () => {
        if (isImpersonateMode) {
            return;
        }

        if (isUserSubscribe) {
            setShowUnsubscrideModal(true);
            allTrackers.trackEvent(
                "Pop up",
                "open",
                "List email update/unsubscribe from top button",
                sizeCurrentLeads,
            );
        } else {
            await onSubscribeEmailDigest(true, SUBSCRIBE_FROM_TOP_BUTTON);
            setShowedUnsubscribeModalFromUrl(true);
        }
    };

    const onClickUnsubscribeBtn = async () => {
        setShowUnsubscrideModal(false);
        await onSubscribeEmailDigest(false, UNSUBSCRIBE_CONFIRMED);
    };

    const onClickCancelBtn = async () => {
        setShowUnsubscrideModal(false);
        await onCloseUnsubscribeEmailDigestModal(UNSUBSCRIBE_CANCEL);
    };

    return (
        <>
            <PlainTooltip
                placement={"bottom"}
                maxWidth={350}
                tooltipContent={
                    <>
                        <div className="tipTitle">
                            <I18n>workspace.sales.email.digest.tooltip.title</I18n>
                        </div>
                        <div className="tipSubtitle">
                            <I18n>workspace.sales.email.digest.tooltip.subtitle</I18n>
                        </div>
                    </>
                }
            >
                <SubscribedContainer
                    data-automation-icon-name="subscribe"
                    onClick={onClickBtnSubscribe}
                >
                    <IconButton
                        isDisabled={isImpersonateMode}
                        type="flat"
                        iconName={isUserSubscribe ? "checked" : "mail"}
                    >
                        {isUserSubscribe ? (
                            <I18n>workspace.sales.email.digest.button.subscribed</I18n>
                        ) : (
                            <I18n>workspace.sales.email.digest.button.subscribe</I18n>
                        )}
                    </IconButton>
                </SubscribedContainer>
            </PlainTooltip>
            <ProModal
                customStyles={ProModalCustomStyles}
                showCloseIcon={false}
                isOpen={showUnsubscrideModal}
            >
                <UnsubscribeConfirm
                    onClickUnsubscribeCancel={onClickCancelBtn}
                    onClickUnsubscribe={onClickUnsubscribeBtn}
                />
            </ProModal>
        </>
    );
};
