export interface IAdvancedFilter {
    id: string;
    api: string;
    name: string;
    tooltip: string;
}

const validateValue = (value) => {
    return value >= 0 && value <= 1;
};
const validateArray = (arr) => {
    if (arr === "") {
        return true;
    } else {
        const newArr = arr.split("-");
        if (newArr.length === 2) {
            if (newArr.some(isNaN)) {
                return false;
            } else {
                return newArr.every(validateValue);
            }
        } else {
            return false;
        }
    }
};

const DELIMITER = ";";
const regex = new RegExp(`${DELIMITER}\s*$`);
const trimLastDelimiter = (str: string) => str.replace(regex, "");
const split = (str: string) => trimLastDelimiter(str).split(DELIMITER);

interface IAdvancedFilterService {
    validateParam: (param, paramsLength?: number) => boolean;
    validateParamAgainstKeys: (param, keys: any[]) => any;
    getAllFilters: () => IAdvancedFilter[];
    getFilterById: (id) => IAdvancedFilter | boolean;
    getFilterByApi: (api) => IAdvancedFilter;
    parseApi: (api: string, domains: any[]) => any[];
    isCustomFilter: (filter: string) => boolean;
    getAdvancedFilterSelectedText: (domains, selectedFilter, i18n) => string;
}

export class AdvancedFilterService implements IAdvancedFilterService {
    private filters: IAdvancedFilter[];

    constructor(filters: IAdvancedFilter[]) {
        this.filters = filters;
    }

    validateParam = (param, partsLength?: number) => {
        if (param === "") {
            return false;
        }
        if (!param && param !== "") {
            return true;
        }
        const newArr = split(param);
        if (partsLength && newArr.length !== partsLength) {
            return false;
        }
        if (newArr.length < 6 && newArr.length > 0) {
            return newArr.every(validateArray);
        } else {
            return false;
        }
    };

    validateParamAgainstKeys = (param, keys: any[]) => {
        return this.validateParam(param, keys.length);
    };

    getAllFilters = (): IAdvancedFilter[] => {
        return this.filters;
    };

    getFilterById = (id): IAdvancedFilter | boolean => {
        return (
            this.filters.find((filter) => {
                return filter.id === id;
            }) || this.validateParam(id)
        );
    };

    getFilterByApi = (api): IAdvancedFilter => {
        return this.filters.find((filter) => filter.api === api);
    };

    parseApi = (api: string, domains: any[]) => {
        // in case of predefined filter, we convert the id of the filter to it's actual api param
        if (this.isCustomFilter(api) === false) {
            api = (this.getFilterById(api) as IAdvancedFilter).api;
        }
        const apiParts = split(api);
        const groups = [];
        domains.forEach((domain, index) => {
            // check if the domain has matched range
            const value = apiParts[index]
                ? apiParts[index].split("-").map((v) => parseFloat(v) * 100)
                : null;
            groups.push({
                ...domain,
                range: value && { value },
            });
        });

        return groups;
    };
    isCustomFilter = (filter: string) => filter && filter.indexOf(DELIMITER) > -1;

    getAdvancedFilterSelectedText = (domains, selectedFilter, i18n) => {
        if (!selectedFilter) {
            return null;
        }
        const [mainDomain, ...competitors] = domains;
        const isCustomAdvancedFilter = this.isCustomFilter(selectedFilter);
        if (isCustomAdvancedFilter) {
            const competitorsWithRange = competitors.filter((competitor) => competitor.range);
            const numberOfCompetitorsWithRange = competitorsWithRange.length;
            const suffix = numberOfCompetitorsWithRange ? ` + ${numberOfCompetitorsWithRange}` : ``;
            return `${this.getMainDomainAdvancedFilterText(
                domains,
                selectedFilter,
                i18n,
            )}${suffix}`;
        } else {
            const filterName = i18n((this.getFilterById(selectedFilter) as IAdvancedFilter).name);
            return `${filterName}: ${this.getMainDomainAdvancedFilterText(
                domains,
                selectedFilter,
                i18n,
            )}`;
        }
    };
    private getMainDomainAdvancedFilterText = (domains, selectedFilter, i18n) => {
        const [mainDomain, ...competitors] = domains;
        const parsedAdvancedFilter = this.parseApi(selectedFilter, domains);
        return `${mainDomain.name} ${this.getShareText(parsedAdvancedFilter[0].range.value, i18n)}`;
    };
    private getShareText = ([from, to], i18n) => {
        if (to === 100) {
            return i18n("analysis.source.search.keywords.filters.advanced.greaterthan", {
                from: `${from}%`,
            });
        } else {
            return i18n("analysis.source.search.keywords.filters.advanced.between", {
                from: `${from}%`,
                to: `${to}%`,
            });
        }
    };
}
