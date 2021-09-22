import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { StyledContactsTabSubTitle, StyledContactsTabTitle } from "./styles";

const ContactsHeader = () => {
    const translate = useTranslation();

    return (
        <>
            <StyledContactsTabTitle>
                {translate("si.sidebar.contacts.title")}
            </StyledContactsTabTitle>
            <StyledContactsTabSubTitle>
                {translate("si.sidebar.contacts.subtitle")}
            </StyledContactsTabSubTitle>
        </>
    );
};

export default ContactsHeader;
