import React from "react";
import { SWReactIcons } from "@similarweb/icons";
import { StyledButtonLabel, StyledDropdownButton } from "../styled";

type DropdownButtonProps = {
    title: string;
    onClick(): void;
    maxLengthText?: number;
};

const DropdownButton = (props: DropdownButtonProps) => {
    const { title, onClick, maxLengthText = 180 } = props;

    return (
        <StyledDropdownButton onClick={onClick} data-automation="add-to-list-dropdown-button">
            <StyledButtonLabel maxLength={maxLengthText}>{title}</StyledButtonLabel>
            <SWReactIcons iconName="arrow" />
        </StyledDropdownButton>
    );
};

export default DropdownButton;
