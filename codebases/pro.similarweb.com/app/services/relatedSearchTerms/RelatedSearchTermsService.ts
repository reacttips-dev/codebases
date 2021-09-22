import { apiHelper } from "common/services/apiHelper";
import { DefaultFetchService } from "services/fetchService";
import { SwLog } from "@similarweb/sw-log";
import {
    IRelatedSearchTerm,
    IRelatedSearchTermsRequest,
    IRelatedSearchTermsResult,
} from "./RelatedSearchTermsServiceTypes";

export class RelatedSearchTermsService {
    private fetchService = DefaultFetchService.getInstance();
    private apiEndpoint = "/api/recommendations/keywords/similar/10";

    public getRelatedSearchTerms = async (
        params: IRelatedSearchTermsRequest,
    ): Promise<IRelatedSearchTerm[]> => {
        const res = await this.fetchKeywordsRecommendations(params);
        return res?.records ?? [];
    };

    private fetchKeywordsRecommendations = async (
        params: IRelatedSearchTermsRequest,
    ): Promise<IRelatedSearchTermsResult> => {
        try {
            const queryParams = this.adaptParamsForApi(params);
            return await this.fetchService.get<IRelatedSearchTermsResult>(
                this.apiEndpoint,
                queryParams,
            );
        } catch (e) {
            SwLog.error(e);
            return null;
        }
    };

    private adaptParamsForApi = (params: IRelatedSearchTermsRequest) => {
        const queryParams = {
            ...params,
            sort: "volume",
            asc: false,
            rowsPerPage: 100,
        };

        const apiParams = apiHelper.transformParamsForAPI(queryParams);
        apiParams.keyword = apiParams.keys;
        delete apiParams.keys;

        return apiParams;
    };
}
