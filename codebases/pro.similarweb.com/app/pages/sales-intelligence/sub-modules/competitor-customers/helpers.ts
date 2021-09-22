import {
    CommonTableParams,
    CompetitorsCustomersNavParams,
    IncomingTrafficTableParams,
    OutgoingTrafficTableParams,
    TrafficType,
} from "./types";
import DurationService from "services/DurationService";
import { categoryClassIconFilter, i18nCategoryFilter } from "filters/ngFilters";
import { BooleanConfig } from "components/widget/widget-config/metrics/@types/Common";

const i18nCategory = i18nCategoryFilter();
const categoryClassIcon = categoryClassIconFilter();

export const getTrafficTypeTranslationKey = (type: TrafficType) => {
    return `si.pages.find_competitors.search.traffic.${type}`;
};

/**
 * TODO: Copied from another place. Add types/refactor.
 * @param object
 * @param parentId
 */
export const convertCategory = ({ Count, Name, Sons = [], id }: any, parentId = null) => {
    const text = `${i18nCategory(Name)}${Count ? ` (${Count})` : ``}`;

    return {
        text,
        id,
        isCustomCategory: false,
        isChild: Sons.length === 0,
        icon: categoryClassIcon(id),
        forApi: `${parentId ? `${parentId}~` : ``}${id}`,
    };
};

export const getCorrectTableDataRequestParams = (
    navigationParams: CompetitorsCustomersNavParams,
    trafficType: TrafficType,
    orderBy: string,
) => {
    const { duration, country, key, webSource } = navigationParams;
    const { from, to, isWindow } = DurationService.getDurationData(duration).forAPI;
    const commonParams: CommonTableParams = {
        to,
        key,
        from,
        isWindow,
        country: Number(country),
        isWWW: false, // Always "false" for now
    };

    if (trafficType === "outgoing") {
        return {
            ...commonParams,
            orderby: orderBy,
        } as OutgoingTrafficTableParams;
    }

    return {
        ...commonParams,
        orderBy,
        webSource,
    } as IncomingTrafficTableParams;
};

export const setIsSortedToFalse = <T extends { isSorted?: BooleanConfig }>(column: T) => {
    return {
        ...column,
        isSorted: false,
    };
};
