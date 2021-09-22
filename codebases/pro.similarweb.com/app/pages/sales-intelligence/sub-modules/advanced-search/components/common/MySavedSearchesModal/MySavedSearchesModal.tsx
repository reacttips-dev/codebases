import React from "react";
import { ProModal } from "components/Modals/src/ProModal";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { SimplifiedSavedSearchDto } from "../../../types/common";
import SavedSearchListItem from "../SavedSearchListItem/SavedSearchListItem";
import { StyledSubTitle } from "../NewSearchModal/styles";
import {
    CUSTOM_MODAL_STYLES,
    StyledModalContent,
    StyledTitleContainer,
    StyledTitle,
    StyledItemsContainer,
} from "./styles";

type MySavedSearchesModalProps = {
    isOpened: boolean;
    savedSearches: SimplifiedSavedSearchDto[];
    onClose(): void;
    onExistingSearchClick(id: string): void;
};

const MySavedSearchesModal = (props: MySavedSearchesModalProps) => {
    const translate = useTranslation();
    const { isOpened, savedSearches, onClose, onExistingSearchClick } = props;

    const handleItemClick = (item: SimplifiedSavedSearchDto) => {
        onExistingSearchClick(item.searchId);
    };

    return (
        <ProModal
            isOpen={isOpened}
            onCloseClick={onClose}
            shouldCloseOnOverlayClick={false}
            customStyles={CUSTOM_MODAL_STYLES}
        >
            <StyledModalContent>
                <StyledTitleContainer>
                    <StyledTitle>
                        {translate("si.advanced_search.saved_searches_modal.title")}
                    </StyledTitle>
                    <StyledSubTitle>
                        {translate("si.advanced_search.saved_searches_modal.subtitle")}
                    </StyledSubTitle>
                </StyledTitleContainer>
                <StyledItemsContainer>
                    {savedSearches.map((savedSearch) => (
                        <SavedSearchListItem
                            iconName="aim-icon"
                            key={savedSearch.searchId}
                            savedSearch={savedSearch}
                            onClick={handleItemClick}
                        />
                    ))}
                </StyledItemsContainer>
            </StyledModalContent>
        </ProModal>
    );
};

export default MySavedSearchesModal;
