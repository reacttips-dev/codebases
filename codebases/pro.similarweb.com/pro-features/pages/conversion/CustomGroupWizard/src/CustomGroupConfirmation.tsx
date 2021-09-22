import { noop } from "lodash";
import React, { useEffect, useRef, useState } from "react";

import { Button } from "@similarweb/ui-components/dist/button";
import { PopupClickContainer } from "@similarweb/ui-components/dist/popup-click-container";
import { Textfield } from "@similarweb/ui-components/dist/textfield";
import {
    ConfirmationButtons,
    ConfirmationContent,
    ConfirmationDialogWrapper,
    ConfirmationTitle,
    WhiteButton,
} from "./StyledComponents";

const MINIMUM_GROUP_NAME_LENGHT = 3;

export interface ICustomGroupConfirmationProps {
    translate: (key: string, params?) => string;
    track: (a?, b?, c?, d?) => void;
    isEdit: boolean;
    isFetching: boolean;
    groupName?: string;

    onConfirm: (name: string) => void;
    onCancel?: () => void;
}

export const CustomGroupConfirmation: React.FunctionComponent<ICustomGroupConfirmationProps> = ({
    translate,
    track,
    isEdit,
    onConfirm,
    onCancel,
    groupName,
    isFetching,
}) => {
    const popupEl: any = useRef(null);
    const [isFirstEffect, setIsFirstEffect] = useState<boolean>(true);
    const [currentGroupName, setCurrentGroupName] = useState<string>(groupName);
    const [emptyName, setEmptyName] = useState<boolean>(false);
    const onNameChange = (name) => {
        if (isFirstEffect) {
            setIsFirstEffect(false);
        }
        setCurrentGroupName(name);
    };
    const onConfirmClick = () => {
        onConfirm(currentGroupName);
    };
    const onCancelClick = () => {
        popupEl.current.closePopup();
        onCancel();
    };
    const popupConfig = {
        placement: "bottom",
        width: "320px",
    };
    const popupContent = () => (
        <ConfirmationDialogWrapper>
            <ConfirmationTitle>
                {translate(
                    `conversion.wizard.confirmationModal.${isEdit ? "edit" : "create"}.title`,
                )}
            </ConfirmationTitle>
            <ConfirmationContent>
                <Textfield
                    label={translate("conversion.wizard.confirmationModal.label")}
                    onChange={onNameChange}
                    // isFirstEffect indicates that it's first time that user sees textfield
                    // and we don't want to show him an error beforehand
                    error={!isFirstEffect && emptyName}
                    defaultValue={currentGroupName}
                    errorMessage={translate("conversion.wizard.confirmationModal.emptyName")}
                />
            </ConfirmationContent>
            <ConfirmationButtons>
                <Button type="flat" onClick={onCancelClick}>
                    {translate("conversion.wizard.confirmationModal.cancel")}
                </Button>
                <Button
                    type="primary"
                    onClick={onConfirmClick}
                    isDisabled={emptyName || isFetching}
                >
                    {translate("conversion.wizard.confirmationModal.confirm")}
                </Button>
            </ConfirmationButtons>
        </ConfirmationDialogWrapper>
    );

    useEffect(() => {
        setEmptyName(currentGroupName.trim().length < MINIMUM_GROUP_NAME_LENGHT);
    }, [currentGroupName]);

    return (
        <PopupClickContainer content={popupContent} config={popupConfig} ref={popupEl}>
            <div>
                <WhiteButton
                    onClick={() => {
                        track(
                            `wizard confirmation`,
                            "open",
                            `${isEdit ? "Edit group" : "Create Group"}`,
                        );
                    }}
                    type="outlined"
                >
                    {translate(
                        `conversion.wizard.confirmationModal.confirm.${isEdit ? "edit" : "create"}`,
                    )}
                </WhiteButton>
            </div>
        </PopupClickContainer>
    );
};

CustomGroupConfirmation.defaultProps = {
    groupName: "",

    onCancel: noop,
};
