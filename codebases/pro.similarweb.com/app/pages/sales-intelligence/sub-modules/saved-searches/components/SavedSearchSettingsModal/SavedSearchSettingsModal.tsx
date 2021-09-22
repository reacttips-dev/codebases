import React from "react";
import { ProModal } from "components/Modals/src/ProModal";
import { Button } from "@similarweb/ui-components/dist/button";
import { Textfield } from "@similarweb/ui-components/dist/textfield";
import { useTranslation } from "components/WithTranslation/src/I18n";
import {
    getSearchCreatedDate,
    getSearchCreatedTimeText,
    getSearchName,
    isSearchNameLongEnough,
    getSearchUsedResultCount,
    getSearchResultCount,
} from "../../helpers";
import { SavedSearchType } from "../../types";
import dateTimeService from "services/date-time/dateTimeService";
import { SEARCH_DOMAINS_ADDED_TO_LISTS_KEY } from "../../constants/translation-keys";
import { StyledSearchSettingsModalFooter, StyledSearchSaveCancelButtons } from "./styles";
import SavedSearchConfirmDeleteModal from "../SavedSearchConfirmDeleteModal/SavedSearchConfirmDeleteModal";
import {
    StyledModalBody,
    StyledModalContent,
    StyledModalSubtitle,
    StyledModalTitle,
    StyledNameInputContainer,
    StyledNameInputLabel,
} from "../NewSavedSearchModal/styles";

type SavedSearchSettingsModalProps = {
    isOpen: boolean;
    updating: boolean;
    deleting: boolean;
    savedSearch: SavedSearchType;
    onSave(name: string): void;
    onClose(): void;
    onDelete(): void;
};

const CUSTOM_SETTINGS_MODAL_STYLES = {
    content: { padding: 0, width: 460 },
};
const SavedSearchSettingsModal = (props: SavedSearchSettingsModalProps) => {
    const translate = useTranslation();
    const { isOpen, savedSearch, updating, deleting, onSave, onClose, onDelete } = props;
    const name = getSearchName(savedSearch);
    const [searchName, setSearchName] = React.useState(name);
    const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] = React.useState(false);
    const nameIsLongEnough = isSearchNameLongEnough(searchName);

    const closeConfirmModal = React.useCallback(() => setDeleteConfirmationModalOpen(false), []);
    const createdText = React.useMemo(() => {
        return getSearchCreatedTimeText(
            dateTimeService.getDateDiffFromNow(getSearchCreatedDate(savedSearch), "months"),
            translate,
        );
    }, [savedSearch]);

    function handleDeleteConfirm() {
        closeConfirmModal();
        onDelete();
    }

    function handleSave() {
        const trimmedName = searchName.trim();

        if (trimmedName === name) {
            return onClose();
        }

        if (nameIsLongEnough) {
            onSave(trimmedName);
        }
    }

    return (
        <ProModal
            isOpen={isOpen}
            showCloseIcon={false}
            customStyles={CUSTOM_SETTINGS_MODAL_STYLES}
            shouldCloseOnOverlayClick={false}
        >
            <StyledModalContent>
                <StyledModalBody>
                    <StyledModalTitle>{name}</StyledModalTitle>
                    <StyledModalSubtitle>
                        <span>
                            {createdText}
                            &nbsp;&#8226;&nbsp;
                            {translate(SEARCH_DOMAINS_ADDED_TO_LISTS_KEY, {
                                numberOfDomains: getSearchUsedResultCount(savedSearch),
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
                        type="flatWarning"
                        isLoading={true}
                        isDisabled={deleting || updating}
                        onClick={() => setDeleteConfirmationModalOpen(true)}
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
                name={name}
                onCancel={closeConfirmModal}
                onConfirm={handleDeleteConfirm}
                isOpen={deleteConfirmationModalOpen}
                numberOfResults={getSearchResultCount(savedSearch)}
            />
        </ProModal>
    );
};

export default SavedSearchSettingsModal;
