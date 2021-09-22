import { createStatePropertySelector } from "pages/workspace/sales/helpers";
import { selectSalesIntelligenceState } from "../../../store/selectors";
import { createSelector } from "reselect";
import { RootState } from "store/types";
import { TypeOfSelectors } from "pages/sales-intelligence/common-components/MultiSelector/types";

const select = createStatePropertySelector(selectSalesIntelligenceState("common"));

export const selectLegacyWorkspaceId = select("workspaceId");
export const selectLegacyWorkspacesFetching = select("workspacesFetching");
export const selectWebsitesData = select("websitesData");
export const selectNotFoundListModalOpen = select("notFoundListModalOpen");
export const selectExcelQuota = select("excelQuota");
export const selectIsExcelQuotaLoading = select("isExcelQuotaLoading");
export const selectActiveSelectorPanel = select("activeSelectorPanel");
export const selectSelectorPanelAccountItemConfig = select("selectorPanelAccountItemConfig");
export const selectSelectorPanelExcelItemConfig = select("selectorPanelExcelItemConfig");
export const selectSelectorPanelRemoveItemConfig = select("selectorPanelRemoveItemConfig");

export const selectActiveSelectorPanelItemConfig = createSelector(
    [
        selectActiveSelectorPanel,
        selectSelectorPanelAccountItemConfig,
        selectSelectorPanelExcelItemConfig,
        selectSelectorPanelRemoveItemConfig,
    ],
    (activeType, accountItemConfig, excelItemConfig, removeItemConfig) => {
        if (activeType === TypeOfSelectors.EXCEL) {
            return excelItemConfig;
        }

        if (activeType === TypeOfSelectors.DELETE) {
            return removeItemConfig;
        }

        return accountItemConfig;
    },
);

export const selectWebsiteData = createSelector(
    [selectWebsitesData, (_, props) => props.domain as string],
    (websitesData, domain) => {
        return websitesData[domain];
    },
);

export const selectTableSelectionState = createStatePropertySelector(
    (root: RootState) => root.tableSelection,
);

export const selectSelectedDomains = (tableKey: string, tableProperty: string) =>
    createSelector(selectTableSelectionState(tableKey), (domains) => {
        return Array.isArray(domains) ? domains.map((domain) => domain[tableProperty]) : [];
    });

export const selectSelectedDomainsStaticTable = (tableKey: string) =>
    createSelector(selectTableSelectionState(tableKey), (domains) => {
        if (Array.isArray(domains)) {
            return domains.map(({ site }) => site);
        }

        return [];
    });

export const selectAmountDomains = (tableName: string) =>
    createSelector(selectTableSelectionState(tableName), (domains) => {
        if (Array.isArray(domains)) {
            return domains.map(({ Domain }) => Domain);
        }

        return [];
    });

export const selectExcelQuotaRemaining = createSelector(selectExcelQuota, (excelQuota) => {
    return excelQuota.remaining;
});
