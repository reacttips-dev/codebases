import { ICategoriesResponse } from "pages/lead-generator/lead-generator-new/components/filters/TechnographicsBoxFilter";

export enum SearchRunStatus {
    NotStarted,
    InProgress,
    Failed,
    Succeeded,
}

export enum QueryStatus {
    Created,
    Archived,
    Deleted,
    Saved,
}

export type QueryFilters = {
    device: string;
    countries: number[];
    categories: string[];
    // TODO: Add more
};

export type SearchRun = {
    id: string;
    endTime: string;
    beginTime: string;
    topDomains: string;
    requestTime: string;
    resultCount: number;
    usedResultCount: number;
    newSinceLastRun: number;
    runStatus: SearchRunStatus;
    removedSinceLastRun: number;
    returnedSinceLastRun: number;
};

export type QueryDefinition = {
    id: string;
    name: string;
    order_by: string;
    top: number;
    status: QueryStatus;
    filters: QueryFilters;
    created_date: string;
    used_result_count: number;
    auto_rerun_activated: boolean;
};

export type CreateSearchDto = {
    order_by: string;
    filters: QueryFilters;
};

export type CreateSearchResponseDto = {
    queryId: QueryDefinition["id"];
    runId: SearchRun["id"];
};

export type ReportResult = Partial<CreateSearchResponseDto> & Partial<CreateSearchDto>;

export type CreateSearchPreviewResponseDto = {
    totalResultCount: number;
    records: { site: string; [key: string]: any }[];
};

export type SearchTableDataParams = {
    newLeadsOnly?: boolean;
    excludeUserLeads?: boolean;
    top?: number;
    pageSize?: number;
};

export type SaveSearchDto = {
    name: string;
    autoRerunActivated: boolean;
};

export type SearchTableExcelDownloadParams = {
    runId: SearchRun["id"];
    queryId: QueryDefinition["id"];
    search?: string;
    newLeadsOnly?: boolean;
    excludeUserLeads?: boolean;
    top?: number;
    body?: string[];
    sort?: string;
    asc?: boolean;
    orderBy?: string;
};

export type SearchTableDataResponseDto = {
    filteredResultCount: number;
    page: number;
    pageResultCount: number;
    sortBy: string;
    totalResultCount: number;
    records: { site: string; [key: string]: any }[];
};

export type SavedSearchType = {
    lastRun: SearchRun;
    queryDefinition: QueryDefinition;
};

export type NotSavedSearchType = {
    lastRun: Pick<SearchRun, "id">;
    queryDefinition: Pick<QueryDefinition, "id" | "filters" | "order_by">;
};

export type SavedSearchesState = {
    searches: SavedSearchType[];
    // Just created report
    reportResult: ReportResult;
    // Creating new search in lead generator
    searchCreating: boolean;
    searchCreateError?: string;
    // Search table data TODO: Not used currently
    searchTableData: SearchTableDataResponseDto | null;
    searchTableDataFetching: boolean;
    searchTableDataFetchError?: string;
    // Saving search
    searchSaving: boolean;
    searchSaveError?: string;
    // Updating search
    searchUpdating: boolean;
    searchUpdateError?: string;
    // Deleting search
    searchDeleting: boolean;
    searchDeleteError?: string;
    // Modals
    saveSearchModalOpen: boolean;
    savedSearchSettingsModalOpen: boolean;
    // Table excel
    downloadingTableExcel: boolean;
    downloadingTableExcelError?: string;
    // Legacy technologies categories
    technologiesFilters: ICategoriesResponse;
    // Table results count
    tableResultsCount: number;
    countExcelExportedDomains: number;
};
