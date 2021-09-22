import React from "react";
import {
    Contact,
    ContactsFilterBase,
    ContactsFilters,
    ContactsFiltersType,
    ContactsParams,
} from "pages/sales-intelligence/sub-modules/contacts/store/types";
import { ContactsSelectedFilters } from "pages/sales-intelligence/sub-modules/right-sidebar/types/contacts";
import { IBooleanSearchChipItem } from "@similarweb/ui-components/dist/boolean-search/src/BooleanSearch";

type ContactsTabContextProps = {
    filters: ContactsFilters;
    loadingFilters: boolean;
    contacts: Contact[];
    updatingContacts: boolean;
    loadingContacts: boolean;
    totalCount: number;
    contactsQuota: number;
    setSearchChips: (items: IBooleanSearchChipItem[]) => void;
    searchChips: IBooleanSearchChipItem[];
    selectedFilters: ContactsSelectedFilters;
    setSelectedFilters: (name: ContactsFiltersType, selected: ContactsFilterBase[]) => void;
    isEmptyState: boolean;
    fetchContacts(domain: string, params: ContactsParams): void;
    updateContacts(domain: string, params: ContactsParams): void;
    fetchContactPrivateData(id: string, domain: string): void;
};

const ContactsTabContext = React.createContext<ContactsTabContextProps>(null);

export default ContactsTabContext;
