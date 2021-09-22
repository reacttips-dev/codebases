import { getSharedKeywordsGroups } from "common/services/sharedAssetsService";
import { openDB } from "idb";
import * as _ from "lodash";
import { DefaultFetchService } from "services/fetchService";
import {
    GroupTracker,
    KeywordsGroupsTracking,
} from "pages/keyword-analysis/KeywordsGroupsTracking";
import swLog from "@similarweb/sw-log";
import { IKeywordGroup } from "userdata";

type IKeyword = string;

interface IUserGroup {
    Id: string;
    GroupHash: string;
    Name: string;
    Keywords: Array<IKeyword>;
    AddedTime: string;
    LastUpdated: string;
    UserId: string;
    SharedWithAccounts: Array<string>;
    SharedWithUsers: Array<string>;
    url?: string;
    OwnerId?: string;
}
export type IUserGroups = Array<IUserGroup>;

const keywordGroupsEndpoint = "/api/userdata/KeywordGroups";
const fetchService = DefaultFetchService.getInstance();

const resources = {
    getUserGroups: async () => {
        try {
            return fetchService.get(keywordGroupsEndpoint);
        } catch (ex) {
            swLog.error(ex);
            return {};
        }
    },
    getSharedGroups: async () => {
        try {
            return fetchService.get(`${keywordGroupsEndpoint}/shared`);
        } catch (ex) {
            swLog.error(ex);
            return {};
        }
    },
    create: async (group) => {
        try {
            return fetchService.post(keywordGroupsEndpoint, group);
        } catch (ex) {
            swLog.error(ex);
            return {};
        }
    },
    update: async (group) => {
        try {
            return fetchService.put(keywordGroupsEndpoint, group);
        } catch (ex) {
            swLog.error(ex);
            return {};
        }
    },
    delete: async (Id) => {
        try {
            const res = await fetch(`${keywordGroupsEndpoint}?Id=${Id}`, {
                method: "DELETE",
                credentials: "include",
            });
            return res.json();
        } catch (ex) {
            swLog.error(ex);
            return {};
        }
    },
    shareGroup: async (groupId, payload) => {
        try {
            return fetchService.put(`${keywordGroupsEndpoint}/share/${groupId}`, payload);
        } catch (ex) {
            swLog.error(ex);
            return {};
        }
    },
    removeGroupSharing: async (groupId) => {
        try {
            const res = await fetch(`${keywordGroupsEndpoint}/share/${groupId}`, {
                method: "DELETE",
                credentials: "include",
            });
            return res.json();
        } catch (ex) {
            swLog.error(ex);
            return {};
        }
    },
    duplicateGroup: async (groupId, duplicatedGroupName) => {
        try {
            return fetchService.put(`${keywordGroupsEndpoint}/duplicate`, {
                groupId,
                duplicatedGroupName,
            });
        } catch (ex) {
            swLog.error(ex);
            return {};
        }
    },
};

const keywordGroupPrefix = "*";

let _groups = [];

const transformFirstLetter = (word, transformer) => {
    const [first, ...rest] = word;
    return transformer(first) + rest;
};

const fromDataStoreShape = (list) => {
    return list.map((item) =>
        _.mapKeys(item, (val, key) => transformFirstLetter(key, (l: string) => l.toUpperCase())),
    );
};

const toDataStoreShape = (list) => {
    return list.map((item) =>
        _.mapKeys(item, (val, key) => transformFirstLetter(key, (l: string) => l.toLowerCase())),
    );
};

const setGroups = (groupsInput) => {
    const groups = groupsInput.OwnerGroups ? groupsInput.OwnerGroups : groupsInput;
    updateKeywordGroupsCache(groups);
    _groups = groups.filter((item, index) => _.isNumber(index));
    // keep user data store always in sync after each CRUD operation.
    return _groups;
};

const updateKeywordGroupsCache = async (data) => {
    if (!window.indexedDB || typeof Worker === "undefined") {
        return;
    }

    const db = await openDB("pro-cache-db", 4);

    const tx = db.transaction(["cache"], "readwrite");
    const store = tx.objectStore("cache");
    const userdata = await store.get("userdata");
    userdata.value.keywordGroups = data;

    const putTx = db.transaction(["cache"], "readwrite");
    const putStore = putTx.objectStore("cache");

    const item = {
        key: "userdata",
        value: userdata.value,
    };

    putStore.put(item);
    await putTx.done;
    db.close();
};

class KeywordGroupsService {
    setup() {
        _groups = fromDataStoreShape(window.similarweb.config.userData.keywordGroups);
    }

    get keywordPrefix() {
        return keywordGroupPrefix;
    }

    get isEnabled() {
        return true; // swSettings.components.KeywordAnalysis.resources.HasKeywordsGroups;
    }

    get userGroups(): IUserGroups {
        return _groups;
    }

    isNewGroup(group: any) {
        return !group.Id;
    }

    isKeywordGroup(keyword: string) {
        return keyword.startsWith(this.keywordPrefix);
    }

    async init() {
        const res = await resources.getUserGroups();
        setGroups(res);
        return true;
    }

    async update(group) {
        const res = this.isNewGroup(group)
            ? await resources.create(group)
            : await resources.update(group);
        return setGroups(res);
    }

