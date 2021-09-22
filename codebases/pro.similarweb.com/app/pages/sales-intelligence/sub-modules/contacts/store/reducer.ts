import { FetchError } from "pages/sales-intelligence/types";
import { createReducer } from "typesafe-actions";
import * as actionCreators from "./action-creators";
import { Contact, ContactsFilters, ContactsQuota } from "./types";

export type ContactsState = {
    contacts: Contact[];
    totalCount: number;
    loadingContacts: boolean;
    updatingContacts: boolean;
    updatingContactDetails: boolean;
    quota: ContactsQuota;
    loadingQuota: boolean;
    filters: ContactsFilters;
    loadingFilters: boolean;
    isEmptyState: boolean;
    fetchContactsFiltersError: FetchError;
    fetchContactsError: FetchError;
    updateContactsError: FetchError;
    fetchContactsQuotaError: FetchError;
    fetchContactDetailsError: FetchError;
};

const INITIAL_CONTACTS_STATE: ContactsState = {
    contacts: [],
    loadingContacts: false,
    updatingContacts: false,
    updatingContactDetails: false,
    totalCount: 0,
    quota: {
        isFeatureLocked: true,
        remaining: 0,
        total: 0,
        used: 0,
    },
    loadingQuota: false,
    filters: { roles: [], departments: [], countries: [], seniorityLevels: [] },
    loadingFilters: false,
    isEmptyState: false,
    fetchContactsFiltersError: undefined,
    fetchContactsError: undefined,
    updateContactsError: undefined,
    fetchContactsQuotaError: undefined,
    fetchContactDetailsError: undefined,
};

const ContactsReducer = createReducer(INITIAL_CONTACTS_STATE)
    .handleAction(actionCreators.fetchContactsAsync.success, (state, { payload }) => {
        return {
            ...state,
            contacts: payload.contacts,
            totalCount: payload.totalCount,
            loadingContacts: false,
            isEmptyState: payload.isEmptyState,
        };
    })
    .handleAction(actionCreators.fetchContactsAsync.request, (state) => ({
        ...state,
        loadingContacts: true,
        isEmptyState: false,
        fetchContactsError: undefined,
    }))
    .handleAction(actionCreators.fetchContactsAsync.failure, (state, { payload }) => ({
        ...state,
        loadingContacts: false,
        isEmptyState: state.totalCount === 0,
        fetchContactsError: payload,
    }))
    .handleAction(actionCreators.updateContactsAsync.success, (state, { payload }) => {
        return {
            ...state,
            contacts: payload.contacts,
            totalCount: payload.totalCount,
            updatingContacts: false,
        };
    })
    .handleAction(actionCreators.updateContactsAsync.request, (state) => ({
        ...state,
        updatingContacts: true,
        updateContactsError: undefined,
    }))
    .handleAction(actionCreators.updateContactsAsync.failure, (state, { payload }) => ({
        ...state,
        updatingContacts: false,
        updateContactsError: payload,
    }))
    .handleAction(actionCreators.fetchContactDetailsAsync.request, (state) => ({
        ...state,
        updatingContactDetails: true,
        fetchContactDetailsError: undefined,
    }))
    .handleAction(actionCreators.fetchContactDetailsAsync.failure, (state, { payload }) => ({
        ...state,
        updatingContactDetails: false,
        fetchContactDetailsError: payload,
    }))
    .handleAction(actionCreators.fetchContactDetailsAsync.success, (state, { payload }) => {
        return {
            ...state,
            contacts: payload.contacts,
            quota: payload.quota,
            updatingContactDetails: false,
        };
    })
    .handleAction(actionCreators.fetchContactsQuotaAsync.request, (state) => ({
        ...state,
        loadingQuota: true,
        fetchContactsQuotaError: undefined,
    }))
    .handleAction(actionCreators.fetchContactsQuotaAsync.failure, (state, { payload }) => ({
        ...state,
        loadingQuota: false,
        fetchContactsQuotaError: payload,
    }))
    .handleAction(actionCreators.fetchContactsQuotaAsync.success, (state, { payload }) => {
        return {
            ...state,
            quota: payload,
            loadingQuota: false,
        };
    })
    .handleAction(actionCreators.fetchContactsFiltersAsync.request, (state) => ({
        ...state,
        loadingFilters: true,
        fetchContactsFiltersError: undefined,
    }))
    .handleAction(actionCreators.fetchContactsFiltersAsync.failure, (state, { payload }) => ({
        ...state,
        loadingFilters: false,
        fetchContactsFiltersError: payload,
    }))
    .handleAction(actionCreators.fetchContactsFiltersAsync.success, (state, { payload }) => {
        return {
            ...state,
            filters: payload,
            loadingFilters: false,
        };
    });

export default ContactsReducer;
