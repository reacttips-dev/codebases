import React from "react";
import { SWReactIcons } from "@similarweb/icons";
import {
    StyledContactsDetailsLoadingState,
    StyledContactsDetailsLoadingStatePrefixIcon,
    StyledContactsDetailsLoadingStateValue,
} from "./styles";

export type ContactsDetailsLoadingStateProps = {
    iconName: string;
    withIcon?: boolean;
};

const ContactsDetailsLoadingState: React.FC<ContactsDetailsLoadingStateProps> = ({
    iconName,
    withIcon,
}) => {
    return (
        <StyledContactsDetailsLoadingState>
            <StyledContactsDetailsLoadingStatePrefixIcon>
                {withIcon && <SWReactIcons iconName={iconName} size="xs" />}
            </StyledContactsDetailsLoadingStatePrefixIcon>
            <StyledContactsDetailsLoadingStateValue />
        </StyledContactsDetailsLoadingState>
    );
};

export default ContactsDetailsLoadingState;
