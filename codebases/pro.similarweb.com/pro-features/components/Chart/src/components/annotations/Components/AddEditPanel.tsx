import {
    ActionBarContainer,
    ActionBarEditContainer,
    AnnotationButton,
    AddEditPanelContainer,
    AddEditBody,
    BackButton,
    AddEditTextarea,
    AddEditPanelHeader,
    HeaderTextPanel,
    AddEditPanelContent,
    AnnotationDeleteButton,
} from "./StyledComponents";
import { SWReactIcons } from "@similarweb/icons";
import { i18nFilter } from "filters/ngFilters";
/*
 * This is the panel to add or edit annotation text mainly
 * This panel is the same for adding annotation from
 * moving add annotation button or when clicking add or edit from AnnotationCallout
 * that display the AnnotationsPanel (which show annotations list)
 */
export interface IAddEditPanelProps {
    text: string;
    isBackButton: boolean;
    isDeleteButton: boolean;
    headerText: string;
    placeholder: string;
    onTextAreaChange: (value: string, maxCharacters: number) => void;
    maxCharacters: number;
    onBackButtonClick: () => void;
    applyButtonLabel: string;
    onDeleteClick: () => void;
    onApplyClick: () => void;
}
export const AddEditPanel: React.FunctionComponent<IAddEditPanelProps> = ({
    text,
    isBackButton,
    isDeleteButton,
    headerText,
    placeholder,
    onTextAreaChange,
    maxCharacters,
    onBackButtonClick,
    applyButtonLabel,
    onDeleteClick,
    onApplyClick,
}) => {
    const translate = i18nFilter();
    return (
        <AddEditPanelContainer>
            <AddEditBody>
                <AddEditPanelHeader>
                    {isBackButton ? (
                        <BackButton onClick={onBackButtonClick}>
                            <SWReactIcons size="xs" iconName="arrow-left" />
                        </BackButton>
                    ) : null}
                    <HeaderTextPanel>{headerText}</HeaderTextPanel>
                </AddEditPanelHeader>
                <AddEditPanelContent>
                    <AddEditTextarea
                        showCounter={true}
                        onChange={(value) => onTextAreaChange(value, maxCharacters)}
                        placeholder={placeholder}
                        maxCharacters={maxCharacters}
                        value={text}
                        autoFocus={true}
                    />
                </AddEditPanelContent>
            </AddEditBody>
            {isDeleteButton ? (
                <ActionBarEditContainer>
                    <AnnotationDeleteButton
                        type="flat"
                        onClick={onDeleteClick}
                        label={translate("chart.annotations.delete.button.label")}
                    />
                    <AnnotationButton
                        type="outlined"
                        onClick={onApplyClick}
                        label={applyButtonLabel}
                        isDisabled={text?.length < 1}
                    />
                </ActionBarEditContainer>
            ) : (
                <ActionBarContainer>
                    <AnnotationButton
                        type="outlined"
                        onClick={onApplyClick}
                        label={applyButtonLabel}
                        isDisabled={text?.length < 1}
                    />
                </ActionBarContainer>
            )}
        </AddEditPanelContainer>
    );
};
