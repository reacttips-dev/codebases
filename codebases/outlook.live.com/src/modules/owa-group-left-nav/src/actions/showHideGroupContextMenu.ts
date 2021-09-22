import type LeftNavGroupsSchema from '../store/schema/LeftNavGroups';
import type { IPoint } from '@fluentui/react/lib/Utilities';
import type GroupInformation from 'owa-groups-shared-store/lib/schema/GroupInformation';
import { action } from 'satcheljs/lib/legacy';

/*
 * Sets state to spawn a context menu attached to a left nav group.
 */
export let showGroupContextMenu = action('showGroupContextMenu')(function (
    state: LeftNavGroupsSchema,
    groupId: string,
    group: GroupInformation,
    anchor: IPoint,
    isRootNode: boolean
): void {
    state.withContextMenuGroup = {
        groupId,
        group,
        anchor,
        isRootNode,
    };
});

/*
 * Sets state to close the context menu attached to a left nav group.
 */
export let hideGroupContextMenu = action('hideGroupContextMenu')(function (
    state: LeftNavGroupsSchema
): void {
    state.withContextMenuGroup = null;
});
