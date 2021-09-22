import React from "react";
import ContactsListHeader from "pages/sales-intelligence/sub-modules/right-sidebar/components/contacts/ContactsList/ContactsListHeader";
import ContactsListItem from "pages/sales-intelligence/sub-modules/right-sidebar/components/contacts/ContactsList/ContactItem";
import ContactsTabContext from "pages/sales-intelligence/sub-modules/right-sidebar/contexts/ContactsTabContext";
import RightSidebarContext from "pages/sales-intelligence/sub-modules/right-sidebar/contexts/RightSidebarContext";
import { Loader } from "pages/website-analysis/traffic-sources/display-ads/common/Loader";
import useContactsInfinityScroll from "../../../hooks/useContactsInfinityScroll";
import { StyledContactsList, StyledInfinityLoader, StyledWrapperContactsItem } from "./styles";

const ContactsList = () => {
    const {
        contacts,
        fetchContactPrivateData,
        contactsQuota,
        updatingContacts,
        loadingContacts,
        totalCount,
    } = React.useContext(ContactsTabContext);

    const { website } = React.useContext(RightSidebarContext);
    const observerRef = useContactsInfinityScroll();
    const domain = website?.domain || "";

    return (
        <>
            {!loadingContacts && contacts.length > 0 && (
                <StyledContactsList>
                    <ContactsListHeader amount={totalCount} />
                    <StyledWrapperContactsItem>
                        {contacts.map((contact, index) => {
                            return (
                                <ContactsListItem
                                    key={contact.contactId}
                                    observerRef={
                                        index === contacts.length - 1 ? observerRef : undefined
                                    }
                                    contact={contact}
                                    fetchContactPrivateData={fetchContactPrivateData}
                                    domain={domain}
                                    contactsQuota={contactsQuota}
                                />
                            );
                        })}
                    </StyledWrapperContactsItem>
                    {contacts.length > 0 && updatingContacts && (
                        <StyledInfinityLoader>
                            <Loader />
                        </StyledInfinityLoader>
                    )}
                </StyledContactsList>
            )}
        </>
    );
};

export default ContactsList;
