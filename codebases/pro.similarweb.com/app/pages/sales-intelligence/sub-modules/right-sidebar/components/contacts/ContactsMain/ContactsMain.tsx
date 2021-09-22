import React from "react";
import ContactsFilters from "../ContactsFilters/ContactsFilters";
import ContactsList from "../ContactsList/ContactsList";
import ContactsHeader from "../ContactsHeader/ContactsHeader";
import ContactsListState from "../ContactsList/ContctsStateList";
import ContactsSearch from "../ContactsSearch/ContactsSearch";
import { StyledContactsHeader, StyledContactsMain } from "./styles";

const ContactsMain = () => {
    return (
        <>
            <StyledContactsHeader>
                <ContactsHeader />
                <ContactsFilters />
                <ContactsSearch />
            </StyledContactsHeader>
            <StyledContactsMain>
                <ContactsList />
                <ContactsListState />
            </StyledContactsMain>
        </>
    );
};

export default ContactsMain;
