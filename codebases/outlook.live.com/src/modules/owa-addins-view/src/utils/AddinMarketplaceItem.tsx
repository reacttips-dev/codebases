import { manageAddins } from './AddinMarketplaceItem.locstring.json';
import loc from 'owa-localize';
import { default as openInClientStore } from '../actions/openInClientStore';

import { AddinIcons } from 'owa-addins-icons';
import { IconType } from '@fluentui/react/lib/Icon';
import { IContextualMenuItem, ContextualMenuItemType } from '@fluentui/react/lib/ContextualMenu';

export function createAddinMarketplaceItem(): IContextualMenuItem {
    return {
        key: 'AddinMarketplace',
        name: loc(manageAddins),
        title: loc(manageAddins),
        ariaLabel: loc(manageAddins),
        iconProps: {
            iconName: AddinIcons.AddIn,
            iconType: IconType.default,
        },
        itemType: ContextualMenuItemType.Normal,
        onClick: () => {
            openInClientStore();
        },
    };
}

export function createDivider(): IContextualMenuItem {
    return {
        key: 'AddinMarketplaceDivider',
        displayName: '-',
        itemType: ContextualMenuItemType.Divider,
        iconProps: {
            iconName: AddinIcons.AddIn,
            iconType: IconType.default,
        },
        onClick: null,
    };
}
