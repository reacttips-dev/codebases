import { ProModal } from "components/Modals/src/ProModal";
import React, { FC, useEffect, useMemo, useState } from "react";
import { IRelatedSearchTerm } from "services/relatedSearchTerms/RelatedSearchTermsServiceTypes";
import { colorsPalettes } from "@similarweb/styles/";
import { Pill } from "components/Pill/Pill";
import { i18nFilter } from "filters/ngFilters";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { RelatedSearchTermsList } from "pages/keyword-analysis/RelatedSearchTerms/RelatedSearchTermsModal/RelatedSearchTermsList/RelatedSearchTermsList";
import {
    ModalContentContainer,
    HeaderTextfield,
    ModalBanner,
    BannerText,
    ModalButtonsContainer,
} from "pages/keyword-analysis/RelatedSearchTerms/RelatedSearchTermsModal/RelatedSearchTermsModalStyles";
import { IRelatedSearchTermsModalProps } from "./RelatedSearchTermsModalTypes";
import { Button } from "@similarweb/ui-components/dist/button";
import {
    HeaderTextContainer,
    HeaderErrorMessage,
} from "pages/keyword-analysis/RelatedSearchTerms/RelatedSearchTermsModal/RelatedSearchTermsModalStyles";
import { adaptRelatedSearchTerms } from "../Utils/RelatedSearchTermsUtils";
import { HeaderErrorMessageContainer } from "pages/keyword-analysis/RelatedSearchTerms/RelatedSearchTermsModal/RelatedSearchTermsModalStyles";
import { SWReactIcons } from "@similarweb/icons";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { KeywordGroupEditorHelpers } from "pages/keyword-analysis/KeywordGroupEditorHelpers";
import { useDidMountEffect } from "custom-hooks/useDidMountEffect";
import { keywordsGroupService } from "services/keywordsGroup/keywordsGroupService";

