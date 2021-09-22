import React from "react";
import RightSidebarContext from "pages/sales-intelligence/sub-modules/right-sidebar/contexts/RightSidebarContext";
import {
    ContactsFilterBase,
    ContactsFiltersType,
} from "pages/sales-intelligence/sub-modules/contacts/store/types";
import useContactsPreferencesService from "pages/sales-intelligence/sub-modules/right-sidebar/hooks/useContactsPreferencesService";
import {
    generateContactsFiltersParams,
    generateContactsSearchParams,
} from "pages/sales-intelligence/sub-modules/right-sidebar/helpers/contacts";
import {
    DEFAULT_PAGE,
    PAGE_SIZE,
} from "pages/sales-intelligence/sub-modules/right-sidebar/constants/contacts";
import ContactsTabContext from "pages/sales-intelligence/sub-modules/right-sidebar/contexts/ContactsTabContext";
import ContactsMain from "pages/sales-intelligence/sub-modules/right-sidebar/components/contacts/ContactsMain/ContactsMain";
import { ContactsFiltersContainerProps } from "pages/sales-intelligence/sub-modules/right-sidebar/components/contacts/ContactsMain/ContactsMainContainer";
import { IBooleanSearchChipItem } from "@similarweb/ui-components/dist/boolean-search/src/BooleanSearch";
import useContactsSelectedFilters from "pages/sales-intelligence/sub-modules/right-sidebar/hooks/useContactsSelectedFilters";

const ContactsMainProvider = (props: ContactsFiltersContainerProps) => {
    const {
        contacts,
        totalCount,
        loadingContacts,
        loadingFilters,
        updatingContacts,
        filters,
        isEmptyState,
        contactsQuota,
        fetchContacts,
        updateContacts,
        fetchContactsQuota,
        fetchContactsFilters,
        fetchContactPrivateData,
    } = props;

    const { website } = React.useContext(RightSidebarContext);
    const [searchChips, setSearchChips] = React.useState<IBooleanSearchChipItem[]>([]);
    const { getFiltersFromPreferencesService } = useContactsPreferencesService();
    const {
        seniorityFilters,
        departmentsFilters,
        countiesFilters,
        setContactsSelectedFilter,
    } = useContactsSelectedFilters();

    const setSelectedFilters = (name: ContactsFiltersType, selected: ContactsFilterBase[]) => {
        setContactsSelectedFilter[name](selected);
    };

    React.useEffect(() => {
        if (website?.domain) {
            const {
                seniorityFilters,
                departmentsFilters,
                countiesFilters,
            } = getFiltersFromPreferencesService();

            if (seniorityFilters?.length) {
                setContactsSelectedFilter[ContactsFiltersType.SENIORITY_LEVELS](seniorityFilters);
            }

            if (departmentsFilters?.length) {
                setContactsSelectedFilter[ContactsFiltersType.DEPARTMENTS](departmentsFilters);
            }

            if (countiesFilters?.length) {
                setContactsSelectedFilter[ContactsFiltersType.COUNTRIES](countiesFilters);
            }
            const paramsFilters = generateContactsFiltersParams({
                seniorityFilters,
                departmentsFilters,
                countiesFilters,
            });

            const paramsSearch = generateContactsSearchParams(searchChips);

            fetchContactsFilters(website.domain);
            fetchContactsQuota();
            fetchContacts(website?.domain, {
                ...paramsFilters,
                ...paramsSearch,
                pageSize: PAGE_SIZE,
                page: DEFAULT_PAGE,
            });
        }
    }, [website]);

    const contextValue = React.useMemo(() => {
        return {
            filters,
            loadingFilters,
            contacts,
            isEmptyState,
            updatingContacts,
            loadingContacts,
            totalCount,
            contactsQuota,
            searchChips,
            setSearchChips,
            selectedFilters: {
                seniorityFilters,
                departmentsFilters,
                countiesFilters,
            },
            setSelectedFilters,
            fetchContacts,
            updateContacts,
            fetchContactPrivateData,
        };
    }, [
        contacts,
        loadingFilters,
        loadingContacts,
        filters,
        isEmptyState,
        contactsQuota,
        totalCount,
        updatingContacts,
        seniorityFilters,
        departmentsFilters,
        countiesFilters,
        searchChips,
    ]);

    return (
        <ContactsTabContext.Provider value={contextValue}>
            <ContactsMain />
        </ContactsTabContext.Provider>
    );
};

export default ContactsMainProvider;
