import { IPromise } from "angular";
import { ICategoriesResponse } from "pages/lead-generator/lead-generator-new/components/filters/TechnographicsBoxFilter";
import { NoCacheHeaders } from "../fetchService";
import BaseWorkspaceApiService from "./baseWorkspaceApiService";

import { IRecommendationTile } from "../../../.pro-features/pages/workspace/common components/RecommendationsSidebar/RecommendationsSidebar";
import { ILeadGeneratorWorkspaceApi } from "../../pages/lead-generator/lead-generator-wizard/types";
import { RECOMMENDATIONS_NUMBER } from "../../pages/workspace/common/consts";
import {
    IEnrichedCommonTableRowParams,
    IOpportunitiesListApiParams,
    IOpportunityListOverview,
    IOpportunityUpdateInfo,
} from "../../pages/workspace/common/types";
import {
    IOpportunitiesListTable,
    IOpportunity,
    IOpportunityCapitalized,
    IOpportunityListItemCapitalized,
    IWorkspace,
} from "./workspaceApi.types";

export const LeadGeneratorInvestorsApi: ILeadGeneratorWorkspaceApi = {
    preview: "/api/investors-opportunities-generator/query/preview",
    query: "/api/investors-opportunities-generator/report",
    results: (queryId, runId) =>
        `/api/investors-opportunities-generator/report/query/${queryId}/run/${runId}/table`,
};

export default class InvestorsWorkspaceApiService extends BaseWorkspaceApiService {
    /**
     * Creates workspace for current user
     *
     * @returns {Promise<IWorkspace>}
     */
    public createWorkspace(): Promise<IWorkspace> {
        return this.fetchService.post(`/api/userdata/workspaces/investors`, {});
    }

    /**
     * Returns list of investor's workspaces related to current user
     *
     * @returns {Promise<IWorkspace[]>}
     */
    public getWorkspaces(): Promise<IWorkspace[]> {
        return this.fetchService.get(`/api/userdata/workspaces/investors`);
    }

    public getWorkspaceOverviewLists(
        workspaceId: string,
        snapshotDate: string,
    ): Promise<IOpportunityListOverview[]> {
        return this.fetchService.get(
            `/api/userdata/workspaces/investors/${workspaceId}?date=${snapshotDate}`,
        );
    }

    /**
     * Returns opportunities data for table
     *
     * @param {Object} params
     * @param {string} params.opportunityListId
     * @param {string} params.workspaceId
     * @param {string} params.date - in format YYYY-MM
     * @param {string} [format] - can Table or Excel
     *
     * @returns Promise<IOpportunitiesListTable>
     */
    public getOpportunitiesList(
        params: IOpportunitiesListApiParams,
        format = "Table",
    ): Promise<IOpportunitiesListTable> {
        return this.fetchService.get(
            `/widgetApi/InvestorsWorkspace/OpportunitiesList/${format}`,
            params,
            {
                headers: NoCacheHeaders,
            },
        );
    }

    /**
     * Creates opportunity list with possibility to fill it with opportunities
     *
     * @param {string} workspaceId
     * @param {Array<IOpportunity>} [opportunities]
     *
     * @returns {Promise<IOpportunityListItemCapitalized>}
     */
    public createOpportunitiesList(
        workspaceId: string,
        listName: string,
        country,
        opportunities: IOpportunity[] = [],
    ): Promise<IOpportunityListItemCapitalized> {
        return this.fetchService.post(
            `/api/userdata/workspaces/investors/workspace/${workspaceId}/opportunity-list?listName=${encodeURIComponent(
                listName,
            )}&country=${country}`,
            opportunities,
        );
    }

    /**
     * Add opportunities to list
     *
     * @param {string} workspaceId
     * @param {string} opportunityListId
     * @param {IOpportunity[]} [opportunities]
     *
     * @returns {Promise<IOpportunityListItemCapitalized>}
     */
    public addOpportunities(
        workspaceId: string,
        opportunityListId: string,
        opportunities: IOpportunity[] = [],
    ): Promise<IOpportunityListItemCapitalized> {
        return this.fetchService.post(
            `/api/userdata/workspaces/investors/workspace/${workspaceId}/opportunity-list/${opportunityListId}`,
            opportunities,
        );
    }

