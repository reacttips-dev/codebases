import {
    CommonTableFilters,
    IncomingTrafficTableParams,
    OutgoingTrafficTableParams,
} from "../types";

// TODO: Can be improved
export const createRequestParamsHelper = () => {
    const createCategoryFilterParam = (category: string) => {
        return `category;category;"${category}"`;
    };

    const createSearchFilterParam = (search: string) => {
        return `domain;contains;"${search}"`;
    };

    const appendFilterParam = (filter: string, value: string) => {
        if (filter) {
            return `${filter},${value}`;
        }

        return value;
    };

    return {
        buildOutgoingRequestParams(
            baseParams: OutgoingTrafficTableParams,
            filters: CommonTableFilters,
        ) {
            const { key, from, to, country, isWindow, isWWW, pageSize, top } = baseParams;

            const params = {
                key,
                from,
                to,
                country,
                isWindow,
                pageSize,
                isWWW,
                filter: "",
                page: filters.page,
                orderby: filters.orderBy,
                top,
            };

            if (filters.search) {
                params.filter = appendFilterParam(
                    params.filter,
                    createSearchFilterParam(filters.search),
                );
            }

            if (filters.category) {
                params.filter = appendFilterParam(
                    params.filter,
                    createCategoryFilterParam(filters.category),
                );
            }

            return params;
        },
        buildIncomingRequestParams(
            baseParams: IncomingTrafficTableParams,
            filters: CommonTableFilters,
        ) {
            const {
                key,
                from,
                to,
                country,
                isWindow,
                isWWW,
                webSource,
                pageSize,
                top,
            } = baseParams;
            const params = {
                key,
                from,
                to,
                country,
                isWindow,
                isWWW,
                webSource,
                filter: "",
                pageSize,
                top,
                page: filters.page,
                orderBy: filters.orderBy,
            };

            if (filters.search) {
                params.filter = appendFilterParam(
                    params.filter,
                    createSearchFilterParam(filters.search),
                );
            }

            if (filters.category) {
                params.filter = appendFilterParam(
                    params.filter,
                    createCategoryFilterParam(filters.category),
                );
            }

            return params;
        },
    };
};

export default createRequestParamsHelper();
