import getScopedPath from './getScopedPath';

let indexedReactPath: string;
let redirectUserToOwnedGroups: boolean;
let deletedSectionIndexedReactPath: string;
export default function getGroupsHubPath(redirectToOwnedGroups: boolean): string {
    if (!indexedReactPath || redirectUserToOwnedGroups !== redirectToOwnedGroups) {
        redirectUserToOwnedGroups = redirectToOwnedGroups;
        indexedReactPath = redirectToOwnedGroups
            ? getScopedPath('/people/group/owner') + '/'
            : getScopedPath('/people/group/member') + '/';
    }
    return indexedReactPath;
}

export function getGroupsHubDeletedSectionPath(): string {
    if (!deletedSectionIndexedReactPath) {
        deletedSectionIndexedReactPath = getScopedPath('/people/group/deleted') + '/';
    }
    return deletedSectionIndexedReactPath;
}
