import type { FolderForestTreeType } from 'owa-graph-schema';
import { getListViewTypeString } from 'owa-mail-list-store';
import {
    switchGroupDatapointName,
    navigateFromMeToWeDatapointName,
} from 'owa-group-common/lib/constants';
import { getListViewTypeForGroup } from 'owa-group-mail-list-actions';

export default {
    selectPersona: {
        name: 'SelectPersona',
    },
    selectPrivateDistributionList: {
        name: 'SelectPrivateDistributionList',
    },
    selectFavoriteSearch: {
        name: 'TnS_SelectFavoriteSearch',
    },
    selectFavoriteCategory: {
        name: 'TnS_SelectFavoriteCategory',
    },
    // This DP measures the loading of Group script
    selectGroup: {
        name: 'SelectGroup',
        options: {},
    },
    switchGroup: {
        name: switchGroupDatapointName,
        options: {},
        customData: (groupId: string, treeType: FolderForestTreeType) => ({
            TreeType: treeType,
            ListViewType: getListViewTypeString(getListViewTypeForGroup()),
        }),
    },
    navigateFromMeToWe: {
        name: navigateFromMeToWeDatapointName,
        options: {},
        customData: (groupId: string, treeType: FolderForestTreeType) => ({
            TreeType: treeType,
            ListViewType: getListViewTypeString(getListViewTypeForGroup()),
        }),
    },
};
