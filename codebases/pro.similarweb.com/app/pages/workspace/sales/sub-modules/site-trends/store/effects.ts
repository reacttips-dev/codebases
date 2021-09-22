import { ThunkDispatchCommon, ThunkGetState } from "store/types";
import { ThunkDependencies } from "store/thunk-dependencies";
import * as actions from "./action-creators";
import { selectWorkspaceId } from "pages/workspace/sales/store/selectors";
import { selectLegacyWorkspaceId } from "pages/sales-intelligence/sub-modules/common/store/selectors";

export const fetchSiteTrendsThunkAction = (country: string, domain: string) => async (
    dispatch: ThunkDispatchCommon,
    getState: ThunkGetState,
    deps: ThunkDependencies,
) => {
    dispatch(actions.fetchSiteTrendsAsyncAction.request());

    try {
        const workspaceId = selectLegacyWorkspaceId(getState()) || selectWorkspaceId(getState()); //TODO delete selectWorkspaceId after release 2.0
        const siteTrends = await deps.si.api.siteTrends.fetchSiteTrends(
            country,
            domain,
            workspaceId,
        );

        dispatch(actions.fetchSiteTrendsAsyncAction.success(siteTrends));
    } catch (e) {
        dispatch(actions.fetchSiteTrendsAsyncAction.failure(e));
    }
};
