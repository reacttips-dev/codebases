import {
    ListTableDataRequestParams,
    ListTableDataResponseDto,
    OpportunityListType,
    OpportunityType,
} from "./types";

export const isOpportunityListNameLongEnough = (name: OpportunityListType["friendlyName"]) => {
    // TODO: Extract to constant
    return name.trim().length >= 1;
};

export const opportunityListHasId = (id: string) => (list: OpportunityListType) => {
    return list.opportunityListId === id;
};

export const opportunityListDoesNotHaveId = (id: string) => (list: OpportunityListType) => {
    return list.opportunityListId !== id;
};

export const opportunityListNameIncludes = (name: string) => (list: OpportunityListType) => {
    return list.friendlyName.toLowerCase().includes(name.toLowerCase());
};

export const mapToOpportunityDomain = (opportunities: OpportunityType[]) => {
    return opportunities.map((opportunity) => opportunity.Domain);
};

/**
 * Sorts given opportunity lists by name alphabetically
 * @param lists
 */
export const sortOpportunityListsByFriendlyName = (lists: ReadonlyArray<OpportunityListType>) => {
    return lists.slice().sort((a, b) => {
        return a.friendlyName.localeCompare(b.friendlyName);
    });
};

export const reduceToListOfOpportunities = (lists: OpportunityListType[]) => {
    return lists.reduce((opportunities: OpportunityType[], list: OpportunityListType) => {
        return opportunities.concat(list.opportunities);
    }, []);
};

export const updateOpportunityLists = (
    lists: OpportunityListType[],
    update: OpportunityListType,
) => {
    const matchesUpdate = opportunityListHasId(update.opportunityListId);

    return lists.map((list) => {
        if (matchesUpdate(list)) {
            return update;
        }

        return list;
    });
};

export const removeFromOpportunityLists = (
    lists: OpportunityListType[],
    listId: OpportunityListType["opportunityListId"],
) => {
    return lists.filter(opportunityListDoesNotHaveId(listId));
};

export const removeWebsitesFromListOpportunities = (
    list: OpportunityListType,
    websites: string[],
): OpportunityListType => {
    return {
        ...list,
        opportunities: list.opportunities.filter((opportunity) => {
            return !websites.includes(opportunity.Domain);
        }),
    };
};

export const removeWebsitesFromListTableData = (
    tableData: ListTableDataResponseDto,
    websites: string[],
): ListTableDataResponseDto => {
    return {
        Data: tableData.Data.filter((entry) => {
            return !websites.includes(entry.site);
        }),
        TotalCount: tableData.TotalCount - websites.length,
    };
};

export const setItemsFeedSeenListTableData = (
    tableData: ListTableDataResponseDto,
    website: string,
): ListTableDataResponseDto => {
    return {
        ...tableData,
        Data: tableData.Data.map((entry) => {
            if (website === entry.site) {
                return {
                    ...entry,
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    number_of_unseen_alerts: 0,
                };
            }
            return entry;
        }),
    };
};

export const buildTableRequestParamValue = <P extends keyof ListTableDataRequestParams>(
    param: P,
    value: ListTableDataRequestParams[P],
) => {
    switch (param) {
        case "filter":
            return `Site;contains;"${value}"`;
        default:
            return value;
    }
};

export const appendTableRequestParam = <P extends keyof ListTableDataRequestParams>(
    param: P,
    value: ListTableDataRequestParams[P],
    condition = Boolean(value),
) => (params: ListTableDataRequestParams) => {
    if (!condition) {
        return params;
    }

    return {
        ...params,
        [param]: buildTableRequestParamValue(param, value),
    };
};

export const fromStringToLegacyDomainDto = (domain: string) => {
    return { Domain: domain };
};

export const hasActiveListEnabledNews = (activeList: OpportunityListType): boolean => {
    return activeList?.settings?.alerts?.metrics?.includes("news") || false;
};

export const getLastOpportunityByDate = (
    opportunityLists: OpportunityListType[],
): OpportunityListType =>
    opportunityLists.reduce(
        (lastOpportunity, opportunity) =>
            new Date(lastOpportunity.created) > new Date(opportunity.created)
                ? lastOpportunity
                : opportunity,
        opportunityLists[0],
    );
