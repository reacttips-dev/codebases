import React from "react";
import ContactsItemLoading from "./ContactsItemLoading";
import ContactsTabContext from "pages/sales-intelligence/sub-modules/right-sidebar/contexts/ContactsTabContext";
import { FAKE_CONTACTS_ITEMS } from "pages/sales-intelligence/sub-modules/right-sidebar/constants/contacts";
import { StyledContactsLoadingList } from "./styles";
import ContactsEmptyState from "pages/sales-intelligence/sub-modules/right-sidebar/components/contacts/ContactsEmptyState/ContactsEmptyState";

const ContactsListState = () => {
    const { loadingContacts, loadingFilters, isEmptyState } = React.useContext(ContactsTabContext);

    const renderContent = () => {
        if (loadingContacts || loadingFilters) {
            return (
                <StyledContactsLoadingList>
                    {FAKE_CONTACTS_ITEMS.map((item, index) => (
                        <ContactsItemLoading key={index + 1} />
                    ))}
                </StyledContactsLoadingList>
            );
        }
        if (isEmptyState) {
            return <ContactsEmptyState />;
        }
    };

    return <>{renderContent()}</>;
};

export default ContactsListState;
