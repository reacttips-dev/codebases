import { IFetchService, NoCacheHeaders } from "services/fetchService";
import { ExcelClientDownloadType } from "components/React/ExcelButton/ExcelClientDownload";
import {
    CreateOpportunityListDto,
    CreateOpportunityListResponse,
    OpportunityListType,
    UpdateOpportunityListDto,
    OpportunityListSettings,
    ListTableDataRequestParams,
    ListTableDataResponseDto,
    AddOpportunitiesToListDto,
    AddOpportunitiesToListResponseDto,
    ListTableExcelDownloadParams,
    ListRecommendationsRequestParams,
    ListRecommendationType,
} from "../types";

// TODO: Extract endpoints to constants
export const createOpportunitiesApiService = (
    fetchService: IFetchService,
    excelDownloadClient: ExcelClientDownloadType,
) => {
    return {
        /**
         * Requests data for a list table
         * @param params
         * @param includeNoCacheHeaders
         */
        fetchOpportunityListTableData(
            params: ListTableDataRequestParams,
            includeNoCacheHeaders = true,
        ): Promise<ListTableDataResponseDto> {
            return fetchService.get(`/widgetApi/SalesWorkspace/OpportunitiesList/Table`, params, {
                headers: includeNoCacheHeaders ? NoCacheHeaders : undefined,
            });
        },
        /**
         * Requests recommendations for given list id
         * @param params
         */
        fetchListRecommendations(
            params: ListRecommendationsRequestParams,
        ): Promise<ListRecommendationType[]> {
            return fetchService.get(
                "/widgetApi/SalesWorkspace/OpportunitiesData/Recommendations",
                params,
            );
        },
        /**
         * Create new opportunity list with given params
         * @param dto
         */
        createOpportunityList(
            dto: CreateOpportunityListDto,
        ): Promise<CreateOpportunityListResponse> {
            const { name, country, domains, workspaceId, queryId, runId } = dto;

            return fetchService.post(
                `/api/userdata/workspaces/sales/workspace/${workspaceId}/opportunity-list?listName=${encodeURIComponent(
                    name,
                )}&country=${country}&queryId=${queryId}&runId=${runId}`,
                domains,
            );
        },
        /**
         * Updates opportunity list via PATCH
         * @param workspaceId
         * @param id
         * @param dto
         */
        updateOpportunityList(
            workspaceId: string,
            id: OpportunityListType["opportunityListId"],
            dto: Partial<Pick<OpportunityListType, "country" | "friendlyName">>,
        ): Promise<OpportunityListType> {
            return fetchService.patch(
                `/api/userdata/workspaces/sales/${workspaceId}/opportunity-list/${id}`,
                dto,
            );
        },
        /**
         * @deprecated - Use "updateOpportunityList"
         * Updates given opportunity list
         * @param workspaceId
         * @param listId
         * @param dto
         */
        updateOpportunityListOld(
            workspaceId: string,
            listId: OpportunityListType["opportunityListId"],
            dto: UpdateOpportunityListDto,
        ): Promise<OpportunityListType> {
            return fetchService.put(
                `/api/userdata/workspaces/sales/${workspaceId}/opportunity-list/${listId}`,
                dto,
            );
        },
        /**
         * Updates settings for opportunity list
         * @param workspaceId
         * @param listId
         * @param dto
         */
        updateOpportunityListSettings(
            workspaceId: string,
            listId: OpportunityListType["opportunityListId"],
            dto: OpportunityListSettings,
            // TODO: Ask BE to return a result
        ): Promise<void> {
            return fetchService.post(
                `/api/userdata/workspaces/sales/workspace/${workspaceId}/opportunity-list/${listId}/settings`,
                dto,
            );
        },
        /**
         * Updates opportunities for opportunity list
         * @param workspaceId
         * @param listId
         * @param opportunities
         */
        updateListOpportunities(
            workspaceId: string,
            listId: OpportunityListType["opportunityListId"],
            opportunities: { Domain: string }[],
        ): Promise<void> {
            return fetchService.post(
                `/api/userdata/workspaces/sales/workspace/${workspaceId}/opportunity-list/${listId}`,
                opportunities,
            );
        },
        /**
         * Deletes opportunity list by given id
         * @param workspaceId
         * @param listId
         */
        deleteOpportunityList(
            workspaceId: string,
            listId: OpportunityListType["opportunityListId"],
        ): Promise<Response> {
            return fetchService.delete(
                `/api/userdata/workspaces/sales/${workspaceId}/opportunity-list/${listId}`,
            );
        },
        /**
         * Adding websites to list
         * @param workspaceId
         * @param listId
         * @param dto
         */
        addOpportunitiesToList(
            workspaceId: string,
            listId: OpportunityListType["opportunityListId"],
            dto: AddOpportunitiesToListDto,
        ): Promise<AddOpportunitiesToListResponseDto> {
            return fetchService.post(
                `/api/userdata/workspaces/sales/${workspaceId}/opportunity-list/${listId}/opportunities`,
                dto,
            );
        },
        /**
         * Removing websites from list
         * @param workspaceId
         * @param listId
         * @param opportunities
         */
        removeOpportunitiesFromList(
            workspaceId: string,
            listId: OpportunityListType["opportunityListId"],
            opportunities: string[],
        ) {
            return fetchService.delete(
                `/api/userdata/workspaces/sales/${workspaceId}/opportunity-list/${listId}/opportunities`,
                undefined,
                opportunities,
            );
        },
        /**
         * Downloads excel file for list domains table
         * @param params
         */
        downloadTopListTableExcel(params: ListTableExcelDownloadParams) {
            const { date, workspaceId, opportunitiesListId, top, orderBy } = params;
            const url = `/widgetApi/SalesWorkspace/OpportunitiesList/Excel?opportunitiesListId=${opportunitiesListId}&workspaceId=${workspaceId}&date=${date}&top=${top}&orderBy=${orderBy}`;

            return excelDownloadClient(url);
        },
        /**
         * Downloads excel file for list domains table
         * @param params
         */
        downloadSelectedListTableExcel(params: ListTableExcelDownloadParams) {
            const { date, workspaceId, opportunitiesListId, body } = params;
            const url = `/widgetApi/SalesWorkspace/OpportunitiesList/Excel?opportunitiesListId=${opportunitiesListId}&workspaceId=${workspaceId}&date=${date}`;

            return excelDownloadClient(url, body);
        },
        /**
         * Requests given recommendation domain dismiss
         * @param workspaceId
         * @param listId
         * @param domain
         */
        dismissRecommendation(
            workspaceId: string,
            listId: OpportunityListType["opportunityListId"],
            domain: string,
        ): Promise<void> {
            return fetchService.post(
                `/api/userdata/workspaces/sales/workspace/${workspaceId}/opportunity-list/${listId}/black-list/${domain}`,
                {},
            );
        },
    };
};
