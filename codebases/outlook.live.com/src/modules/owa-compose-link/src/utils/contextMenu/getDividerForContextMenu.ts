import { ContextualMenuItemType } from '@fluentui/react/lib/ContextualMenu';

export function getDividerForContextMenu(key: string) {
    return {
        key: key,
        itemType: ContextualMenuItemType.Divider,
    };
}
