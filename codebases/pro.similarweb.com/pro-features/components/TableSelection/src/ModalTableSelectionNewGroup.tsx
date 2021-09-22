import { Button, ButtonLabel } from "@similarweb/ui-components/dist/button";
import { ITextfieldProps, Textfield } from "@similarweb/ui-components/dist/textfield";
import { ECategoryType } from "common/services/categoryService.types";
import { Text } from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";
import React, { FC } from "react";
import styled from "styled-components";
import { ButtonGroup } from "../../ButtonsGroup/src/ButtonsGroup";
import I18n from "../../WithTranslation/src/I18n";
import { ModalTableSelectionContainer, Title, SubTitle } from "./StyledComponents";
import { hasMarketingPermission } from "services/Workspaces.service";
import { WebsiteListTypeSelectorContainer } from "components/website-list-selector/WebsiteListTypeSelectorContainer";
import { colorsPalettes, rgba } from "@similarweb/styles";

export interface IModalTableSelectionNewGroupProps {
    title?: string;
    subTitle: string;
    placeholder: string;
    onCancel: () => void;
    onSubmit: () => void;
    submitButtonDisabled: boolean;
    onGroupNameChange: (e) => void;
    isLoading: boolean;
    error?: boolean;
    errorMessage?: string;
    groupType?: "website" | "keyword" | "segment";
    selectedListType?: ECategoryType;
    onListTypeSelect?: (type: ECategoryType) => void;
}

const TextfieldStyled = styled(Textfield)<ITextfieldProps>`
    margin-bottom: 24px;
`;

const SelectorContainer = styled.div`
    margin-bottom: 24px;
`;

export const ModalTableSelectionNewGroup: FC<IModalTableSelectionNewGroupProps> = ({
    title,
    subTitle,
    placeholder,
    onCancel,
    onSubmit,
    submitButtonDisabled,
    onGroupNameChange,
    isLoading,
    error,
    errorMessage,
    groupType,
    selectedListType,
    onListTypeSelect,
}) => {
    return (
        <ModalTableSelectionContainer>
            <Title>
                <Text fontSize={20} fontWeight={500}>
                    {title}
                </Text>
            </Title>
            <SubTitle>
                <Text fontSize={14} fontWeight={500}>
                    {subTitle}
                </Text>
            </SubTitle>
            <TextfieldStyled
                error={error}
                errorMessage={errorMessage}
                placeholder={placeholder}
                onChange={onGroupNameChange}
                autoFocus={groupType === "segment"}
                dataAutomation="group-name-text-field"
            />
            {groupType === "website" && hasMarketingPermission() && (
                <SelectorContainer>
                    <SubTitle>
                        <Text fontSize={14} fontWeight={500}>
                            <I18n>table.selection.newgroup.type.website.title</I18n>
                        </Text>
                    </SubTitle>
                    <WebsiteListTypeSelectorContainer
                        selectedListType={selectedListType}
                        onListTypeSelect={onListTypeSelect}
                        disabled={false}
                    />
                </SelectorContainer>
            )}
            <ButtonGroup>
                <Button type="flat" onClick={onCancel}>
                    <ButtonLabel>
                        <I18n>table.selection.newgroup.cancel</I18n>
                    </ButtonLabel>
                </Button>
                <Button
                    type="primary"
                    onClick={onSubmit}
                    isLoading={isLoading}
                    isDisabled={submitButtonDisabled}
                >
                    <ButtonLabel>
                        <I18n>table.selection.newgroup.confirm</I18n>
                    </ButtonLabel>
                </Button>
            </ButtonGroup>
        </ModalTableSelectionContainer>
    );
};
ModalTableSelectionNewGroup.displayName = "ModalTableSelectionNewGroup";
ModalTableSelectionNewGroup.defaultProps = {
    subTitle: "",
    placeholder: "",
    onCancel: () => null,
    onSubmit: () => null,
    submitButtonDisabled: false,
    selectedListType: ECategoryType.GENERAL_LIST,
};
