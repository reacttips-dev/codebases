import { IPromise } from "angular";
import { ICategoriesResponse } from "pages/lead-generator/lead-generator-new/components/filters/TechnographicsBoxFilter";
import { NoCacheHeaders } from "../fetchService";
import BaseWorkspaceApiService from "./baseWorkspaceApiService";

import { ILeadGeneratorWorkspaceApi } from "pages/lead-generator/lead-generator-wizard/types";
import { IRecommendationTile } from "pages/workspace/common components/RecommendationsSidebar/RecommendationsSidebar";
import { RECOMMENDATIONS_NUMBER } from "pages/workspace/common/consts";
import {
    IEnrichedCommonTableRowParams,
    IListUpdateSettings,
    IOpportunitiesListApiParams,
    IOpportunityListOverview,
    IOpportunityUpdateInfo,
    IWebsiteFeedItem,
    IWebsiteFeedParams,
} from "pages/workspace/common/types";
import {
    IOpportunitiesListTable,
    IOpportunity,
    IOpportunityCapitalized,
    IOpportunityListItemCapitalized,
    IWorkspace,
} from "./workspaceApi.types";

export const LeadGeneratorSalesApi: ILeadGeneratorWorkspaceApi = {
    preview: "/api/sales-leads-generator/query/preview",
    query: "/api/sales-leads-generator/report",
    results: (queryId, runId) =>
        `/api/sales-leads-generator/report/query/${queryId}/run/${runId}/table`,
};

const API_USERDATA_WS = "/api/userdata/workspaces/sales";
const API_WIDGET_WS = "/widgetApi/SalesWorkspace";

/**
 * @deprecated
 * Please use salesApiService from sales/services/salesApiService
 */
export default class SalesWorkspaceApiService extends BaseWorkspaceApiService {
    /**
     * Creates workspace for current user
     *
     * @returns {Promise<IWorkspace>}
     */
    public createWorkspace(): Promise<IWorkspace> {
        return this.fetchService.post(`${API_USERDATA_WS}`, {});
    }

    /**
     * Returns list of sales's workspaces related to current user
     *
     * @returns {Promise<IWorkspace[]>}
     */
    public getWorkspaces(): Promise<IWorkspace[]> {
        return this.fetchService.get(`${API_USERDATA_WS}`);
    }

    public getWorkspaceOverviewLists(
        workspaceId: string,
        snapshotDate: string,
    ): Promise<IOpportunityListOverview[]> {
        return this.fetchService.get(
            `${API_USERDATA_WS}/${workspaceId}`,
            {
                date: snapshotDate,
            },
            {
                preventAutoCancellation: true,
            },
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
        return this.fetchService.get(`${API_WIDGET_WS}/OpportunitiesList/${format}`, params, {
            headers: NoCacheHeaders,
        });
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
            `${API_USERDATA_WS}` +
                `/workspace/${workspaceId}/` +
                `opportunity-list?listName=${encodeURIComponent(listName)}&country=${country}`,
            opportunities,
        );
    }

    /**
     * Add opportunities to list
     *
     * @param {string} workspaceId
     * @param {string} opportunityListId
     * @param {string} queryId
     * @param {string} runId
     * @param {IOpportunity[]} [opportunities]
     *
     * @returns {Promise<IOpportunityListItemCapitalized>}
     */
    public addOpportunities(
        workspaceId: string,
        opportunityListId: string,
        opportunities: IOpportunity[] = [],
        queryId = "",
        runId = "",
    ): Promise<IOpportunityListItemCapitalized> {
        return this.fetchService.post(
            `${API_USERDATA_WS}/workspace/${workspaceId}/opportunity-list/${opportunityListId}` +
                `?queryId=${queryId}&runId=${runId}`,
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
            `${API_USERDATA_WS}/workspace/${workspaceId}/opportunity-list/${opportunityListId}`,
            null,
            opportunities,
        );
    }

