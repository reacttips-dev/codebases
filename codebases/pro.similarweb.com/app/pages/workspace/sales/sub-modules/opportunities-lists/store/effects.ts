import { ThunkDispatchCommon, ThunkGetState } from "store/types";
import { ThunkDependencies } from "store/thunk-dependencies";
import { fetchSimilarWebsitesSuccessAction, loadingSimilarSitesStart } from "./action-creators";
import swLog from "@similarweb/sw-log";

export const fetchSimilarWebsitesCustomThunkAction = (
    domain: string,
    country: number,
    metric: string,
) => async (dispatch: ThunkDispatchCommon, getState: ThunkGetState, deps: ThunkDependencies) => {
    try {
        dispatch(loadingSimilarSitesStart());
        const similarWebsites = await deps.si.api.benchmarks.fetchSimilarWebsites(
            domain,
            country,
            metric,
        );

        dispatch(fetchSimilarWebsitesSuccessAction(similarWebsites));
    } catch (e) {
        swLog.error(`Error caught in fetchSimilarWebsitesThunkAction:`, e);
    }
};
