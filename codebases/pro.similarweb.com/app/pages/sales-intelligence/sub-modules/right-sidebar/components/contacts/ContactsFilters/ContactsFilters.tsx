import React from "react";
import ContactsFilter from "./ContactsFilter";
import ContactsTabContext from "pages/sales-intelligence/sub-modules/right-sidebar/contexts/ContactsTabContext";
import RightSidebarContext from "pages/sales-intelligence/sub-modules/right-sidebar/contexts/RightSidebarContext";
import useContactsFiltersConfig from "pages/sales-intelligence/sub-modules/right-sidebar/hooks/useContactsFiltersConfig";
import {
    DEFAULT_PAGE,
    PAGE_SIZE,
} from "pages/sales-intelligence/sub-modules/right-sidebar/constants/contacts";
import {
    ContactsFilterBase,
    ContactsFiltersType,
} from "pages/sales-intelligence/sub-modules/contacts/store/types";
import {
    generateContactsFiltersParams,
    generateContactsSearchParams,
    matchContactsFilter,
} from "../../../helpers/contacts";
import useContactsPreferencesService from "pages/sales-intelligence/sub-modules/right-sidebar/hooks/useContactsPreferencesService";
import useContactsTrackingService from "pages/sales-intelligence/hooks/useContactsTrackingService";
import { StyledContactsFilters } from "./styles";

const ContactsFilters = () => {
    const { website } = React.useContext(RightSidebarContext);
    const {
        filters,
        searchChips,
        loadingContacts,
        selectedFilters,
        fetchContacts,
        setSelectedFilters,
    } = React.useContext(ContactsTabContext);

    const { countries, departments, seniorityLevels } = filters;
    const { seniorityFilters, departmentsFilters, countiesFilters } = selectedFilters;
    const { preferencesService } = useContactsPreferencesService();
    const tracking = useContactsTrackingService();

    const {
        countriesFilter,
        departmentsFilter,
        seniorityLevelsFilter,
    } = useContactsFiltersConfig();

    const handleFilters = (name: ContactsFiltersType, selected: ContactsFilterBase[]) => {
        setSelectedFilters(name, selected);

        const paramsFilters = generateContactsFiltersParams({
            seniorityFilters,
            departmentsFilters,
            countiesFilters,
            ...matchContactsFilter(name, selected),
        });

        const paramsSearch = generateContactsSearchParams(searchChips);

        if (website?.domain) {
            fetchContacts(website.domain, {
                ...paramsFilters,
                ...paramsSearch,
                pageSize: PAGE_SIZE,
                page: DEFAULT_PAGE,
            });
        }

        if (selected.length) {
            preferencesService[name].setGlobalCategory(selected);
            tracking.trackChangeFilter(name, selected, selected.length);
        } else {
            preferencesService[name].removeGlobalCategory();
            tracking.trackResetFilter(name);
        }
    };

    return (
        <StyledContactsFilters>
            {/*<ContactsFilter*/}
            {/*    name={ContactsFiltersType.SENIORITY_LEVELS}*/}
            {/*    selectedItems={seniorityFilters}*/}
            {/*    options={seniorityLevels}*/}
            {/*    buttonLabel={seniorityLevelsFilter.buttonLabel}*/}
            {/*    filterOptions={{*/}
            {/*        isDisabled: loadingContacts || !seniorityLevels.length,*/}
            {/*        ...seniorityLevelsFilter.filterOptions,*/}
            {/*    }}*/}
            {/*    renderDropDownItem={seniorityLevelsFilter.renderDropDownItem}*/}
            {/*    onApply={handleFilters}*/}
            {/*/>*/}
            <ContactsFilter
                name={ContactsFiltersType.DEPARTMENTS}
                options={departments}
                selectedItems={departmentsFilters}
                buttonLabel={departmentsFilter.buttonLabel}
                onApply={handleFilters}
                filterOptions={{
                    isDisabled: loadingContacts || !departments.length,
                    ...departmentsFilter.filterOptions,
                }}
                renderDropDownItem={departmentsFilter.renderDropDownItem}
            />
            <ContactsFilter
                name={ContactsFiltersType.COUNTRIES}
                onApply={handleFilters}
                selectedItems={countiesFilters}
                options={countries}
                filterOptions={{
                    isDisabled: loadingContacts || !countries.length,
                    ...countriesFilter.filterOptions,
                }}
                buttonLabel={countriesFilter.buttonLabel}
                renderDropDownItem={countriesFilter.renderDropDownItem}
            />
        </StyledContactsFilters>
    );
};

export default ContactsFilters;
