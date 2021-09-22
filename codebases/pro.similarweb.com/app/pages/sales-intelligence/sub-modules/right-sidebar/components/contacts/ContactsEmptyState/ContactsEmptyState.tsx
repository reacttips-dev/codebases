import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { EmptyStateIcon, StyledContactsEmptyState, StyledContactsEmptyStateTitle } from "./styles";

const ContactsEmptyState = () => {
    const translate = useTranslation();

    return (
        <StyledContactsEmptyState>
            <EmptyStateIcon iconName="no-data-lab" />
            <StyledContactsEmptyStateTitle>
                {translate("si.sidebar.contacts.empty_state")}
            </StyledContactsEmptyStateTitle>
        </StyledContactsEmptyState>
    );
};

export default ContactsEmptyState;
