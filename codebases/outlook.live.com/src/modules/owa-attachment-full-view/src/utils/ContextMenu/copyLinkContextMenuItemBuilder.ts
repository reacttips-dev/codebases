import { CopyLinkText } from 'owa-locstrings/lib/strings/copylinktext.locstring.json';
import { CopyToClipboardPromptText } from 'owa-locstrings/lib/strings/copytoclipboardprompttext.locstring.json';
import { CopyToClipboardMacPromptText } from 'owa-locstrings/lib/strings/copytoclipboardmacprompttext.locstring.json';
import loc, { isStringNullOrWhiteSpace } from 'owa-localize';
import isMenuActionSupported from '../../utils/isMenuActionSupported';
import type { IContextualMenuItem } from '@fluentui/react/lib/ContextualMenu';
import { logUsage } from 'owa-analytics';
import { AttachmentFullViewState, AttachmentMenuAction } from 'owa-attachment-full-data';
import type { ReferenceAttachmentModel } from 'owa-attachment-model-store';
import getAttachment from 'owa-attachment-model-store/lib/selectors/getAttachment';
import { ControlIcons } from 'owa-control-icons';
import { isFeatureEnabled } from 'owa-feature-flags';
import { isMac } from 'owa-user-agent/lib/userAgent';

export function copyLinkToClipboard(openUrl: string, targetWindow: Window) {
    const text = isMac() ? loc(CopyToClipboardMacPromptText) : loc(CopyToClipboardPromptText);
    (targetWindow || window).prompt(text, openUrl);
}

function logCopyLinkToClipboard(providerType: string, attachmentId: string) {
    logUsage('AttachmentContextMenuItemCopyLink', [providerType, attachmentId]);
}

export default function copyLinkMenuContextItemBuilder(
    attachment: AttachmentFullViewState,
    providerType: string,
    targetWindow: Window
): IContextualMenuItem {
    const attachmentModel = getAttachment(attachment.attachmentId);

    if (
        !isMenuActionSupported(AttachmentMenuAction.CopyLink, attachment) ||
        !attachment.strategy ||
        !attachment.strategy.isOpeningByLinkSupported ||
        !attachmentModel ||
        isStringNullOrWhiteSpace((<ReferenceAttachmentModel>attachmentModel).openUrl)
    ) {
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
            copyLinkToClipboard((<ReferenceAttachmentModel>attachmentModel).openUrl, targetWindow);
            logCopyLinkToClipboard(providerType, attachmentModel.model.AttachmentId?.Id);
        },
    };
}
