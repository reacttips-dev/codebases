import getGroupDetails from './getGroupDetails';
import type UnifiedGroupResource from 'owa-service/lib/contract/UnifiedGroupResource';
import type UnifiedGroupDetails from 'owa-service/lib/contract/UnifiedGroupDetails';

export type ResourceName =
    | 'Site'
    | 'Files'
    | 'Notebook'
    | 'Planner'
    | 'Integrations'
    | 'CustomLeaveGroup';

export const getGroupResource = (
    group: string | UnifiedGroupDetails,
    resource: ResourceName
): UnifiedGroupResource[] => {
    const groupDetails = typeof group === 'string' ? getGroupDetails(group) : group;
    if (!groupDetails || !groupDetails.GroupResources) {
        return null;
    }

    const siteResources = groupDetails.GroupResources.filter(groupResource => {
        return groupResource.Name === resource;
    });

    if (!siteResources || siteResources.length < 1) {
        return null;
    }

    return siteResources;
};

export const getGroupResourceUrl = (
    group: string | UnifiedGroupDetails,
    resource: ResourceName
): string => {
    const r = getGroupResource(group, resource);
    if (!r || r.length == 0) {
        return null;
    }

    return r[0].Url;
};