    /**
     * linkSalesOpportunityListToDashboard
     *
     * @param {string} opportunityListId
     * @param {string} dashboardId
     * @param {string} domain
     * @param {number} country
     *
     * @returns {Promise}
     */
    public linkSalesOpportunityListToDashboard(
        opportunityListId_opportunityId: string,
        dashboardId: string,
    ) {
        const [opportunityListId, opportunityId] = opportunityListId_opportunityId.split("|");
        return this.fetchService.post(
            `${API_USERDATA_WS}` +
                `/opportunity-list/${opportunityListId}/dashboard/${dashboardId}?opportunityId=${opportunityId}`,
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
        return this.fetchService.get(`${API_WIDGET_WS}/OpportunitiesData/Graphs`, params);
    }

    public updateListInfo(
        workspaceId,
        opportunityListId,
        listInfo: IOpportunityUpdateInfo,
    ): Promise<any> {
        return this.fetchService.put(
            `${API_USERDATA_WS}/${workspaceId}/opportunity-list/${opportunityListId}`,
            listInfo,
        );
    }

    public deleteList(workspaceId, opportunityListId): Promise<any> {
        return this.fetchService.delete(
            `${API_USERDATA_WS}/${workspaceId}/opportunity-list/${opportunityListId}`,
        );
    }

    public getRecommendations(
        workspaceId: string,
        opportunityListId: string,
        lastSnapshotDate,
    ): Promise<IRecommendationTile[]> {
        return this.fetchService.get(
            `${API_WIDGET_WS}/OpportunitiesData/Recommendations` +
                `?opportunityListId=${opportunityListId}&workspaceId=${workspaceId}` +
                `&numberOfResults=${RECOMMENDATIONS_NUMBER}&date=${lastSnapshotDate}`,
        );
    }

    public dismissRecommendation(
        workspaceId: string,
        opportunityListId: string,
        recommendation: string,
    ): Promise<any> {
        return this.fetchService.post(
            `${API_USERDATA_WS}/workspace/${workspaceId}/` +
                `opportunity-list/${opportunityListId}/black-list/${recommendation}`,
        );
    }

    public getExcelTableRowHref({
        domain,
        country,
        workspaceId,
        opportunityListId,
        from,
        to,
        key,
    }): string {
        return (
            `${API_WIDGET_WS}/OpportunitiesData/OpportunityExcel` +
            `?domain=${domain || key}&country=${country}&workspaceId=${workspaceId}` +
            `${
                opportunityListId && `&opportunityListId=${opportunityListId}`
            }&from=${from}&to=${to}`
        );
    }

    public getWebsiteFeed(params: IWebsiteFeedParams): Promise<IWebsiteFeedItem[]> {
        return this.fetchService.get(`${API_WIDGET_WS}/OpprotunitiesData/GetFeed`, params);
    }

    public updateOpportunityListSettings({
        opportunityListId,
        workspaceId,
        settings,
    }: IListUpdateSettings): Promise<any> {
        return this.fetchService.post(
            `${API_USERDATA_WS}/workspace/${workspaceId}/opportunity-list/${opportunityListId}/settings`,
            settings,
        );
    }

    public setFeedItemsSeen(workspaceId, opportunityListId, domain, feedItemsIds): Promise<any> {
        return this.fetchService.post(
            `${API_WIDGET_WS}/OpprotunitiesData/SeenItemsFeed` +
                `?workspaceId=${workspaceId}&opportunityListId=${opportunityListId}&domain=${domain}`,
            { feedItemsIds },
        );
    }

    public setFeedItemFeedback(
        workspaceId,
        opportunityListId,
        domain,
        feedItemsId,
        feedbackType,
        feedbackText,
    ): Promise<any> {
        return this.fetchService.post(
            `${API_WIDGET_WS}/OpprotunitiesData/FeedbackFeedItem` +
                `?workspaceId=${workspaceId}&opportunityListId=${opportunityListId}&domain=${domain}`,
            {
                feedItemsId,
                feedbackType,
                feedbackText,
            },
        );
    }

    public fetchTechnologies = (): IPromise<ICategoriesResponse> => {
        return this.fetchService.get("/api/sales-leads-generator/technographics-filters");
    };

    public subscribeEmailDigest(workspaceId, opportunityListId): Promise<any> {
        return this.fetchService.post(
            `${API_USERDATA_WS}/${workspaceId}` +
                `/opportunity-list/${opportunityListId}` +
                `/activate-digest`,
        );
    }

    public unSubscribeEmailDigest(workspaceId, opportunityListId): Promise<any> {
        return this.fetchService.post(
            `${API_USERDATA_WS}/${workspaceId}` +
                `/opportunity-list/${opportunityListId}` +
                `/deactivate-digest`,
        );
    }

    public unsubscribeFromMonthlyDigest = () =>
        this.fetchService.post(`${API_USERDATA_WS}/saved-searches/digest/unsubscribe`);
}
