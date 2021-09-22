import { SWReactIcons } from "@similarweb/icons";
import React, { FC, useState } from "react";
import {
    ErrorMessage,
    ErrorMessageContainer,
    InputContainer,
    TrackerNameTextfield,
} from "./TrackerNameInputStyles";

interface ITrackerNameInputProps {
    hasError: boolean;
    errorMessage?: string;
    onChange: (updatedName: string) => void;
    placeHolder: string;
    defaultValue?: string;
}

export const TrackerNameInput: React.FunctionComponent<ITrackerNameInputProps> = (props) => {
    const { hasError, errorMessage, onChange, placeHolder, defaultValue } = props;

    const [isEditing, setIsEditing] = useState(false);

    return (
        <>
            <InputContainer isFocused={isEditing} hasError={hasError}>
                <TrackerNameTextfield
                    hasError={hasError}
                    isFocused={isEditing}
                    placeholder={placeHolder}
                    onChange={onChange}
                    hideBorder={true}
                    onFocus={() => setIsEditing(true)}
                    onBlur={() => setIsEditing(false)}
                    defaultValue={defaultValue}
                />
                <SWReactIcons iconName={"edit-icon"} size={"xs"} />
            </InputContainer>
            {hasError && (
                <ErrorMessageContainer>
                    <SWReactIcons iconName="alert-circle" size="xs" />
                    <ErrorMessage>{errorMessage}</ErrorMessage>
                </ErrorMessageContainer>
            )}
        </>
    );
};
