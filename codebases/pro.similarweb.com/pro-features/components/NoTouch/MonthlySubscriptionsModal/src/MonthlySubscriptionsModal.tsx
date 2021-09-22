import { Button } from "@similarweb/ui-components/dist/button";
import { ProModal } from "components/Modals/src/ProModal";
import { i18nFilter } from "filters/ngFilters";
import React, { useEffect } from "react";
import { AssetsService } from "services/AssetsService";
import { allTrackers } from "services/track/track";
import { StyledContent, StyledHeader, StyledSubtitle, StyledTitle } from "./StyledComponents";

const proModalStyles = {
    overlay: {},
    content: {
        overflow: "hidden",
        width: "700px",
        padding: 0,
    },
};

interface IMonthlySubscriptionsModalProps {
    isOpen?: boolean;
    onClose: () => void;
    workspace: string;
    purchaseUrl: string;
}

const MonthlySubscriptionsModal: React.FunctionComponent<IMonthlySubscriptionsModalProps> = (
    props,
) => {
    const { isOpen, onClose, workspace, purchaseUrl } = props;
    const translate = i18nFilter();

    useEffect(() => {
        if (isOpen) {
            allTrackers.trackEvent("nt pushed popup", "shown", "popup displayed");
        }
    }, [isOpen]);

    return (
        <ProModal
            isOpen={isOpen}
            shouldCloseOnOverlayClick={false}
            customStyles={proModalStyles}
            onCloseClick={() => {
                onClose();
                allTrackers.trackEvent("nt pushed popup", "click", "close");
            }}
        >
            <StyledHeader>
                <img src={AssetsService.assetUrl("/images/monthly-subscriptions.svg")} alt="" />
            </StyledHeader>
            <StyledContent>
                <StyledTitle>{translate("no_touch_monthly_subscriptions_modal.title")}</StyledTitle>
                <StyledSubtitle>
                    {translate("no_touch_monthly_subscriptions_modal.subtitle")}
                </StyledSubtitle>
                <a
                    href={purchaseUrl}
                    target="_blank"
                    onClick={() => {
                        allTrackers.trackEvent(
                            "nt pushed popup",
                            "click",
                            `Buy NT/go to payment page/${workspace}`,
                        );
                    }}
                >
                    <Button type="primary">
                        {translate("no_touch_monthly_subscriptions_modal.button.text")}
                    </Button>
                </a>
            </StyledContent>
        </ProModal>
    );
};

MonthlySubscriptionsModal.defaultProps = {
    onClose: () => undefined,
};

export default MonthlySubscriptionsModal;
