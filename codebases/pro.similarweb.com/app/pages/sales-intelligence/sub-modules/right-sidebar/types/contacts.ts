import { ContactsFilterBase } from "pages/sales-intelligence/sub-modules/contacts/store/types";

export type FilterOption = {
    id: string;
    text: string;
};

export type ContactsSelectedFilters = {
    seniorityFilters: ContactsFilterBase[];
    departmentsFilters: ContactsFilterBase[];
    countiesFilters: ContactsFilterBase[];
};

export enum ContactsPreferenceServiceTarget {
    CONTACTS_SENIORITY_FILTERS = "contactsSeniorityFilters",
    CONTACTS_DEPARTMENTS_FILTERS = "contactsDepartmentsFilters",
    CONTACTS_COUNTRIES_FILTERS = "contactsCountriesFilters",
}

export enum ContactsSearch {
    INCLUDE,
    EXCLUDE,
}
