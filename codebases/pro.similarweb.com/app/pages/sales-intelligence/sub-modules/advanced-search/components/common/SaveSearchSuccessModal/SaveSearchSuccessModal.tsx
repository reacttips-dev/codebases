import React from "react";
import { ProModal } from "components/Modals/src/ProModal";
import { Button } from "@similarweb/ui-components/dist/button";
import { useTranslation } from "components/WithTranslation/src/I18n";
import {
    StyledHeader,
    StyledModalContent,
    StyledSubtitle,
    StyledTitle,
    StyledMainContainer,
    StyledImageContainer,
    StyledButtonsContainer,
    CUSTOM_MODAL_STYLES,
} from "./styles";
import { AssetsService } from "services/AssetsService";

type SaveSearchSuccessModalProps = {
    isOpened: boolean;
    onSubmitClick(): void;
};

const SaveSearchSuccessModal = (props: SaveSearchSuccessModalProps) => {
    const translate = useTranslation();
    const { isOpened, onSubmitClick } = props;

    return (
        <ProModal
            isOpen={isOpened}
            showCloseIcon={false}
            shouldCloseOnOverlayClick={false}
            customStyles={CUSTOM_MODAL_STYLES}
        >
            <StyledModalContent>
                <StyledHeader>
                    <StyledTitle>
                        {translate("si.components.save_search_success_modal.title")}
                    </StyledTitle>
                    <StyledSubtitle>
                        {translate("si.components.save_search_success_modal.subtitle")}
                    </StyledSubtitle>
                </StyledHeader>
                <StyledMainContainer>
                    <StyledImageContainer>
                        <img
                            alt="save search success picture"
                            src={AssetsService.assetUrl(
                                "/images/sales-intelligence/save-search-success.svg",
                            )}
                        />
                    </StyledImageContainer>
                </StyledMainContainer>
                <StyledButtonsContainer>
                    <Button
                        onClick={onSubmitClick}
                        dataAutomation="save-search-success-modal-button-submit"
                    >
                        {translate("si.components.save_search_success_modal.button.submit")}
                    </Button>
                </StyledButtonsContainer>
            </StyledModalContent>
        </ProModal>
    );
};

export default SaveSearchSuccessModal;
