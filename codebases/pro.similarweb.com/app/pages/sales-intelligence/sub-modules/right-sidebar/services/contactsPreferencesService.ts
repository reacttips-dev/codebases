import { PreferencesService } from "services/preferences/preferencesService";
import { ContactsFilterBase, ContactsFiltersType } from "../../contacts/store/types";
import {
    ContactsPreferenceServiceTarget,
    ContactsSelectedFilters,
} from "pages/sales-intelligence/sub-modules/right-sidebar/types/contacts";

type ContactsPreferenceService = {
    setGlobalCategory: (filters: ContactsFilterBase[]) => void;
    getGlobalCategory: () => ContactsFilterBase[] | undefined;
    removeGlobalCategory: () => void;
};

type PreferencesServiceType = {
    [ContactsFiltersType.SENIORITY_LEVELS]: ContactsPreferenceService;
    [ContactsFiltersType.DEPARTMENTS]: ContactsPreferenceService;
    [ContactsFiltersType.COUNTRIES]: ContactsPreferenceService;
};

type ContactsPreferencesServiceProps = {
    getFiltersFromPreferencesService(): ContactsSelectedFilters;
    preferencesService: PreferencesServiceType;
};

const contactsPreferencesService = () => {
    const preferenceServiceAPI = (
        target: ContactsPreferenceServiceTarget,
    ): ContactsPreferenceService => {
        return {
            setGlobalCategory: async (filters: ContactsFilterBase[]) => {
                await PreferencesService.add({ [target]: filters });
            },
            getGlobalCategory: () => {
                const prefTechnoCategory = PreferencesService.get(target);
                return prefTechnoCategory as ContactsFilterBase[] | undefined;
            },
            removeGlobalCategory: () => PreferencesService.remove([target]),
        };
    };

    const preferencesService: PreferencesServiceType = {
        [ContactsFiltersType.COUNTRIES]: preferenceServiceAPI(
            ContactsPreferenceServiceTarget.CONTACTS_COUNTRIES_FILTERS,
        ),
        [ContactsFiltersType.DEPARTMENTS]: preferenceServiceAPI(
            ContactsPreferenceServiceTarget.CONTACTS_DEPARTMENTS_FILTERS,
        ),
        [ContactsFiltersType.SENIORITY_LEVELS]: preferenceServiceAPI(
            ContactsPreferenceServiceTarget.CONTACTS_SENIORITY_FILTERS,
        ),
    };

    const getFiltersFromPreferencesService = (): ContactsSelectedFilters => {
        const seniorityFilters = preferencesService[
            ContactsFiltersType.SENIORITY_LEVELS
        ].getGlobalCategory();

        const departmentsFilters = preferencesService[
            ContactsFiltersType.DEPARTMENTS
        ].getGlobalCategory();

        const countiesFilters = preferencesService[
            ContactsFiltersType.COUNTRIES
        ].getGlobalCategory();

        return { seniorityFilters, departmentsFilters, countiesFilters };
    };

    return (): ContactsPreferencesServiceProps => ({
        getFiltersFromPreferencesService,
        preferencesService,
    });
};

export default contactsPreferencesService();
