import { createSelector } from "reselect";
import { createStatePropertySelector } from "pages/workspace/sales/helpers";
import { selectSalesIntelligenceState } from "../../../store/selectors";
import {
    mapToOpportunityDomain,
    reduceToListOfOpportunities,
    sortOpportunityListsByFriendlyName,
} from "../helpers";
import { getUniqueValuesFromPrimitives } from "../../../helpers/helpers";
import { selectLegacyOpportunityLists } from "pages/workspace/sales/store/selectors";

const select = createStatePropertySelector(selectSalesIntelligenceState("opportunities"));

export const selectOpportunityLists = select("opportunityLists");
export const selectIsOpenOpportunityList = select("opportunityListIsOpen");
export const selectOpportunityListCreating = select("opportunityListCreating");
export const selectOpportunityListCreateError = select("opportunityListCreateError");
export const selectOpportunityListUpdating = select("opportunityListUpdating");
export const selectOpportunityListUpdateError = select("opportunityListUpdateError");
export const selectOpportunityListDeleting = select("opportunityListDeleting");
export const selectOpportunityListDeleteError = select("opportunityListDeleteError");
export const selectOpportunityListModal = select("opportunityListModal");
export const selectOpportunityListSettingsModal = select("opportunityListSettingsModal");
export const selectOpportunityListTable = select("opportunityListTable");
export const selectOpportunityListTableDataFetching = select("opportunityListTableDataFetching");
export const selectOpportunityListTableFilters = select("opportunityListTableFilters");
export const selectOpportunityListTableExcelDownloading = select("tableExcelDownloading");
export const selectOpportunityListTableExcelDownloadError = select("tableExcelDownloadError");
export const selectListRecommendations = select("recommendations");
export const selectListRecommendationsFetching = select("recommendationsFetching");
export const selectListRecommendationsOpen = select("recommendationsBarOpen");
export const selectShowRightBar = select("showRightBar");
export const selectOpportunityListName = select("opportunityListName");
export const selectOpportunityListId = select("opportunityListId");

export const selectSortedOpportunityLists = createSelector(
    selectOpportunityLists,
    sortOpportunityListsByFriendlyName,
);

export const selectAllListsOpportunities = createSelector(
    selectOpportunityLists,
    reduceToListOfOpportunities,
);

export const selectAllListsWebsites = createSelector(
    selectAllListsOpportunities,
    mapToOpportunityDomain,
);

export const selectAllUniqueWebsites = createSelector(
    selectAllListsWebsites,
    getUniqueValuesFromPrimitives,
);

export const totalTableList = createSelector(selectOpportunityListTable, (tableList) => {
    return tableList.TotalCount;
});

export const selectCurrentOpportunityLists = createSelector(
    selectOpportunityLists,
    selectLegacyOpportunityLists,
    (opportunityLists, legacyOpportunityLists = []) => {
        if (opportunityLists.length) {
            return opportunityLists;
        }
        return legacyOpportunityLists as any[];
    },
);
