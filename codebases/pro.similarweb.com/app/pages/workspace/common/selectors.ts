import { createSelector } from "reselect";
import { Injector } from "../../../../scripts/common/ioc/Injector";
import NgRedux from "ng-redux";
import { IOpportunityListItem, IWorkspace } from "./types";

const selectWorkspaces = ({ workspaces }) => workspaces;
export const selectActiveWorkspaceId = ({ activeWorkspaceId }) => activeWorkspaceId;
export const selectActiveOpportunityListId = ({ activeListId }) => activeListId;

export const selectActiveWorkSpace = createSelector(
    [selectWorkspaces, selectActiveWorkspaceId],
    (workspaces, activeWorkspaceId) =>
        workspaces.find(({ workspaceId }) => workspaceId === activeWorkspaceId),
);

export const selectActiveOpportunityList = createSelector(
    [selectActiveWorkSpace, selectActiveOpportunityListId],
    (activeWorkspace: IWorkspace, activeListId: any) =>
        activeWorkspace &&
        activeWorkspace.opportunityLists &&
        activeWorkspace.opportunityLists.find(
            ({ opportunityListId }) => opportunityListId === activeListId,
        ),
);

export const hasMetricNewsOpportunityList = createSelector(
    selectActiveOpportunityList,
    (opportunityList: IOpportunityListItem) => {
        return opportunityList?.settings?.alerts?.metrics?.includes("news") || false;
    },
);

export const selectOpportunityId = (opportunityListId: string, site: any) => {
    const activeList = selectActiveOpportunityList(
        Injector.get<NgRedux.INgRedux>("$ngRedux").getState().commonWorkspace,
    );
    const opportunityId = activeList.opportunities.find(({ Domain }) => Domain === site)
        .OpportunityId;
    return `${opportunityListId}|${opportunityId}`;
};

// [InvestorsSeparation] Will be removed soon
export const COPYselectOpportunityId = (opportunityListId: string, site: any) => {
    const activeList = selectActiveOpportunityList(
        Injector.get<NgRedux.INgRedux>("$ngRedux").getState().legacySalesWorkspace,
    );
    const opportunityId = activeList.opportunities.find(({ Domain }) => Domain === site)
        .OpportunityId;
    return `${opportunityListId}|${opportunityId}`;
};

export const selectSizeActiveOpportunityLeadsInList = createSelector(
    [selectActiveWorkSpace, selectActiveOpportunityListId],
    (activeWorkspace: IWorkspace, activeListId: any) => {
        let size = 0;

        if (activeWorkspace && activeWorkspace.opportunityLists) {
            const { opportunities } = activeWorkspace.opportunityLists.find(
                ({ opportunityListId }) => opportunityListId === activeListId && opportunityListId,
            );

            size = opportunities ? opportunities.length : 0;
        }

        return size;
    },
);
