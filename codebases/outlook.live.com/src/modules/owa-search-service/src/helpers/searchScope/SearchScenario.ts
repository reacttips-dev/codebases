import {
    getPrimaryMailboxSearchScopeKey,
    getArchiveMailboxSearchScopeKey,
    getSharedFoldersSearchScopeKey,
    getSingleGroupSearchScopeKey,
    getCalendarSearchScopeKey,
    getPublicFolderSearchScopeKey,
} from './getSearchScopeKey';
import {
    getPrimaryMailboxSearchScopeType,
    getArchiveMailboxSearchScopeType,
    getSharedFoldersSearchScopeType,
    getSingleGroupSearchScopeType,
    getCalendarSearchScopeType,
    getPublicFolderSearchScopeType,
} from './getSearchScopeType';
import { SearchScope, SearchScopeKind } from '../../data/schema/SearchScope';
import type BaseSearchScopeType from 'owa-service/lib/contract/BaseSearchScopeType';
import {
    getPrimaryMailboxSearchScopeList,
    getArchiveMailboxSearchScopeList,
    getSharedFoldersScopeList,
    getGroupSearchScopeList,
    getCalendarSearchScopeList,
    getPublicFolderSearchScopeList,
} from './getSearchScopeList';

interface SearchScenario {
    // Gets the Unique Key related a given SearchScope
    getKey: (scope: SearchScope) => string;

    // Gets the SearchScope list used for the current scope scenario
    getSearchScopeList: () => SearchScope[];

    // Gets the BaseSearchScopeType object used for the search request for a given SearchScope
    getSearchScopeType: (scope: SearchScope) => BaseSearchScopeType[];
}

const primaryMailboxScenario: SearchScenario = {
    getKey: getPrimaryMailboxSearchScopeKey,
    getSearchScopeList: getPrimaryMailboxSearchScopeList,
    getSearchScopeType: getPrimaryMailboxSearchScopeType,
};

const archiveMailboxScenario: SearchScenario = {
    getKey: getArchiveMailboxSearchScopeKey,
    getSearchScopeList: getArchiveMailboxSearchScopeList,
    getSearchScopeType: getArchiveMailboxSearchScopeType,
};

const sharedFoldersScenario: SearchScenario = {
    getKey: getSharedFoldersSearchScopeKey,
    getSearchScopeList: getSharedFoldersScopeList,
    getSearchScopeType: getSharedFoldersSearchScopeType,
};

const groupScenario: SearchScenario = {
    getKey: getSingleGroupSearchScopeKey,
    getSearchScopeList: getGroupSearchScopeList,
    getSearchScopeType: getSingleGroupSearchScopeType,
};

const calendarScenario: SearchScenario = {
    getKey: getCalendarSearchScopeKey,
    getSearchScopeList: getCalendarSearchScopeList,
    getSearchScopeType: getCalendarSearchScopeType,
};

const publicFolderScenario: SearchScenario = {
    getKey: getPublicFolderSearchScopeKey,
    getSearchScopeList: getPublicFolderSearchScopeList,
    getSearchScopeType: getPublicFolderSearchScopeType,
};

const pickScenario = (scope: SearchScope) => {
    switch (scope.kind) {
        case SearchScopeKind.PrimaryMailbox:
            return primaryMailboxScenario;
        case SearchScopeKind.ArchiveMailbox:
            return archiveMailboxScenario;
        case SearchScopeKind.SharedFolders:
            return sharedFoldersScenario;
        case SearchScopeKind.Group:
            return groupScenario;
        case SearchScopeKind.Calendar:
            return calendarScenario;
        case SearchScopeKind.PublicFolder:
            return publicFolderScenario;

        default:
            throw new Error('Unregistered search scope');
    }
};

export const getKey = (scope: SearchScope) => pickScenario(scope).getKey(scope);
export const getSearchScopeList = (scope: SearchScope) => pickScenario(scope).getSearchScopeList();
export const getSearchScopeType = (scope: SearchScope) =>
    pickScenario(scope).getSearchScopeType(scope);
