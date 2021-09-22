import { createSelector } from "reselect";
import { RootState } from "store/types";
import { AddWebsiteToListButtonProps } from "../../account-review/AddToListButton/AddWebsiteToListButton";
import { selectCurrentOpportunityLists } from "../../opportunities/store/selectors";

export const selectDisabledListNames = createSelector(
    selectCurrentOpportunityLists,
    (_state: RootState, props: AddWebsiteToListButtonProps) => props?.domain,
    (opportunityLists, domain = "") => {
        return opportunityLists.reduce((acc, list) => {
            const isWebsiteInList = list.opportunities.find(
                (opportunity) => opportunity.Domain === domain,
            );
            if (isWebsiteInList) {
                acc.push(list.opportunityListId);
            }
            return acc;
        }, []);
    },
);

export const selectAlreadyInList = createSelector(
    selectCurrentOpportunityLists,
    (_state: RootState, props: AddWebsiteToListButtonProps) => props?.domain,
    (opportunityLists, domain) =>
        opportunityLists.some((list) => {
            return list.opportunities.some((opportunity) => {
                return opportunity.Domain === domain;
            });
        }),
);