export const RelatedSearchTermsModal: FC<IRelatedSearchTermsModalProps> = (props) => {
    const {
        isOpen,
        isLoading,
        isSavingGroupInProgress,
        selectedKeyword,
        relatedSearchTerms,
        onCloseClick,
        onSaveClick,
    } = props;

    /**
     * a sub set of the related search terms - this is the list of the user-picked related search terms.
     */
    const [selectedSearchTerms, setSelectedSearchTerms] = useState<IRelatedSearchTerm[]>();
    const defaultGroupName = keywordsGroupService.generateGroupNameFromKeyword(
        `${selectedKeyword[0]?.toUpperCase() + selectedKeyword.slice(1)} List`,
    );
    const [groupName, setGroupName] = useState<string>(defaultGroupName);
    const [isEditingGroupName, setIsEditingGroupName] = useState(false);

    const [hasErrorWithGroupName, setHasErrorWithGroupName] = useState(false);
    const [groupNameErrorMsg, setGroupNameErrorMsg] = useState("");

    const services = useMemo(() => {
        return {
            translate: i18nFilter(),
            tracking: TrackWithGuidService,
        };
    }, []);

    /**
     * Initialize the related search terms list when rendering the modal right after receiving
     * initial data from the API.
     */
    useEffect(() => {
        if (!selectedSearchTerms) {
            populateSelectedTermsFromData();
        }
    }, [selectedKeyword, relatedSearchTerms, selectedSearchTerms]);

    useDidMountEffect(() => {
        if (!isOpen) {
            setGroupName(defaultGroupName);
            setHasErrorWithGroupName(false);
            setGroupNameErrorMsg("");
            populateSelectedTermsFromData();
        }
    }, [isOpen]);

    const populateSelectedTermsFromData = () => {
        if (relatedSearchTerms) {
            const initialSelectedTerms = adaptRelatedSearchTerms(
                selectedKeyword,
                relatedSearchTerms,
            );
            setSelectedSearchTerms(initialSelectedTerms);
        }
    };

    const handleRemoveSearchTerm = (termToRemove: IRelatedSearchTerm) => {
        const updatedSearchTerms = selectedSearchTerms?.filter(
            (term) => term.keyword !== termToRemove.keyword,
        );
        setSelectedSearchTerms(updatedSearchTerms);
    };

    const handleGroupNameChange = (updatedName: string) => {
        setGroupName(updatedName);

        const validationResult = KeywordGroupEditorHelpers.validateTitle(updatedName);
        setHasErrorWithGroupName(!validationResult.isValid);
        setGroupNameErrorMsg(validationResult.errorMessage ?? "");
    };

    const handleSaveKeywordsGroup = () => {
        const validationResult = KeywordGroupEditorHelpers.validateTitle(groupName);
        if (!validationResult.isValid) {
            setHasErrorWithGroupName(true);
            setGroupNameErrorMsg(validationResult.errorMessage);
            return;
        }

        const keywordsToSave = selectedSearchTerms.map((term) => term.keyword);
        onSaveClick(keywordsToSave, groupName);
    };

    const isSaveButtonDisabled = useMemo(() => {
        // In case the modal loads the api data, or in case the user already clicked
        // the save button, then it should be disabled
        if (isLoading || isSavingGroupInProgress) return true;

        // In case the title has an error, then the user shouldn't be allowed to save
        if (hasErrorWithGroupName) return true;

        // In case no selected terms are present (besides the selected keyword)
        if (!selectedSearchTerms || selectedSearchTerms.length <= 1) return true;

        return false;
    }, [isLoading, isSavingGroupInProgress, hasErrorWithGroupName, selectedSearchTerms]);

    // While ProModal has the property "isOpen",
    // it still needs to render all internal components
    // thus creating a performance hit. we want to avoid
    // rendering it entirely as long as its not open.
    if (!isOpen) {
        return null;
    }

    return (
        <ProModal
            isOpen={isOpen}
            onCloseClick={onCloseClick}
            shouldCloseOnOverlayClick={!isSavingGroupInProgress}
            showCloseIcon={true}
            customStyles={{
                content: {
                    width: "600px",
                },
            }}
        >
            <ModalContentContainer>
                <HeaderTextContainer>
                    <HeaderTextfield
                        hasError={hasErrorWithGroupName}
                        isFocused={isEditingGroupName}
                        onChange={handleGroupNameChange}
                        hideBorder={true}
                        onFocus={() => setIsEditingGroupName(true)}
                        onBlur={() => setIsEditingGroupName(false)}
                        defaultValue={groupName}
                    />
                    {hasErrorWithGroupName && (
                        <HeaderErrorMessageContainer>
                            <SWReactIcons iconName="alert-circle" size="xs" />
                            <HeaderErrorMessage>{groupNameErrorMsg}</HeaderErrorMessage>
                        </HeaderErrorMessageContainer>
                    )}
                </HeaderTextContainer>
                <ModalBanner
                    title={
                        <FlexRow alignItems={"center"}>
                            <Pill
                                text={services.translate("new.label.pill")}
                                backgroundColor={colorsPalettes.orange[400]}
                            />
                            <BannerText>
                                {services.translate("related.search.terms.modal.banner")}
                            </BannerText>
                        </FlexRow>
                    }
                />
                <RelatedSearchTermsList
                    isLoading={isLoading}
                    isSavingGroupInProgress={isSavingGroupInProgress}
                    selectedKeyword={selectedKeyword}
                    relatedSearchTerms={selectedSearchTerms}
                    totalAvailableSearchTerms={relatedSearchTerms?.length}
                    onRemoveRelatedSearchTerm={handleRemoveSearchTerm}
                />
                <ModalButtonsContainer>
                    <Button
                        type="primary"
                        onClick={handleSaveKeywordsGroup}
                        isDisabled={isSaveButtonDisabled}
                        isLoading={isSavingGroupInProgress}
                    >
                        {services.translate("related.search.terms.modal.button")}
                    </Button>
                </ModalButtonsContainer>
            </ModalContentContainer>
        </ProModal>
    );
};