    async deleteGroup(group) {
        // Get the id for the current keywrod group, and remove any * prefix from it
        const id = group.Id as string;
        const idForDelete = id.startsWith("*") ? id.replace("*", "") : id;

        const res = await resources.delete(idForDelete);
        return setGroups(res);
    }

    getTracker(group = null): GroupTracker {
        const {
            existingGroupTracker,
            newGroupTracker,
            genericGroupTracker,
        } = KeywordsGroupsTracking;
        if (!group) {
            return genericGroupTracker;
        } else if (this.isNewGroup(group)) {
            return newGroupTracker;
        } else {
            return existingGroupTracker;
        }
    }

    findGroupByName(groupName: string) {
        if (groupName) {
            groupName = groupName.replace(RegExp("^[" + keywordGroupPrefix + "]"), "");
            return _.find(_groups, ({ Name }) => Name === groupName) || {};
        } else {
            return {};
        }
    }

    findGroupById(groupId: string) {
        if (groupId) {
            return _.find(_groups, ({ Id }) => Id === groupId) || {};
        } else {
            return {};
        }
    }

    async findGroupByIdAsync(groupId: string): Promise<IKeywordGroup> {
        const _myKeywordsGroup = _.find<IKeywordGroup>(_groups, {
            Id: groupId,
        });
        if (_myKeywordsGroup) {
            return _myKeywordsGroup;
        } else {
            getSharedKeywordsGroups().then((data: any) => {
                const _sharedCustomCategory = _.find(data, { id: groupId });
                if (_sharedCustomCategory) {
                    return _sharedCustomCategory;
                } else {
                    return {};
                }
            });
        }
    }

    private convertToDropDown(groups = []) {
        return groups.map(this.toDropDownGroup).sort((...items) => {
            const [text1, text2] = items.map(({ text }) => text.toLowerCase());
            if (text1 < text2) {
                return -1;
            } else if (text1 > text2) {
                return 1;
            }
            return 0;
        });
    }

    public groupsToDropDown() {
        return this.convertToDropDown(this.userGroups);
    }

    public sharedGroupsToDropDown() {
        return this.convertToDropDown(
            fromDataStoreShape(window.similarweb.config.userData.keywordGroupsShared),
        );
    }

    public getSharedGroups() {
        return fromDataStoreShape(window.similarweb.config.userData.keywordGroupsShared);
    }

    public groupFromDropDown(group) {
        return _.find(this.userGroups, (item: any) => item.Name === group.text);
    }

    private toDropDownGroup(group) {
        const { SharedWithAccounts = [], SharedWithUsers = [] } = group;
        return {
            text: group.Name,
            icon: "sw-icon-folder",
            id: (group.Id || group.Name).toString(),
            domains: group.Keywords || [],
            shared: SharedWithAccounts.length > 0 || SharedWithUsers.length > 0,
            sharedWithAccounts: SharedWithAccounts,
            sharedWithUsers: SharedWithUsers,
        };
    }

    // remove null values from the payload object
    private createPayload = (obj) => {
        return Object.fromEntries(Object.entries(obj).filter((entry) => entry[1]));
    };

    public async shareKeywordGroupWithUsers(
        groupId,
        { users, message } = { users: [], message: null },
    ) {
        const group = await DefaultFetchService.getInstance().put(
            `api/userdata/keywordGroups/share/${groupId}`,
            this.createPayload({ userids: users, accountIds: [], message }),
        );
        const res = await resources.getUserGroups();
        const groups = setGroups(res);
        return group;
    }

    public adaptGroupDataForShareModal(group) {
        function camelCase(str) {
            return str
                .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
                    return index == 0 ? word.toLowerCase() : word.toUpperCase();
                })
                .replace(/\s+/g, "");
        }

        const groupOnService = this.findGroupById(group.id || group.Id);
        const groupForShare = {
            ...group,
            ...Object.fromEntries(
                Object.entries(groupOnService).map(([key, value]) => {
                    return [camelCase(key), value];
                }),
            ),
        };

        return groupForShare;
    }

    public async shareKeywordGroupWithAccount(groupId, { accountId, message }) {
        const group = await DefaultFetchService.getInstance().put(
            `api/userdata/keywordGroups/share/${groupId}`,
            this.createPayload({
                userids: [],
                accountIds: [accountId],
                message,
            }),
        );
        const res = await resources.getUserGroups();
        const groups = setGroups(res);
        return group;
    }

    public async removeGroupSharing(groupId) {
        const group = await DefaultFetchService.getInstance().delete(
            `api/userdata/keywordGroups/share/${groupId}`,
        );
        const res = await resources.getUserGroups();
        const groups = setGroups(res);
        return group;
    }

    public async duplicateGroup(KeywordGroupId, KeywordGroupNewName) {
        const group = await DefaultFetchService.getInstance().put(
            `api/userdata/keywordGroups/duplicate`,
            {
                KeywordGroupId,
                KeywordGroupNewName,
            },
        );
        const res = await resources.getUserGroups();
        const groups = setGroups(res);
        return group;
    }
}

export let keywordsGroupsService = new KeywordGroupsService();
export const mockKeywordsGroupsService = (mock) => {
    keywordsGroupsService = mock;
};
