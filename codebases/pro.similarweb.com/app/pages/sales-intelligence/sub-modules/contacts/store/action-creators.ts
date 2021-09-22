import { createAsyncAction } from "typesafe-actions";
import { FetchError } from "pages/sales-intelligence/types";
import {
    Contact,
    ContactsFilters,
    ContactsQuota,
} from "pages/sales-intelligence/sub-modules/contacts/store/types";

export const fetchContactsAsync = createAsyncAction(
    "@@si/contacts/FETCH_CONTACTS_START",
    "@@si/contacts/FETCH_CONTACTS_SUCCESS",
    "@@si/contacts/FETCH_CONTACTS_FAILURE",
)<void, { contacts: Contact[]; totalCount: number; isEmptyState: boolean }, FetchError>();

export const updateContactsAsync = createAsyncAction(
    "@@si/contacts/UPDATE_CONTACTS_START",
    "@@si/contacts/UPDATE_CONTACTS_SUCCESS",
    "@@si/contacts/UPDATE_CONTACTS_FAILURE",
)<void, { contacts: Contact[]; totalCount: number }, FetchError>();

export const fetchContactDetailsAsync = createAsyncAction(
    "@@si/contacts/FETCH_CONTACT_DETAILS_START",
    "@@si/contacts/FETCH_CONTACT_DETAILS_SUCCESS",
    "@@si/contacts/FETCH_CONTACT_DETAILS_FAILURE",
)<void, { contacts: Contact[]; quota: ContactsQuota }, FetchError>();

export const fetchContactsQuotaAsync = createAsyncAction(
    "@@si/contacts/FETCH_CONTACTS_QUOTA_START",
    "@@si/contacts/FETCH_CONTACTS_QUOTA_SUCCESS",
    "@@si/contacts/FETCH_CONTACTS_QUOTA_FAILURE",
)<void, ContactsQuota, FetchError>();

export const fetchContactsFiltersAsync = createAsyncAction(
    "@@si/contacts/FETCH_CONTACTS_FILTERS_START",
    "@@si/contacts/FETCH_CONTACTS_FILTERS_SUCCESS",
    "@@si/contacts/FETCH_CONTACTS_FILTERS_FAILURE",
)<void, ContactsFilters, FetchError>();
