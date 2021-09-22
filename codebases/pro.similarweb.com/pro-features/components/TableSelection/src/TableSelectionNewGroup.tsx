import { Button, ButtonLabel } from "@similarweb/ui-components/dist/button";
import { ITextfieldProps, Textfield } from "@similarweb/ui-components/dist/textfield";
import { ECategoryType } from "common/services/categoryService.types";
import { WebsiteListTypeSelectorContainer } from "components/website-list-selector/WebsiteListTypeSelectorContainer";
import React, { FC } from "react";
import { hasMarketingPermission } from "services/Workspaces.service";
import styled from "styled-components";
import { ButtonGroup } from "../../ButtonsGroup/src/ButtonsGroup";
import I18n from "../../WithTranslation/src/I18n";
import { TableSelectionContainer } from "./StyledComponents";

export interface ITableSelectionNewGroupProps {
    title: string;
    placeholder: string;
    onCancel: () => void;
    onSubmit: () => void;
    submitButtonDisabled: boolean;
    groupName: string;
    onGroupNameChange: (e) => void;
    isLoading: boolean;
    error?: boolean;
    errorMessage?: string;
    onListTypeSelect?: (typeId) => void;
    groupType?: "website" | "keyword" | "segment";
    selectedListType?: ECategoryType;
}

const TextfieldStyled = styled(Textfield)<ITextfieldProps>`
    margin-bottom: 24px;
`;

const SelectorContainer = styled.div`
    margin-bottom: 24px;
`;

const SelectorLabel = styled.span`
    font-size: 12px;
    color: rgba(colorsPalettes.carbon[500], 0.6);
    margin-bottom: 6px;
`;

export const TableSelectionNewGroup: FC<ITableSelectionNewGroupProps> = ({
    title,
    placeholder,
    onCancel,
    onSubmit,
    submitButtonDisabled,
    groupName,
    onGroupNameChange,
    isLoading,
    error,
    errorMessage,
    onListTypeSelect,
    groupType,
    selectedListType,
}) => {
    return (
        <TableSelectionContainer>
            <TextfieldStyled
                error={error}
                errorMessage={errorMessage}
                placeholder={placeholder}
                onChange={onGroupNameChange}
                label={title}
                autoFocus={groupType === "segment"}
                dataAutomation="group-name-text-field"
            />
            {groupType === "website" && hasMarketingPermission() && (
                <SelectorContainer>
                    <SelectorLabel>
                        <I18n>table.selection.newgroup.type.website.title</I18n>
                    </SelectorLabel>
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
        </TableSelectionContainer>
    );
};
TableSelectionNewGroup.displayName = "TableSelectionNewGroup";
TableSelectionNewGroup.defaultProps = {
    title: "",
    placeholder: "",
    onCancel: () => null,
    onSubmit: () => null,
    submitButtonDisabled: false,
    selectedListType: ECategoryType.GENERAL_LIST,
};
