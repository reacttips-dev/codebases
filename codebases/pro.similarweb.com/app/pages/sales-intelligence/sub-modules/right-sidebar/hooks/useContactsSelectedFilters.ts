import React from "react";
import {
    ContactsFilterBase,
    ContactsFiltersType,
} from "pages/sales-intelligence/sub-modules/contacts/store/types";

const useContactsSelectedFilters = () => {
    const [seniorityFilters, setSelectedSeniority] = React.useState<ContactsFilterBase[]>([]);
    const [departmentsFilters, setSelectedDepartments] = React.useState<ContactsFilterBase[]>([]);
    const [countiesFilters, setSelectedCountries] = React.useState<ContactsFilterBase[]>([]);

    const setContactsSelectedFilter = React.useMemo(() => {
        return {
            [ContactsFiltersType.DEPARTMENTS]: setSelectedDepartments,
            [ContactsFiltersType.SENIORITY_LEVELS]: setSelectedSeniority,
            [ContactsFiltersType.COUNTRIES]: setSelectedCountries,
        };
    }, []);

    return {
        seniorityFilters,
        departmentsFilters,
        countiesFilters,
        setContactsSelectedFilter,
    };
};

export default useContactsSelectedFilters;
