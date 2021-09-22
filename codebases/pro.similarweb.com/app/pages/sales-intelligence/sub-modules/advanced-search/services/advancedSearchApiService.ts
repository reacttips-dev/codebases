import { IFetchService, NoCacheHeaders } from "services/fetchService";
import { createCancelable } from "pages/workspace/sales/helpers";
import {
    FiltersConfigResponseDto,
    NewSearchDto,
    SavedSearchDto,
    SearchResultsRequestDto,
    SearchResultsResponseDto,
    SimplifiedSavedSearchDto,
} from "../types/common";

export const createAdvancedSearchApiService = (fetchService: IFetchService) => {
    return {
        fetchFiltersConfiguration(): Promise<FiltersConfigResponseDto> {
            return fetchService.get("/api/sales-leads-generator/v2/description");
        },
        fetchAllSavedSearches(): Promise<SimplifiedSavedSearchDto[]> {
            return fetchService.get(`/api/sales-leads-generator/v2/searches`, undefined, {
                headers: NoCacheHeaders,
            });
        },
        fetchSearchById(id: string): Promise<SavedSearchDto> {
            return fetchService.get(`/api/sales-leads-generator/v2/searches/${id}`);
        },
        saveNewSearch(dto: NewSearchDto): Promise<SavedSearchDto> {
            return fetchService.post("/api/sales-leads-generator/v2/searches", dto);
        },
        updateSearchById(id: string, dto: NewSearchDto): Promise<SavedSearchDto> {
            return fetchService.put(`/api/sales-leads-generator/v2/searches/${id}`, dto);
        },
        deleteSearchById(id: string): Promise<Response> {
            return fetchService.delete(`/api/sales-leads-generator/v2/searches/${id}`);
        },
        fetchSearchResults: createCancelable(
            /**
             * Requesting search results by given dto
             * @param signal
             * @param dto
             */
            (
                signal: AbortSignal,
                dto: SearchResultsRequestDto,
            ): Promise<SearchResultsResponseDto> => {
                return fetchService.post("/api/sales-leads-generator/v2/leads", dto, {
                    cancellation: signal,
                });
            },
        ),
        fetchUserWorkspaceId(): Promise<{ workspaceId: string }> {
            return fetchService.get("/api/sales-leads-generator/v2/workspaces");
        },
    };
};
