import dayjs from "dayjs";

import { ECategoryType } from "common/services/categoryService.types";

export enum ListsType {
    PARTNERS = "partners",
    KEYWORDS = "keywords",
}

export interface IKeywordGroup {
    AddedTime: string;
    GroupHash: string;
    Id: string;
    Keywords: string[];
    LastUpdated: string;
    Name: string;
    UserId: string;
    SharedWithAccounts: string[];
    SharedWithUsers: string[];
}

export interface IPartnerList {
    AddedTime: string;
    CategoryHash: string;
    CategoryType: ECategoryType;
    CreationType: number;
    Domains: string[];
    Id: string;
    LastUpdated: string;
    Name: string;
    UserId: string;
}

export type ISharedKeywordGroup = IKeywordGroup & { sharedBy: string };

export type MonitorListsType = IKeywordGroup | IPartnerList;

export const getSharedGroupsWithOwnerName = (sharedGroups, users): ISharedKeywordGroup[] => {
    return sharedGroups.map((group) => {
        const groupIdAsNumber = parseInt(group.UserId);
        const groupOwner = users.find((user) => user.Id === groupIdAsNumber);
        if (groupOwner) {
            return { ...group, sharedBy: `${groupOwner.User}` };
        }
        return group;
    });
};

const sortFunction = (a, b) => {
    const dateOfA = dayjs(a.AddedTime);
    const dateOfB = dayjs(b.AddedTime);
    if (dateOfA.isAfter(dateOfB)) {
        return -1;
    }
    if (dateOfA.isBefore(dateOfB)) {
        return 1;
    }
    return 0;
};

export const sortGroupsByCreationDate = (groups) => {
    return groups.sort(sortFunction);
};

export const getPartnerTypeLists = (groups) => {
    return groups.filter(
        (group) =>
            group.CategoryType === ECategoryType.PARTNERS_LIST ||
            group.categoryType === ECategoryType.PARTNERS_LIST,
    );
};

export const groupToCamelCase = (group) => {
    const camelCasedKeysGroup = Object.keys(group).reduce((destination, key) => {
        destination[`${key.charAt(0).toLowerCase()}${key.slice(1)}`] = group[key];
        return destination;
    }, {});

    return camelCasedKeysGroup;
};

export const groupsToCamelCase = (groups) => {
    const camelCasedKeysGroups = groups.map(groupToCamelCase);

    return camelCasedKeysGroups;
};
export const removeUnnecessaryFieldsFromKeywordGroup = (group): IKeywordGroup => {
    return {
        AddedTime: group.AddedTime,
        GroupHash: group.GroupHash,
        Keywords: group.Keywords,
        Id: group.Id,
        LastUpdated: group.LastUpdated,
        Name: group.Name,
        UserId: group.UserId,
        SharedWithAccounts: group.SharedWithAccounts,
        SharedWithUsers: group.SharedWithUsers,
    };
};

// We need to check for both camelCase and caps because initial lists returned from the category service
// are in camelCase but the lists returned from the edit/save/delete callbacks are Capitalized.
export const removeUnnecessaryFieldsFromPartnerList = (group): IPartnerList => {
    return {
        AddedTime: group.AddedTime || group.addedTime,
        CategoryHash: group.CategoryHash || group.categoryHash,
        CategoryType: group.CategoryType || group.categoryType,
        CreationType: group.CreationType || group.creationType,
        Domains: group.Domains || group.domains,
        Id: group.Id || group.id,
        LastUpdated: group.LastUpdated || group.lastUpdated,
        Name: group.Name || group.name,
        UserId: group.UserId || group.userId,
    };
};

// The group objects returned from the BE contain more fields then are necessary for the monitor homepages.
// Therefore, we modify them to make their use simpler on the FE.
export const removeUnnecessaryFieldsFromGroups = (groups, type): MonitorListsType[] => {
    switch (type) {
        case ListsType.KEYWORDS:
            return groups.map(removeUnnecessaryFieldsFromKeywordGroup);
        case ListsType.PARTNERS:
            return groups.map(removeUnnecessaryFieldsFromPartnerList);
    }
};

export const trackSeeListClick = (track, listType, listName, listLength) => {
    track("monitor.lists.home_page.list_table.see_list", "click", {
        listType,
        listName,
        listLength,
    });
};

export const trackListItemClick = (track, itemType, listItemName) => {
    track("monitor.lists.home_page.list_table.list_item", "click", { itemType, listItemName });
};

export const trackOpenDeleteModal = (track, listName, listLength) => {
    track("monitor.lists.home_page.list_table.menu.delete", "open", { listName, listLength });
};

export const trackDeleteList = (track, listName, listLength) => {
    track("monitor.lists.home_page.list_table.modal.delete", "close", { listName, listLength });
};
