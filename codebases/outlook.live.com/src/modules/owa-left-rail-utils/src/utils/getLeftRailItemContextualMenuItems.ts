import type { IContextualMenuItem } from '@fluentui/react/lib/ContextualMenu';
import { OpenInNewTabText } from 'owa-locstrings/lib/strings/openinnewtabtext.locstring.json';
import loc from 'owa-localize';
import { isFeatureEnabled } from 'owa-feature-flags';

export default function getLeftRailItemContextualMenuItems(
    key: string,
    url: string
): IContextualMenuItem[] {
    const items = [
        {
            key: key + '_openInNewTab',
            onClick: () => {
                window.open(url, '_blank');
            },
            text: loc(OpenInNewTabText),
        },
    ];

    return isFeatureEnabled('fwk-module-switch') || isFeatureEnabled('tri-officeRailHost')
        ? items
        : null;
}
