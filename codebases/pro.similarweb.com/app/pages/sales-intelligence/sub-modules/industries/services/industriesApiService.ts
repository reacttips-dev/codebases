import { ExcelClientDownloadType } from "components/React/ExcelButton/ExcelClientDownload";
import { createCancelable } from "pages/workspace/sales/helpers";
import { FilterIndustryTableConfig, TableIndustryResponse } from "../types";
import { IFetchService } from "services/fetchService";

export const createIndustriesApiService = (
    fetchService: IFetchService,
    excelDownloadClient: ExcelClientDownloadType,
) => {
    return {
        fetchTableData: createCancelable(
            (
                signal: AbortSignal,
                url: string,
                params: Partial<FilterIndustryTableConfig>,
            ): Promise<TableIndustryResponse> => {
                return fetchService.get(url, params, { cancellation: signal });
            },
        ),
        /**
         * Downloads excel file for list domains table with top leaders
         * @param url
         * @param body
         */
        downloadTopListTableExcel(url: string, body: string[] = []) {
            return excelDownloadClient(url, body);
        },
        /**
         * Downloads excel file for list domains table with selected domains
         * @param url
         * @param body
         */
        downloadSelectedListTableExcel(url: string, body: string[]) {
            return excelDownloadClient(url, body);
        },
    };
};
