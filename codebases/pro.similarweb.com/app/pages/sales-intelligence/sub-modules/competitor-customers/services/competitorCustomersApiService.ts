import { ExcelClientDownloadType } from "components/React/ExcelButton/ExcelClientDownload";
import {
    IncomingTrafficTableParams,
    OutgoingTrafficTableParams,
    TrafficTableResponse,
} from "../types";
import { createCancelable } from "pages/workspace/sales/helpers";
import { IFetchService } from "services/fetchService";

const createCompetitorCustomersApiService = (
    fetchService: IFetchService,
    excelDownloadClient: ExcelClientDownloadType,
) => {
    const getCorrectIncomingTrafficEndpointUrl = (webSource: string) => {
        if (webSource === "MobileWeb") {
            return "GetTrafficSourcesMobileWebReferralsTable";
        }

        if (webSource === "Total") {
            return "GetTrafficSourcesTotalReferralsTable";
        }

        return "GetTrafficSourcesReferralsTable";
    };

    return {
        /**
         * Requests data for outgoing traffic table
         * @param params
         */
        fetchOutgoingTrafficTable: createCancelable(
            (
                signal: AbortSignal,
                params: OutgoingTrafficTableParams,
            ): Promise<TrafficTableResponse> => {
                return fetchService.get("/api/websiteanalysis/GetOutgoingTable", params, {
                    cancellation: signal,
                });
            },
        ),
        /**
         * Requests data for incoming traffic table
         * @param params
         */
        fetchIncomingTrafficTable: createCancelable(
            (
                signal: AbortSignal,
                params: IncomingTrafficTableParams,
            ): Promise<TrafficTableResponse> => {
                return fetchService.get(
                    `/api/websiteanalysis/${getCorrectIncomingTrafficEndpointUrl(
                        params.webSource,
                    )}`,
                    params,
                    {
                        cancellation: signal,
                    },
                );
            },
        ),
        /**
         * Requests table data excel download
         * @param params
         */
        downloadTopOutgoingTableExcel(params: OutgoingTrafficTableParams) {
            const {
                key,
                country,
                isWWW,
                isWindow,
                to,
                from,
                filter,
                orderby,
                top,
                body = [],
            } = params;
            const url = `/export/analysis/GetOutgoingTsv?key=${key}&country=${country}&isWWW=${isWWW}&isWindow=${isWindow}&from=${from}&to=${to}&orderBy=${orderby}&filter=${
                filter ? filter : ""
            }&top=${top}&includeFilteredDataOnly=true&includeTopSubdomainsOnly=true`;

            return excelDownloadClient(url, body);
        },
        /**
         * Requests table data excel download with post request
         * @param params
         */
        downloadSelectedOutgoingTableExcel(params: OutgoingTrafficTableParams) {
            const { key, country, isWWW, isWindow, to, from, filter, orderby, body } = params;
            const url = `/export/analysis/GetOutgoingTsv?key=${key}&country=${country}&isWWW=${isWWW}&isWindow=${isWindow}&from=${from}&to=${to}&includeFilteredDataOnly=true&includeTopSubdomainsOnly=true&orderBy=${orderby}&filter=${
                filter ? filter : ""
            }`;

            return excelDownloadClient(url, body);
        },
        /**
         * Requests table data excel download
         * @param params
         */
        downloadTopIncomingTableExcel(params: IncomingTrafficTableParams) {
            const {
                key,
                country,
                isWWW,
                isWindow,
                webSource,
                to,
                from,
                filter,
                orderBy,
                top,
                body = [],
            } = params;
            const url = `/export/analysis/GetTrafficSourcesReferralsTsv?key=${key}&country=${country}&isWWW=${isWWW}&isWindow=${isWindow}&webSource=${webSource}&from=${from}&to=${to}&orderBy=${orderBy}&filter=${
                filter ? filter : ""
            }&top=${top}&includeFilteredDataOnly=true&includeTopSubdomainsOnly=true`;

            return excelDownloadClient(url, body);
        },
        /**
         * Requests table data excel download
         * @param params
         */
        downloadSelectedIncomingTableExcel(params: IncomingTrafficTableParams) {
            const {
                key,
                country,
                isWWW,
                isWindow,
                webSource,
                to,
                from,
                filter,
                orderBy,
                body,
            } = params;
            const url = `/export/analysis/GetTrafficSourcesReferralsTsv?key=${key}&country=${country}&isWWW=${isWWW}&isWindow=${isWindow}&webSource=${webSource}&from=${from}&to=${to}&orderBy=${orderBy}&includeFilteredDataOnly=true&includeTopSubdomainsOnly=true&filter=${
                filter ? filter : ""
            }`;

            return excelDownloadClient(url, body);
        },
    };
};

export default createCompetitorCustomersApiService;
