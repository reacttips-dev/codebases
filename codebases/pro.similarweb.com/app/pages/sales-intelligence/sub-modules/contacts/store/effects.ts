import { ThunkDispatchCommon, ThunkGetState } from "store/types";
import { ThunkDependencies } from "store/thunk-dependencies";
import * as actionCreators from "./action-creators";
import { selectContacts } from "pages/sales-intelligence/sub-modules/contacts/store/selectors";
import { ContactsParams } from "pages/sales-intelligence/sub-modules/contacts/store/types";
import { convertFilterIdToString } from "../../right-sidebar/helpers/contacts";

export const fetchContactsThunk = (domain: string, params: ContactsParams = {}) => {
    return async (
        dispatch: ThunkDispatchCommon,
        getState: ThunkGetState,
        deps: ThunkDependencies,
    ) => {
        dispatch(actionCreators.fetchContactsAsync.request());

        try {
            const { contacts, totalCount } = await deps.si.api.contacts.fetchContactsData(
                domain,
                params,
            );

            dispatch(
                actionCreators.fetchContactsAsync.success({
                    contacts,
                    totalCount,
                    isEmptyState: totalCount === 0,
                }),
            );
        } catch (e) {
            dispatch(actionCreators.fetchContactsAsync.failure(e));
        }
    };
};

export const updateContactsThunk = (domain: string, params: ContactsParams = {}) => async (
    dispatch: ThunkDispatchCommon,
    getState: ThunkGetState,
    deps: ThunkDependencies,
) => {
    dispatch(actionCreators.updateContactsAsync.request());

    try {
        const { contacts, totalCount } = await deps.si.api.contacts.fetchContactsData(
            domain,
            params,
        );
        const nextContacts = [...selectContacts(getState()), ...contacts];
        dispatch(
            actionCreators.updateContactsAsync.success({ contacts: nextContacts, totalCount }),
        );
    } catch (e) {
        dispatch(actionCreators.updateContactsAsync.failure(e));
    }
};

export const fetchContactPrivateDataThunk = (id: string, domain: string) => {
    return async (
        dispatch: ThunkDispatchCommon,
        getState: ThunkGetState,
        deps: ThunkDependencies,
    ) => {
        dispatch(actionCreators.fetchContactDetailsAsync.request());

        try {
            const { emails, phoneNumbers, quota } = await deps.si.api.contacts.fetchContactDetails(
                id,
                domain,
            );

            const contacts = selectContacts(getState()).map((contact) => {
                if (contact.contactId === id) {
                    return {
                        ...contact,
                        emails,
                        phoneNumbers,
                        isPrivateDataUnlocked: true,
                    };
                } else {
                    return contact;
                }
            });
            dispatch(actionCreators.fetchContactDetailsAsync.success({ contacts, quota }));
        } catch (e) {
            dispatch(actionCreators.fetchContactDetailsAsync.failure(e));
        }
    };
};

export const fetchContactsQuotaThunk = () => {
    return async (
        dispatch: ThunkDispatchCommon,
        getState: ThunkGetState,
        deps: ThunkDependencies,
    ) => {
        dispatch(actionCreators.fetchContactsQuotaAsync.request());

        try {
            const quota = await deps.si.api.contacts.fetchContactsQuota();
            dispatch(actionCreators.fetchContactsQuotaAsync.success(quota));
        } catch (e) {
            dispatch(actionCreators.fetchContactsQuotaAsync.failure(e));
        }
    };
};

export const fetchContactsFiltersThunk = (domain: string) => {
    return async (
        dispatch: ThunkDispatchCommon,
        getState: ThunkGetState,
        deps: ThunkDependencies,
    ) => {
        dispatch(actionCreators.fetchContactsFiltersAsync.request());

        try {
            const filters = await deps.si.api.contacts.fetchContactsFilters(domain);
            const { roles, countries, departments, seniorityLevels } = filters;
            dispatch(
                actionCreators.fetchContactsFiltersAsync.success({
                    roles: convertFilterIdToString(roles),
                    seniorityLevels: convertFilterIdToString(seniorityLevels),
                    departments: convertFilterIdToString(departments),
                    countries: convertFilterIdToString(countries),
                }),
            );
        } catch (e) {
            dispatch(actionCreators.fetchContactsFiltersAsync.failure(e));
        }
    };
};
