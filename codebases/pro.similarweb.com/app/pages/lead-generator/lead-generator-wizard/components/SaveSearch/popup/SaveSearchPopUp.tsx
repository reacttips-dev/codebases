/** NPM IMPORT */
import { FC, useEffect, useState } from "react";
import dayjs from "dayjs";
import styled from "styled-components";

/** @similarweb IMPORT */
import { Button, ButtonLabel } from "@similarweb/ui-components/dist/button";
import { Checkbox } from "@similarweb/ui-components/dist/checkbox";
import { Label, Textfield } from "@similarweb/ui-components/dist/textfield";
import { i18nFilter } from "filters/ngFilters";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";

import {
    ButtonBox,
    CheckboxContainer,
    CustomTitle,
    LabelCheckboxWrapper,
    MainBox,
    Subtitle,
    TextFieldContainer,
} from "../StyledSaveSearchPopUp";

const StyleButtonDelete = styled(Button)`
    margin-right: 310px !important;
`;

interface ISaveSearchPopUpProps {
    isShowDeleteBtn: boolean;
    searchName: string;
    createdDate: Date;
    usedDomains: number;
    resultCount: number;
    reRunDisabled: boolean;
    showRerunCheckbox?: boolean;
    onClickCancel: (boolean) => void;
    onClickDone: (name: string, checked: boolean) => void;
    onClickDelete: (name: string) => void;
}

export const SaveSearchPopUp: FC<ISaveSearchPopUpProps> = ({
    onClickCancel,
    onClickDone,
    onClickDelete,
    isShowDeleteBtn,
    searchName,
    createdDate,
    usedDomains,
    resultCount,
    reRunDisabled,
    showRerunCheckbox = true,
}) => {
    const [checked, setChecked] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [defaultInputValue, setDefaultInputValue] = useState("");
    const [showInputError, setShowInputError] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const trans = i18nFilter();

    useEffect(() => {
        setInputValue(searchName);
        setDefaultInputValue(searchName);
    }, [searchName]);

    const inputValuePlaceHolder = "";

    const onInputValueChanged = (value: string) => {
        setShowInputError(false);
        setInputValue(value.trim());
    };

    const onBeforeSave = () => {
        if (inputValue.length) {
            onClickDone(inputValue, checked);
        } else {
            setShowInputError(true);
        }
    };

    const getSubTitle = () => {
        return isShowDeleteBtn
            ? trans("workspace.sales.leadgenerator.results-page.pop-up.subtitle", {
                  months: dayjs.utc().diff(dayjs(createdDate), "months").toString(),
                  domainsCount: usedDomains?.toString() ?? 0,
              })
            : trans("workspace.sales.leadgenerator.results-page.pop-up-new.subtitle");
    };

    const getTitle = () => {
        return isShowDeleteBtn
            ? defaultInputValue
            : trans("workspace.sales.leadgenerator.results-page.pop-up-new.title");
    };

    const handleCancel = () => {
        onClickCancel(checked);
    };

    const showConfirmDeleteModal = () => {
        setShowConfirmModal(true);
    };

    const handleDeleteCancellation = () => {
        setShowConfirmModal(false);
    };

    const handleDelete = () => {
        setShowConfirmModal(false);
        onClickDelete(inputValue);
    };

    return (
        <>
            <MainBox>
                <CustomTitle>{getTitle()}</CustomTitle>
                <Subtitle>{getSubTitle()}</Subtitle>
                <TextFieldContainer
                    data-automation-input-error-message={
                        "leadgenerator-results-page-pop-up-input-error"
                    }
                >
                    <Textfield
                        label={trans(
                            "workspace.sales.leadgenerator.results-page.pop-up.input.label",
                        )}
                        defaultValue={defaultInputValue}
                        onChange={onInputValueChanged}
                        error={showInputError}
                        errorMessage={trans(
                            "workspace.sales.leadgenerator.results-page.pop-up.input.error",
                        )}
                        placeholder={inputValuePlaceHolder}
                        maxLength={100}
                        autoFocus
                        dataAutomation="workspace.sales.leadgenerator-results-page.pop-up-text-field"
                    />
                </TextFieldContainer>
                {!isShowDeleteBtn && (
                    <CheckboxContainer>
                        {showRerunCheckbox && (
                            <Checkbox
                                label={trans(
                                    "workspace.sales.leadgenerator.results-page.pop-up.checkbox.label",
                                )}
                                onClick={() => setChecked(!checked)}
                                selected={checked}
                                isDisabled={reRunDisabled}
                            />
                        )}
                        <LabelCheckboxWrapper showRerunCheckbox={showRerunCheckbox}>
                            <Label>
                                {trans(
                                    "workspace.sales.leadgenerator.results-page.pop-up.checkbox.description",
                                )}
                            </Label>
                        </LabelCheckboxWrapper>
                    </CheckboxContainer>
                )}
                <ButtonBox>
                    {isShowDeleteBtn && (
                        <StyleButtonDelete type="flatWarning" onClick={showConfirmDeleteModal}>
                            <ButtonLabel>
                                {trans(
                                    "workspace.sales.leadgenerator.results-page.save.btn.delete",
                                )}
                            </ButtonLabel>
                        </StyleButtonDelete>
                    )}
                    <Button type="flat" onClick={handleCancel}>
                        <ButtonLabel>
                            {trans("workspace.sales.leadgenerator.results-page.save.btn.cancel")}
                        </ButtonLabel>
                    </Button>
                    <Button type="primary" buttonHtmlType="button" onClick={onBeforeSave}>
                        <ButtonLabel>
                            {trans("workspace.sales.leadgenerator.results-page.save.btn.done")}
                        </ButtonLabel>
                    </Button>
                </ButtonBox>
            </MainBox>
            <ConfirmDialog
                isOpen={showConfirmModal}
                resultCount={resultCount}
                searchName={searchName}
                onCancel={handleDeleteCancellation}
                onConfirm={handleDelete}
            />
        </>
    );
};
