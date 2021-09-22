import { createStatePropertySelector } from "pages/workspace/sales/helpers";
import { selectSalesIntelligenceState } from "../../../store/selectors";
import { createSelector } from "reselect";

const select = createStatePropertySelector(selectSalesIntelligenceState("contacts"));

export const selectContacts = select("contacts");
export const selectTotalCounts = select("totalCount");
export const selectIsEmptyState = select("isEmptyState");
export const selectFilters = select("filters");
export const selectLoadingFilters = select("loadingFilters");
export const selectQuota = select("quota");
export const selectFetchingContacts = select("loadingContacts");
export const selectUpdatingContactDetails = select("updatingContactDetails");
export const selectUpdatingContacts = select("updatingContacts");

export const selectQuotaRemaining = createSelector(selectQuota, ({ remaining }) => remaining);
