import React from "react";
import { ProModal } from "components/Modals/src/ProModal";
import { Button } from "@similarweb/ui-components/dist/button";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { getUniqueId } from "pages/sales-intelligence/helpers/common";
import { InclusionEnum } from "../../../../../common-components/dropdown/InclusionDropdown/InclusionDropdown";
import TechnologiesDropdownContainer from "../TechnologiesDropdown/TechnologiesDropdownContainer";
import TechnologiesRadioButtons from "../TechnologiesRadioButtons/TechnologiesRadioButtons";
import TechnologiesModalChips from "../TechnologiesModalChips/TechnologiesModalChips";
import { doesNotMatchGivenConditionEntry, toEntryNameWithType } from "../../../helpers/filters";
import { arraysHaveSamePrimitiveValues } from "pages/sales-intelligence/helpers/helpers";
import {
    TechnologiesCondition,
    TechnologiesConditionEntry,
} from "../../../filters/technology/types";
import {
    CUSTOM_MODAL_STYLES,
    StyledButtonsContainer,
    StyledModalContent,
    StyledMainContainer,
    StyledHeader,
    StyledTitle,
    StyledSubtitle,
    StyledDDContainer,
    StyledChipsContainer,
    StyledSelectionContainer,
} from "./styles";

type TechnologiesModalProps = {
    isOpened: boolean;
    isExcludeAvailable: boolean;
    selected: TechnologiesCondition | null;
    onCancel(): void;
    onApply(condition: TechnologiesCondition): void;
};

const TechnologiesModal = (props: TechnologiesModalProps) => {
    const translate = useTranslation();
    const { isOpened, selected, isExcludeAvailable, onCancel, onApply } = props;
    const [inclusion, setInclusion] = React.useState(
        selected?.inclusion ?? InclusionEnum.includeOnly,
    );
    const [currentCondition, setCurrentCondition] = React.useState(selected);
    const entries = currentCondition?.entries ?? [];

    const isApplyDisabled = () => {
        if (currentCondition === null || currentCondition.entries.length === 0) {
            return true;
        }

        if (inclusion !== selected?.inclusion) {
            return false;
        }

        return arraysHaveSamePrimitiveValues(
            (selected?.entries ?? []).map(toEntryNameWithType),
            currentCondition.entries.map(toEntryNameWithType),
        );
    };

    const handleCancel = () => {
        onCancel();
    };

    const handleApply = () => {
        onApply(currentCondition);
    };

    const handleChipRemove = (item: TechnologiesConditionEntry) => {
        const entries = currentCondition.entries.filter(doesNotMatchGivenConditionEntry(item));

        setCurrentCondition((prev) => ({ ...prev, entries }));
    };

    const handleItemSelection = (item: TechnologiesConditionEntry) => {
        const alreadyAdded = currentCondition.entries.some(
            (e) => e.name === item.name && item.type === e.type,
        );
        let newEntries: TechnologiesConditionEntry[] = [];

        if (alreadyAdded) {
            newEntries = currentCondition.entries.filter(doesNotMatchGivenConditionEntry(item));
        } else {
            newEntries = currentCondition.entries.concat(item);
        }

        setCurrentCondition(({ id, inclusion }) => ({ id, inclusion, entries: newEntries }));
    };

    React.useEffect(() => {
        if (!isOpened) {
            setTimeout(() => {
                setInclusion(InclusionEnum.includeOnly);
            }, 0);
        } else {
            setCurrentCondition({ id: getUniqueId(), inclusion, entries: [] });
        }
    }, [isOpened]);

    React.useEffect(() => {
        setCurrentCondition(selected);
        setInclusion(selected?.inclusion ?? InclusionEnum.includeOnly);
    }, [selected]);

    React.useEffect(() => {
        setCurrentCondition((prev) => ({
            entries: prev?.entries ?? [],
            id: prev?.id ?? getUniqueId(),
            inclusion,
        }));
    }, [inclusion]);

    return (
        <ProModal
            isOpen={isOpened}
            showCloseIcon={false}
            shouldCloseOnOverlayClick={false}
            customStyles={CUSTOM_MODAL_STYLES}
        >
            <StyledModalContent>
                <StyledHeader>
                    <StyledTitle>{translate("si.components.technologies_modal.title")}</StyledTitle>
                    <StyledSubtitle>
                        {translate("si.components.technologies_modal.subtitle")}
                    </StyledSubtitle>
                </StyledHeader>
                <StyledMainContainer>
                    <TechnologiesRadioButtons
                        onSelect={setInclusion}
                        selectedInclusion={inclusion}
                        isExcludeAvailable={isExcludeAvailable}
                    />
                    <StyledSelectionContainer
                        hasBorder={entries.length > 0}
                        hasPadding={entries.length > 0}
                    >
                        <StyledChipsContainer>
                            <TechnologiesModalChips
                                items={entries}
                                onChipRemove={handleChipRemove}
                            />
                        </StyledChipsContainer>
                        <StyledDDContainer hasMargin={entries.length > 0}>
                            <TechnologiesDropdownContainer
                                selectedEntries={entries}
                                onSelect={handleItemSelection}
                            />
                        </StyledDDContainer>
                    </StyledSelectionContainer>
                </StyledMainContainer>
                <StyledButtonsContainer>
                    <Button
                        type="flat"
                        onClick={handleCancel}
                        dataAutomation="technologies-modal-button-cancel"
                    >
                        {translate("si.common.button.cancel")}
                    </Button>
                    <Button
                        onClick={handleApply}
                        isDisabled={isApplyDisabled()}
                        dataAutomation="technologies-modal-button-apply"
                    >
                        {translate(
                            `si.components.technologies_modal.button.${
                                selected !== null ? "update" : "create"
                            }`,
                        )}
                    </Button>
                </StyledButtonsContainer>
            </StyledModalContent>
        </ProModal>
    );
};

export default TechnologiesModal;
