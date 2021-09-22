import { createSelector } from "reselect";
import { SIGNALS_MOST_USED_COUNT } from "../constants";
import { selectSignalsSlice } from "../../../store/selectors";
import { signalsByNameToArrayOfSignals } from "../helpers";
import { createStatePropertySelector } from "../../../helpers";
import { SignalsContainer, SignalWithId } from "../types";
import { getUseStatisticsToMostUsedIdsTransformer } from "../../usage-statistics/helpers";
import { selectOpportunitiesListIdFromProps } from "../../opportunities-lists/store/selectors";

const select = createStatePropertySelector(selectSignalsSlice);

const getTotal = (c: SignalsContainer): SignalsContainer["total"] => c.total;
const getFilters = (c: SignalsContainer): SignalsContainer["filters"] => c.filters;
const transformToMostUsedSignalKeys = getUseStatisticsToMostUsedIdsTransformer(
    SIGNALS_MOST_USED_COUNT,
);

export const selectSignalsUse = select("signalsUse");
export const selectSignalsContainer = select("signalsContainer");
export const selectSignalsFetching = select("signalsFetching");
export const selectSignalsFetchError = select("signalsFetchError");
export const selectActiveSignalFilterId = select("selectedFilterId");
export const selectActiveSignalSubFilterId = select("selectedSubFilterId");
export const selectRestCountriesSignalsContainer = select("restCountriesSignalsByName");
export const selectActiveSignalsTab = select("activeTabIndex");

export const selectCurrentCountrySignalsByName = createSelector(selectSignalsContainer, getFilters);

export const selectRestCountriesSignalsByName = createSelector(
    selectRestCountriesSignalsContainer,
    getFilters,
);

export const selectCurrentCountrySignalsTotal = createSelector(selectSignalsContainer, getTotal);

export const selectRestCountriesSignalsTotal = createSelector(
    selectRestCountriesSignalsContainer,
    getTotal,
);

export const selectSignalUseByListId = createSelector(
    [selectSignalsUse, selectOpportunitiesListIdFromProps],
    /**
     * Select use object for particular listId
     * @param signalUseByListId
     * @param listId
     */
    (signalUseByListId, listId: string) => {
        return signalUseByListId[listId] || {};
    },
);

export const selectNonZeroSignals = createSelector(
    selectCurrentCountrySignalsByName,
    signalsByNameToArrayOfSignals,
);

export const selectRestCountriesNonZeroSignals = createSelector(
    selectRestCountriesSignalsByName,
    signalsByNameToArrayOfSignals,
);

export const selectMostUsedSignalsKeys = createSelector(
    selectSignalUseByListId,
    transformToMostUsedSignalKeys,
);

export const selectActiveSignalFilter = createSelector(
    [
        selectCurrentCountrySignalsByName,
        selectRestCountriesSignalsByName,
        selectActiveSignalFilterId,
        selectActiveSignalsTab,
    ],
    (signalsByName, restCountriesSignalsByName, id, activeTabIndex) => {
        // FIXME: Relying on order is safe only in particular tabs order
        const signalsObjectToLookAt = [signalsByName, restCountriesSignalsByName][activeTabIndex];

        if (!signalsObjectToLookAt) {
            return null;
        }

        const signalObject = signalsObjectToLookAt[id];

        if (!signalObject) {
            return null;
        }

        return {
            id,
            ...signalsObjectToLookAt[id],
        } as SignalWithId;
    },
);

export const selectActiveSignalSubFilter = createSelector(
    [selectActiveSignalFilter, selectActiveSignalSubFilterId],
    (selectedSignalFilter, subFilterId) => {
        if (!selectedSignalFilter) {
            return null;
        }

        return selectedSignalFilter.sub_filters.find((s) => s.code === subFilterId);
    },
);
