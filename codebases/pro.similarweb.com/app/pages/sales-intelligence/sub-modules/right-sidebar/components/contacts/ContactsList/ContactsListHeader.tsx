import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { StyledContactsListHeader } from "./styles";

type ContactsListHeaderProps = {
    amount: number;
};

const ContactsListHeader: React.FC<ContactsListHeaderProps> = ({ amount }) => {
    const translate = useTranslation();

    return (
        <StyledContactsListHeader>
            {translate("si.sidebar.contacts.list.title")}&nbsp;&#40;{amount}&#41;
        </StyledContactsListHeader>
    );
};

export default ContactsListHeader;
