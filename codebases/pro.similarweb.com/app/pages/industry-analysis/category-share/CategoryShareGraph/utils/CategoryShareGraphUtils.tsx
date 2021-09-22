import {
    GranularitySwitcherEnum,
    ICategoryShareGraphApiData,
    ICategoryShareGraphLegend,
} from "../CategoryShareGraphTypes";
import { ICategoryShareTableSelection, WebSourceType } from "../../CategoryShareTypes";
import {
    DataGranularity,
    ICategoryShareServices,
} from "pages/industry-analysis/category-share/CategoryShareTypes";
import { getCategoryShareParams } from "../../CategoryShareUtils";
import { SwLog } from "@similarweb/sw-log";
import { swSettings } from "common/services/swSettings";

const CATEGORY_SHARE_GRAPH_API = "widgetApi/CategoryShare/CategoryShare/SwitchGraph";

export const fetchApiDataForGraph = async (
    params: any,
    granulairty: DataGranularity,
    isMTDEnabled: boolean,
    services: ICategoryShareServices,
) => {
    try {
        const apiParams = getCategoryShareParams(params, granulairty, services, isMTDEnabled);

        const response = await services.fetchService.get<ICategoryShareGraphApiData>(
            CATEGORY_SHARE_GRAPH_API,
            apiParams,
        );
        return response;
    } catch (e) {
        SwLog.error(e);
        return null;
    }
};

export const resolveLastSupportedDate = (
    duration: string,
    isMonthToDateEnabled: boolean,
    services: ICategoryShareServices,
) => {
    const dataDuration = services.durationService.getDurationData(duration).forAPI;

    const lastSupportedDate = isMonthToDateEnabled
        ? swSettings.current.lastSupportedDailyDate
        : dataDuration.to.replace(/\|/g, "/");

    return lastSupportedDate;
};

export const resolveDataGranulairtyFromSwitcher = (
    granularitySwitcherIndex: GranularitySwitcherEnum,
): DataGranularity => {
    switch (granularitySwitcherIndex) {
        case GranularitySwitcherEnum.DAILY:
            return "Daily";
        case GranularitySwitcherEnum.WEEKLY:
            return "Weekly";
        case GranularitySwitcherEnum.MONTHLY:
        default:
            return "Monthly";
    }
};

export const resolveWebSourceForGraphApi = (webSource: WebSourceType) => {
    return webSource === "MobileWeb" ? "Mobile Web" : webSource;
};

/**
 * Upon exporting the graph to the dashboard, we should know
 * what is the current category. this piece of data is stored
 * on the dashboard graph config.
 */
export const getCategoryDetailsForDashboard = (
    params: { category: string },
    services: Pick<ICategoryShareServices, "categoryService">,
): { category: string; id: string; name: string } => {
    const { categoryService } = services;

    const category = categoryService.categoryQueryParamToCategoryObject(params.category);
    if (!category) return null;

    const isCustomCategory = category.isCustomCategory;
    return {
        category: isCustomCategory ? category.categoryId : `$${category.id}`,
        id: isCustomCategory ? category.categoryId : `$${category.id}`,
        name: category.text,
    };
};

/**
 * Updates the graph legend when toggling a domain (checking / unchecking an item in the legend)
 */
export const updateLegendItemVisibility = (
    hiddenDomains: string[],
    legendItemToToggle: { name: string },
) => {
    // Check if the current legend item to toggle is already hidden. in case it is - we
    // remove it from the hiddenDomains list. otherwise - we add it to that list.
    const itemIndex = hiddenDomains.findIndex((domain) => domain === legendItemToToggle.name);
    const isItemHidden = itemIndex > -1;

    return isItemHidden
        ? hiddenDomains.filter((domain, index) => index !== itemIndex)
        : [...hiddenDomains, legendItemToToggle.name];
};

/**
 * In case the user has updated his selection on the category share graph table
 * we want to make sure that we removed any of the hidden domains (unchecked legend items) that were un-selected
 * from the table. so that in case he re-selects these domains in the future, they won't be hidden anymore.
 */
export const updateHiddenDomainsWithTableSelection = (
    selectedRows: ICategoryShareTableSelection[],
    hiddenDomains: string[],
) => {
    const selectedDomains = selectedRows?.map((row) => row.Domain) ?? [];
    const updatedHiddenDomains = hiddenDomains.filter((hiddenDomain) =>
        selectedDomains.includes(hiddenDomain),
    );
    return updatedHiddenDomains;
};

export const buildGraphLegend = (
    selectedRows: ICategoryShareTableSelection[],
    hiddenDomains: string[],
    shouldAddOthersRecord: boolean,
): ICategoryShareGraphLegend[] => {
    const graphLegend = (selectedRows || [])
        .sort((thisRow, otherRow) => {
            return thisRow.index > otherRow.index ? 1 : -1;
        })
        .map(({ Domain, selectionColor }) => ({
            name: Domain,
            color: selectionColor,
            visible: !hiddenDomains.includes(Domain),
        }));

    if (shouldAddOthersRecord) {
        const othersLegendItem = {
            name: "Others",
            color: "#E6E6E6",
            visible: !hiddenDomains.includes("Others"),
        };

        graphLegend.push(othersLegendItem);
    }

    return graphLegend;
};