    /**
     * Delete opportunities
     *
     * @param {string} workspaceId
     * @param {string} opportunityListId
     * @param {IOpportunityCapitalized[]} opportunities
     *
     * @returns {Promise}
     */
    public deleteOpportunities(
        workspaceId: string,
        opportunityListId: string,
        opportunities: IOpportunityCapitalized[],
    ) {
        return this.fetchService.delete(
            `/api/userdata/workspaces/investors/workspace/${workspaceId}/opportunity-list/${opportunityListId}`,
            null,
            opportunities,
        );
    }

    /**
     * linkInvestorsOpportunityListToDashboard
     *
     * @param {string} opportunityListId
     * @param {string} dashboardId
     * @param {string} domain
     * @param {number} country
     *
     * @returns {Promise}
     */
    public linkInvestorsOpportunityListToDashboard(
        opportunityListId_opportunityId: string,
        dashboardId: string,
    ) {
        const [opportunityListId, opportunityId] = opportunityListId_opportunityId.split("|");
        return this.fetchService.post(
            `/api/userdata/workspaces/investors/opportunity-list/${opportunityListId}/dashboard/${dashboardId}?opportunityId=${opportunityId}`,
            {},
        );
    }

    /**
     * getEnrichedTableRow
     *
     * @param {string} opportunityListId
     * @param {string} dashboardId
     * @param {string} domain
     * @param {number} country
     * @param {string} from;
     * @param {string} to;
     *
     * @returns {Promise}
     */
    public getEnrichedTableRow(params: IEnrichedCommonTableRowParams): Promise<any> {
        return this.fetchService.get(
            `widgetApi/InvestorsWorkspace/OpportunitiesData/Graphs`,
            params,
        );
    }

    public updateListInfo(
        workspaceId,
        opportunityListId,
        listInfo: IOpportunityUpdateInfo,
    ): Promise<any> {
        return this.fetchService.put(
            `/api/userdata/workspaces/investors/${workspaceId}/opportunity-list/${opportunityListId}`,
            listInfo,
        );
    }

    public deleteList(workspaceId, opportunityListId): Promise<any> {
        return this.fetchService.delete(
            `/api/userdata/workspaces/investors/${workspaceId}/opportunity-list/${opportunityListId}`,
        );
    }

    public getRecommendations(
        workspaceId: string,
        opportunityListId: string,
        lastSnapshotDate,
    ): Promise<IRecommendationTile[]> {
        return this.fetchService.get(
            `widgetApi/InvestorsWorkspace/OpportunitiesData/Recommendations?opportunityListId=${opportunityListId}&workspaceId=${workspaceId}&numberOfResults=${RECOMMENDATIONS_NUMBER}&date=${lastSnapshotDate}`,
        );
    }

    public dismissRecommendation(
        workspaceId: string,
        opportunityListId: string,
        recommendation: string,
    ): Promise<any> {
        return this.fetchService.post(
            `api/userdata/workspaces/investors/workspace/${workspaceId}/opportunity-list/${opportunityListId}/black-list/${recommendation}`,
        );
    }

    public getExcelTableRowHref({
        domain,
        country,
        workspaceId,
        opportunityListId,
        from,
        to,
    }): string {
        return `widgetApi/InvestorsWorkspace/OpportunitiesData/OpportunityExcel?domain=${domain}&country=${country}&workspaceId=${workspaceId}&opportunityListId=${opportunityListId}&from=${from}&to=${to}`;
    }

    public fetchTechnologies = (): IPromise<ICategoriesResponse> => {
        return this.fetchService.get(
            "/api/investors-opportunities-generator/technographics-filters",
        );
    };
}
