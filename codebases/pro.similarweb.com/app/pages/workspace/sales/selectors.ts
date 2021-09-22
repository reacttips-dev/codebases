// TODO: This file will be removed soon in favor of ./store/selectors
import _ from "lodash";
import { createSelector } from "reselect";
import { Injector } from "common/ioc/Injector";
import NgRedux from "ng-redux";
import { IWorkspace } from "pages/workspace/common/types";
import { getOnlyWithAutoReRunEnabled } from "pages/workspace/sales/saved-searches/helpers";
import { swSettings } from "common/services/swSettings";
import { selectTopicsList } from "./sub-modules/benchmarks/store/selectors";
import { createFormattedTopicsList } from "./helpers";

const selectWorkspaces = ({ workspaces }) => workspaces;
const selectActiveWorkspaceId = ({ activeWorkspaceId }) => activeWorkspaceId;

const selectActiveWorkSpace = createSelector(
    [selectWorkspaces, selectActiveWorkspaceId],
    (workspaces, activeWorkspaceId) =>
        workspaces.find(({ workspaceId }) => workspaceId === activeWorkspaceId),
);

const selectActiveSavedSearchesList = createSelector(
    [selectActiveWorkSpace],
    (activeWorkspace: IWorkspace) => activeWorkspace?.savedSearches ?? [],
);

export const selectSavedSearchesList = () => {
    const activeList = selectActiveSavedSearchesList(
        Injector.get<NgRedux.INgRedux>("$ngRedux").getState().legacySalesWorkspace,
    );

    const data = activeList.map(({ queryDefinition, lastRun }) => ({
        name: queryDefinition?.name,
        queryDefinitionId: queryDefinition?.id,
        totalResults: lastRun?.resultCount,
        newResults: lastRun?.newSinceLastRun,
        addedToLists: queryDefinition?.used_result_count,
        queryParams: {
            // eslint-disable-next-line @typescript-eslint/camelcase
            order_by: queryDefinition?.order_by,
            filters: queryDefinition?.filters,
            queryId: queryDefinition?.id,
            runId: lastRun?.id,
        },
    }));

    return {
        TotalCount: data.length,
        Records: data,
    };
};

export const selectCommonWorkspaceStateSlice = _.property("legacySalesWorkspace");

export const selectWorkspacesList = createSelector(
    selectCommonWorkspaceStateSlice,
    _.property("workspaces"),
);

export const selectWorkspaceSavedSearchesList = createSelector(
    selectWorkspacesList,
    (workspaces) => {
        // Currently "workspaces" is an array with only one item always
        return workspaces[0].savedSearches;
    },
);

export const selectSearchesWithAutoReRunEnabled = createSelector(
    selectWorkspaceSavedSearchesList,
    getOnlyWithAutoReRunEnabled,
);

export const selectSearchesAutoReRunLimitCount = () => {
    // Ignoring incoming state as we work with global swSettings here
    return swSettings.components.SalesWorkspace.resources.SavedSearchesLimit;
};

export const selectPreparedTopics = createSelector(selectTopicsList, createFormattedTopicsList);
