import { ExcelClientDownloadType } from "components/React/ExcelButton/ExcelClientDownload";
import { createCancelable } from "pages/workspace/sales/helpers";
import { IFetchService } from "services/fetchService";

export const createKeywordLeadsApiService = (
    fetchService: IFetchService,
    excelDownloadClient: ExcelClientDownloadType,
) => {
    return {
        fetchTotalTable: createCancelable(
            (signal: AbortSignal, params: any): Promise<any> => {
                return fetchService.get(
                    "/widgetApi/KeywordAnalysisOP/KeywordAnalysisTotal/Table",
                    params,
                    {
                        cancellation: signal,
                    },
                );
            },
        ),
        fetchPaidTable: createCancelable(
            (signal: AbortSignal, params: any): Promise<any> => {
                return fetchService.get(
                    "/widgetApi/KeywordAnalysisOP/KeywordAnalysisPaid/Table",
                    params,
                    {
                        cancellation: signal,
                    },
                );
            },
        ),
        fetchOrganicTable: createCancelable(
            (signal: AbortSignal, params: any): Promise<any> => {
                return fetchService.get(
                    "/widgetApi/KeywordAnalysisOP/KeywordAnalysisOrganic/Table",
                    params,
                    { cancellation: signal },
                );
            },
        ),
        fetchMobileTable: createCancelable(
            (signal: AbortSignal, params: any): Promise<any> => {
                return fetchService.get(
                    "/widgetApi/KeywordAnalysisOP/KeywordAnalysisOrganic/Table",
                    params,
                    { cancellation: signal },
                );
            },
        ),

        downloadTopTotalTableExcel(params) {
            const {
                keys,
                country,
                isWindow,
                to,
                from,
                filter,
                orderby,
                includeSubDomains,
                webSource,
                top,
                body = [],
            } = params;
            const url = `/widgetApi/KeywordAnalysisOP/KeywordAnalysisTotal/Excel?country=${country}&includeSubDomains=${includeSubDomains}&includeTopSubdomainsOnly=true&webSource=${webSource}&timeGranularity=Monthly&isWindow=${isWindow}&from=${from}&to=${to}&orderBy=${orderby}&keys=${keys}&filter=${
                filter ? filter : ""
            }&top=${top}`;

            return excelDownloadClient(url, body);
        },

        downloadSelectedTotalTableExcel(params) {
            const {
                keys,
                country,
                isWindow,
                to,
                from,
                filter,
                orderby,
                includeSubDomains,
                webSource,
                body,
            } = params;
            const url = `/widgetApi/KeywordAnalysisOP/KeywordAnalysisTotal/Excel?country=${country}&includeSubDomains=${includeSubDomains}&includeTopSubdomainsOnly=true&webSource=${webSource}&timeGranularity=Monthly&isWindow=${isWindow}&from=${from}&to=${to}&orderBy=${orderby}&keys=${keys}&filter=${
                filter ? filter : ""
            }`;

            return excelDownloadClient(url, body);
        },

        downloadTopPaidTableExcel(params) {
            const {
                keys,
                country,
                isWindow,
                to,
                from,
                filter,
                orderby,
                includeSubDomains,
                webSource,
                top,
            } = params;
            const url = `/widgetApi/KeywordAnalysisOP/KeywordAnalysisPaid/Excel?country=${country}&includeSubDomains=${includeSubDomains}&includeTopSubdomainsOnly=true&webSource=${webSource}&timeGranularity=Monthly&isWindow=${isWindow}&from=${from}&to=${to}&orderBy=${orderby}&keys=${keys}&filter=${
                filter ? filter : ""
            }&top=${top}`;

            return excelDownloadClient(url);
        },

        downloadSelectedPaidTableExcel(params) {
            const {
                keys,
                country,
                isWindow,
                to,
                from,
                filter,
                orderby,
                includeSubDomains,
                webSource,
                body,
            } = params;
            const url = `/widgetApi/KeywordAnalysisOP/KeywordAnalysisPaid/Excel?country=${country}&includeSubDomains=${includeSubDomains}&includeTopSubdomainsOnly=true&webSource=${webSource}&timeGranularity=Monthly&isWindow=${isWindow}&from=${from}&to=${to}&orderBy=${orderby}&keys=${keys}&filter=${
                filter ? filter : ""
            }`;

            return excelDownloadClient(url, body);
        },

        downloadTopOrganicTableExcel(params) {
            const {
                keys,
                country,
                isWindow,
                to,
                from,
                filter,
                orderby,
                includeSubDomains,
                webSource,
                top,
            } = params;
            const url = `/widgetApi/KeywordAnalysisOP/KeywordAnalysisOrganic/Excel?country=${country}&includeSubDomains=${includeSubDomains}&includeTopSubdomainsOnly=true&webSource=${webSource}&timeGranularity=Monthly&isWindow=${isWindow}&from=${from}&to=${to}&orderBy=${orderby}&keys=${keys}&filter=${
                filter ? filter : ""
            }$top=${top}`;

            return excelDownloadClient(url);
        },

        downloadSelectedOrganicTableExcel(params) {
            const {
                keys,
                country,
                isWindow,
                to,
                from,
                filter,
                orderby,
                includeSubDomains,
                webSource,
                body,
            } = params;
            const url = `/widgetApi/KeywordAnalysisOP/KeywordAnalysisOrganic/Excel?country=${country}&includeSubDomains=${includeSubDomains}&includeTopSubdomainsOnly=true&webSource=${webSource}&timeGranularity=Monthly&isWindow=${isWindow}&from=${from}&to=${to}&orderBy=${orderby}&keys=${keys}&filter=${
                filter ? filter : ""
            }`;

            return excelDownloadClient(url, body);
        },

        downloadTopMobileTableExcel(params) {
            const {
                keys,
                country,
                isWindow,
                to,
                from,
                filter,
                orderby,
                includeSubDomains,
                webSource,
                top,
            } = params;
            const url = `/widgetApi/KeywordAnalysisOP/KeywordAnalysisOrganic/Excel?country=${country}&includeSubDomains=${includeSubDomains}&includeTopSubdomainsOnly=true&webSource=${webSource}&timeGranularity=Monthly&isWindow=${isWindow}&from=${from}&to=${to}&orderBy=${orderby}&keys=${keys}&filter=${
                filter ? filter : ""
            }&top=${top}`;

            return excelDownloadClient(url);
        },

        downloadSelectedMobileTableExcel(params) {
            const {
                keys,
                country,
                isWindow,
                to,
                from,
                filter,
                orderby,
                includeSubDomains,
                webSource,
                body,
            } = params;
            const url = `/widgetApi/KeywordAnalysisOP/KeywordAnalysisOrganic/Excel?country=${country}&includeSubDomains=${includeSubDomains}&includeTopSubdomainsOnly=true&webSource=${webSource}&timeGranularity=Monthly&isWindow=${isWindow}&from=${from}&to=${to}&orderBy=${orderby}&keys=${keys}&filter=${
                filter ? filter : ""
            }`;

            return excelDownloadClient(url, body);
        },
    };
};
