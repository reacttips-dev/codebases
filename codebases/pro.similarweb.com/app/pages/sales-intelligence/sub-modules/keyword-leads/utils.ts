import DurationService from "services/DurationService";
import { categoryClassIconFilter, i18nCategoryFilter } from "filters/ngFilters";
import { BuildParamsType, FiltersType } from "./types";
import { convertToKeyword } from "pages/sales-intelligence/utils/leads";

const i18nCategory = i18nCategoryFilter();
const categoryClassIcon = categoryClassIconFilter();

const addFilter = (filterObj: string, filterItem: string): string => {
    return filterObj.length ? filterObj.concat(`,${filterItem}`) : filterObj.concat(filterItem);
};

export const buildParams = (params: BuildParamsType, filters: FiltersType) => {
    const { keys, country, from, to, isWindow, webSource } = params;

    const newParams = {
        keys,
        country,
        from,
        to,
        isWindow,
        webSource,
        page: filters.page,
        orderby: filters.orderBy,
        filter: "",
        funcFlag: "",
        includeSubDomains: true,
    };

    if (filters.search) {
        newParams.filter = addFilter(newParams.filter, `domain;contains;"${filters.search}"`);
    }
    if (filters.family) {
        newParams.filter = addFilter(newParams.filter, `family;==;"${filters.family}"`);
    }
    if (filters.searchType) {
        newParams.filter = addFilter(newParams.filter, `Source;==;${filters.searchType}`);
    }
    if (filters.category) {
        newParams.filter = addFilter(newParams.filter, `category;category;"${filters.category}"`);
    }
    if (filters.selectedWebsite) {
        newParams.funcFlag = filters.selectedWebsite.id;
    }

    return newParams;
};

export const getRequestParams = (navigationParams, orderBy: string) => {
    const { duration, country, webSource, keyword } = navigationParams;
    const keys = convertToKeyword(keyword);
    const { from, to, isWindow } = DurationService.getDurationData(duration).forAPI;
    const params = {
        keys,
        to,
        from,
        isWindow: isWindow || false,
        country: Number(country),
    };

    return {
        ...params,
        orderBy,
        webSource,
    };
};

export const capitalize = (text: string | null): string | null =>
    text && text.length ? text.replace(/^\w/, (c) => c.toUpperCase()) : text;

export const convertCategory = ({ count, text, children = [], id }, parentId = null) => {
    const formattedText = `${i18nCategory(text)}${count ? ` (${count})` : ``}`;
    return {
        text: formattedText,
        id,
        isCustomCategory: false,
        isChild: children.length === 0,
        icon: categoryClassIcon(id),
        forApi: `${id}`,
    };
};
