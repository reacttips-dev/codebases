import { createCancelable } from "pages/workspace/sales/helpers";
import { IFetchService } from "services/fetchService";
import {
    ContactsDetailsResponse,
    ContactsFiltersResponse,
    ContactsParams,
    ContactsQuota,
    ContactsResponse,
} from "pages/sales-intelligence/sub-modules/contacts/store/types";

export const createContactsApiService = (fetchService: IFetchService) => {
    return {
        fetchContactsData: createCancelable(
            (
                signal: AbortSignal,
                domain: string,
                params: ContactsParams,
            ): Promise<ContactsResponse> => {
                return fetchService.get(`api/prospects/${domain}/contacts`, params, {
                    cancellation: signal,
                });
            },
        ),
        fetchContactDetails: createCancelable(
            (signal: AbortSignal, id: string, domain: string): Promise<ContactsDetailsResponse> => {
                return fetchService.get(
                    `api/prospects/${domain}/contacts/${id}/private-data`,
                    null,
                    { cancellation: signal },
                );
            },
        ),
        fetchContactsQuota: createCancelable(
            (signal: AbortSignal): Promise<ContactsQuota> => {
                return fetchService.get(`api/contacts/quota`, null, { cancellation: signal });
            },
        ),
        fetchContactsFilters: createCancelable(
            (signal: AbortSignal, domain: string): Promise<ContactsFiltersResponse> => {
                return fetchService.get(`api/prospects/${domain}/contacts/filters`, null, {
                    cancellation: signal,
                });
            },
        ),
    };
};
