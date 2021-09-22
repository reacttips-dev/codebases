import {
    CreateSearchDto,
    CreateSearchResponseDto,
    QueryDefinition,
    SearchRun,
    SearchTableDataParams,
    SaveSearchDto,
    SearchTableDataResponseDto,
    SavedSearchType,
    CreateSearchPreviewResponseDto,
    SearchTableExcelDownloadParams,
} from "../types";
import { ExcelClientDownloadType } from "components/React/ExcelButton/ExcelClientDownload";
import { ICategoriesResponse } from "pages/lead-generator/lead-generator-new/components/filters/TechnographicsBoxFilter";
import { getUrlDownloadExcelLeadGeneration } from "../helpers";
import { IFetchService } from "services/fetchService";

export const createSearchesApiService = (
    fetchService: IFetchService,
    excelDownloadClient: ExcelClientDownloadType,
) => {
    return {
        /**
         * Requests search results for given filters
         * @param dto
         */
        createSearch(dto: CreateSearchDto): Promise<CreateSearchResponseDto> {
            return fetchService.post("/api/sales-leads-generator/report", dto);
        },
        /**
         * Requests search preview for given filters
         * @param dto
         */
        fetchSearchPreview(dto: CreateSearchDto): Promise<CreateSearchPreviewResponseDto> {
            return fetchService.post("/api/sales-leads-generator/query/preview", dto);
        },
        /**
         * Requests table data for given search
         * @param queryId
         * @param runId
         * @param params
         */
        fetchSearchTableData(
            queryId: QueryDefinition["id"],
            runId: SearchRun["id"],
            params: SearchTableDataParams = {},
        ): Promise<SearchTableDataResponseDto> {
            return fetchService.get(
                `/api/sales-leads-generator/report/query/${queryId}/run/${runId}/table`,
                params,
            );
        },
        /**
         * Request to save a search with given params
         * @param queryId
         * @param dto
         */
        updateSearch(queryId: QueryDefinition["id"], dto: SaveSearchDto): Promise<SavedSearchType> {
            return fetchService.post(`/api/sales-leads-generator/report/query/${queryId}`, dto);
        },
        /**
         * Request to delete a search with given params
         * @param queryId
         */
        deleteSearch(queryId: QueryDefinition["id"]): Promise<Response> {
            return fetchService.delete(`/api/sales-leads-generator/report/query/${queryId}`);
        },
        /**
         * Downloads excel file for search results table
         * @param params
         */

        downloadTopSearchTableExcel(params: SearchTableExcelDownloadParams) {
            return excelDownloadClient(getUrlDownloadExcelLeadGeneration(params));
        },
        /**
         * Downloads excel file for search results table
         * @param params
         */
        downloadSelectedSearchTableExcel(params: SearchTableExcelDownloadParams) {
            const {
                runId,
                queryId,
                search = "",
                newLeadsOnly = false,
                excludeUserLeads = true,
                body,
            } = params;
            const url = `/api/sales-leads-generator/report/query/${queryId}/run/${runId}/excel?search=${search}&excludeUserLeads=${excludeUserLeads}&newLeadsOnly=${newLeadsOnly}`;

            return excelDownloadClient(url, body);
        },
        /**
         * Requests technologies filters for lead generator
         */
        fetchTechnologiesFilters(): Promise<ICategoriesResponse> {
            return fetchService.get("/api/sales-leads-generator/technographics-filters");
        },
    };
};
