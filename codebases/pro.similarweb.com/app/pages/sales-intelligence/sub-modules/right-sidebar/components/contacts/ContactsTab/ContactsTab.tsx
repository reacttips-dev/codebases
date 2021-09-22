import React from "react";
import { StyledContactsTab } from "./styles";
import ContactsMain from "pages/sales-intelligence/sub-modules/right-sidebar/components/contacts/ContactsMain/ContactsMainContainer";

const ContactsTab = () => {
    return (
        <StyledContactsTab>
            <ContactsMain />
        </StyledContactsTab>
    );
};

export default ContactsTab;
