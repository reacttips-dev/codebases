import React, { FC, useMemo } from "react";
import { Button } from "@similarweb/ui-components/dist/button";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { i18nFilter } from "filters/ngFilters";

const WizardFooter = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 17px 30px;
    background-color: ${colorsPalettes.carbon["0"]};
    border: 0;
    text-align: right;
    margin-right: 2px;
    margin-left: 2px;
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: center;
`;

interface IListFooterProps {
    onSave: () => void;
    saveButtonEnabled: boolean;
    isSaving: boolean;

    /**
     * Indicates whether we want to show a delete button or not
     */
    showDeleteButton?: boolean;

    /**
     * Callback upon clicking delete button
     */
    onDelete?: () => void;

    /**
     * Indicates whether we're currently deleting an item or not
     */
    isDeleting?: boolean;
}

export const ListFooter: FC<IListFooterProps> = (props) => {
    const {
        onSave,
        onDelete,
        saveButtonEnabled,
        isSaving,
        showDeleteButton = false,
        isDeleting = false,
    } = props;

    const translate = useMemo(() => {
        return i18nFilter();
    }, []);

    const saveButtonText = !isSaving
        ? "customcategories.wizard.save.button"
        : "customcategories.wizard.save.button.loading";

    const deleteButtonText = !isDeleting
        ? "customcategories.wizard.delete.button"
        : "customcategories.wizard.delete.button.loading";

    const isLoading = isSaving || isDeleting;

    return (
        <WizardFooter>
            <Button
                type="primary"
                onClick={onSave}
                isDisabled={!saveButtonEnabled}
                isLoading={isLoading}
            >
                {translate(saveButtonText)}
            </Button>

            {showDeleteButton && (
                <Button
                    type="flatWarning"
                    onClick={onDelete}
                    isDisabled={isLoading}
                    isLoading={isLoading}
                >
                    {translate(deleteButtonText)}
                </Button>
            )}
        </WizardFooter>
    );
};

ListFooter.defaultProps = {
    showDeleteButton: false,
    isDeleting: false,
};
