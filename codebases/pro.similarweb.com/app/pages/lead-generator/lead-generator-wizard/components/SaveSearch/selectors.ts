import { Injector } from "common/ioc/Injector";
import NgRedux from "ng-redux";
import { IWorkspace } from "pages/workspace/common/types";
import { createSelector } from "reselect";

const selectWorkspaces = ({ workspaces }) => workspaces;
const selectActiveWorkspaceId = ({ activeWorkspaceId }) => activeWorkspaceId;
const selectActiveSavedSearchQueryId = ({ activeSavedSearchQueryId }) => activeSavedSearchQueryId;

export const selectActiveWorkSpace = createSelector(
    [selectWorkspaces, selectActiveWorkspaceId],
    (workspaces, activeWorkspaceId) =>
        workspaces.find(({ workspaceId }) => workspaceId === activeWorkspaceId),
);

const selectActiveSavedSearchesList = createSelector(
    [selectActiveWorkSpace, selectActiveSavedSearchQueryId],
    (activeWorkspace: IWorkspace, activeSavedSearchQueryId) =>
        activeWorkspace &&
        activeWorkspace.savedSearches &&
        activeWorkspace.savedSearches.find(
            (item) => item.queryDefinition.id === activeSavedSearchQueryId,
        ),
);

export const selectSavedSearchesList = () =>
    selectActiveSavedSearchesList(
        Injector.get<NgRedux.INgRedux>("$ngRedux").getState().commonWorkspace,
    );

export const COPYselectSavedSearchesList = () =>
    selectActiveSavedSearchesList(
        Injector.get<NgRedux.INgRedux>("$ngRedux").getState().legacySalesWorkspace,
    );
