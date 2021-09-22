import { CopyLinkText } from 'owa-locstrings/lib/strings/copylinktext.locstring.json';
import { CopyToClipboardPromptText } from 'owa-locstrings/lib/strings/copytoclipboardprompttext.locstring.json';
import { CopyToClipboardMacPromptText } from 'owa-locstrings/lib/strings/copytoclipboardmacprompttext.locstring.json';
import loc, { isStringNullOrWhiteSpace } from 'owa-localize';
import type { IContextualMenuItem } from '@fluentui/react/lib/ContextualMenu';
import { logUsage } from 'owa-analytics';
import { ControlIcons } from 'owa-control-icons';
import { isFeatureEnabled } from 'owa-feature-flags';

import { isMac } from 'owa-user-agent/lib/userAgent';

function copyLinkToClipboard(openUrl: string, targetWindow: Window) {
    const text = isMac() ? loc(CopyToClipboardMacPromptText) : loc(CopyToClipboardPromptText);
    (targetWindow || window).prompt(text, openUrl);
}

export function getCopyLinkContextMenuItem(
    anchorElement: HTMLAnchorElement,
    targetWindow: Window
): IContextualMenuItem {
    if (isStringNullOrWhiteSpace(anchorElement.href)) {
        return null;
    }

    return {
        name: loc(CopyLinkText),
        key: 'CopyLink',
        iconProps:
            isFeatureEnabled('wvn-chicletEditOptions') ||
            isFeatureEnabled('wvn-chicletEditOptionsNoDownload') ||
            isFeatureEnabled('wvn-editOptionsMasterFlight')
                ? { iconName: ControlIcons.Link }
                : undefined,
        onClick: () => {
            copyLinkToClipboard(anchorElement.href, targetWindow);
            logUsage('AttachmentLinkViewCopyLink');
        },
    };
}
