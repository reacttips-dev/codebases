import React from "react";
import { ProModal } from "components/Modals/src/ProModal";
import { Button } from "@similarweb/ui-components/dist/button";
import { Textfield } from "@similarweb/ui-components/dist/textfield";
import { useTranslation } from "components/WithTranslation/src/I18n";
import dateTimeService from "services/date-time/dateTimeService";
import { SavedSearchDto } from "../../../types/common";
import {
    getSearchCreatedTimeText,
    isSearchNameLongEnough,
} from "pages/sales-intelligence/sub-modules/saved-searches/helpers";
import { SEARCH_DOMAINS_ADDED_TO_LISTS_KEY } from "pages/sales-intelligence/sub-modules/saved-searches/constants/translation-keys";
import SavedSearchConfirmDeleteModal from "../../../../saved-searches/components/SavedSearchConfirmDeleteModal/SavedSearchConfirmDeleteModal";
import {
    CUSTOM_MODAL_STYLES,
    StyledModalContent,
    StyledModalBody,
    StyledSearchSaveCancelButtons,
    StyledSearchSettingsModalFooter,
    StyledModalSubtitle,
    StyledModalTitle,
    StyledNameInputContainer,
    StyledNameInputLabel,
} from "./styles";

type SavedSearchSettingsModalProps = {
    isOpened: boolean;
    updating: boolean;
    deleting: boolean;
    savedSearch: SavedSearchDto;
    onClose(): void;
    onDelete(): void;
    onSave(name: SavedSearchDto["name"]): void;
};

const SavedSearchSettingsModal = (props: SavedSearchSettingsModalProps) => {
    const translate = useTranslation();
    const { isOpened, updating, deleting, savedSearch, onClose, onDelete, onSave } = props;
    const [searchName, setSearchName] = React.useState(savedSearch.name);
    const [isConfirmModalOpened, setIsConfirmModalOpened] = React.useState(false);
    const nameIsLongEnough = isSearchNameLongEnough(searchName);
    const createdText = React.useMemo(() => {
        return getSearchCreatedTimeText(
            dateTimeService.getDateDiffFromNow(savedSearch.createdDate, "months"),
            translate,
        );
    }, [savedSearch]);

    const closeConfirmModal = () => setIsConfirmModalOpened(false);

    const handleConfirm = () => {
        closeConfirmModal();
        onDelete();
    };

    const handleSave = () => {
        const trimmedName = searchName.trim();

        if (trimmedName === savedSearch.name) {
            return onClose();
        }

        if (nameIsLongEnough) {
            onSave(trimmedName);
        }
    };

    return (
        <ProModal
            isOpen={isOpened}
            showCloseIcon={false}
            shouldCloseOnOverlayClick={false}
            customStyles={CUSTOM_MODAL_STYLES}
        >
            <StyledModalContent>
                <StyledModalBody>
                    <StyledModalTitle>{savedSearch.name}</StyledModalTitle>
                    <StyledModalSubtitle>
                        <span>
                            {createdText}
                            &nbsp;&#8226;&nbsp;
                            {translate(SEARCH_DOMAINS_ADDED_TO_LISTS_KEY, {
                                numberOfDomains: savedSearch.totalNumberOfWebsites,
                            })}
                        </span>
                    </StyledModalSubtitle>
                    <StyledNameInputContainer>
                        <StyledNameInputLabel>
                            <span>{translate("si.components.save_search_modal.input_label")}</span>
                        </StyledNameInputLabel>
                        <Textfield
                            autoFocus
                            maxLength={100}
                            onChange={setSearchName}
                            defaultValue={searchName}
                            dataAutomation="si-components-save-search-settings-modal-input"
                        />
                    </StyledNameInputContainer>
                </StyledModalBody>
                <StyledSearchSettingsModalFooter>
                    <Button
                        isLoading
                        type="flatWarning"
                        isDisabled={deleting || updating}
                        onClick={() => setIsConfirmModalOpened(true)}
                    >
                        {translate("si.components.save_search_modal.button.delete")}
                    </Button>
                    <StyledSearchSaveCancelButtons>
                        <Button type="flat" onClick={onClose}>
                            {translate("si.components.save_search_modal.button.cancel")}
                        </Button>
                        <Button
                            type="primary"
                            isLoading={updating}
                            onClick={handleSave}
                            isDisabled={!nameIsLongEnough || updating || deleting}
                        >
                            {translate("si.components.save_search_modal.button.save")}
                        </Button>
                    </StyledSearchSaveCancelButtons>
                </StyledSearchSettingsModalFooter>
            </StyledModalContent>
            <SavedSearchConfirmDeleteModal
                name={savedSearch.name}
                onCancel={closeConfirmModal}
                onConfirm={handleConfirm}
                isOpen={isConfirmModalOpened}
                numberOfResults={savedSearch.totalNumberOfWebsites}
            />
        </ProModal>
    );
};

export default SavedSearchSettingsModal;
