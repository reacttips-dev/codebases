import { OpenInNewTabText } from 'owa-locstrings/lib/strings/openinnewtabtext.locstring.json';
import loc from 'owa-localize';
import type { IContextualMenuItem } from '@fluentui/react/lib/ContextualMenu';
import { ControlIcons } from 'owa-control-icons';
import { isFeatureEnabled } from 'owa-feature-flags';

export function getOpenInNewTabContextMenuItem(
    url: string,
    targetWindow: Window,
    onClickCallback?: () => void
): IContextualMenuItem {
    return {
        name: loc(OpenInNewTabText),
        key: 'OpenInNewTab',
        iconProps:
            isFeatureEnabled('wvn-chicletEditOptions') ||
            isFeatureEnabled('wvn-chicletEditOptionsNoDownload') ||
            isFeatureEnabled('wvn-editOptionsMasterFlight')
                ? { iconName: ControlIcons.TabCenter }
                : undefined,
        onClick: () => {
            (targetWindow || window).open(url, '_blank');
            if (onClickCallback) {
                onClickCallback();
            }
        },
    };
}
