import { editHyperlink } from './getEditLinkContextMenuItem.locstring.json';
import type { ReplaceLinkHandler } from '../../components/LinkContextMenu';
import type { IContextualMenuItem } from '@fluentui/react/lib/ContextualMenu';
import { logUsage } from 'owa-analytics';
import getText from '../getText';
import { ControlIcons } from 'owa-control-icons';
import { DialogResponse } from 'owa-confirm-dialog';
import { InsertLinkProperties, lazyDisplayInsertLinkDialog } from 'owa-editor-ribbon-secondary-ui';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getExtensionFromFileName } from 'owa-file';
import { getSharingLinkInfo } from 'owa-link-data';
import loc from 'owa-localize';
import { isNullOrWhiteSpace } from 'owa-string-utils';
import type ComposeLinkViewState from '../../store/schema/ComposeLinkViewState';

export function getEditLinkContextMenuItem(
    composeLinkViewState: ComposeLinkViewState,
    anchorElement: HTMLAnchorElement,
    editUrlHandler: ReplaceLinkHandler,
    targetWindow: Window
): IContextualMenuItem {
    const sharingLinkInfo = getSharingLinkInfo(composeLinkViewState.linkId);
    const extension = (getExtensionFromFileName(sharingLinkInfo.fileName) || '').toLowerCase();
    if (!composeLinkViewState.isLinkBeautified || extension === '.fluid') {
        return null;
    }

    // preload lazyDisplayInsertLinkDialog
    lazyDisplayInsertLinkDialog.import();
    return {
        name: loc(editHyperlink),
        key: 'EditLink',
        iconProps:
            isFeatureEnabled('wvn-chicletEditOptions') ||
            isFeatureEnabled('wvn-chicletEditOptionsNoDownload') ||
            isFeatureEnabled('wvn-editOptionsMasterFlight')
                ? { iconName: ControlIcons.CodeEdit }
                : undefined,
        onClick: () => {
            logUsage('AttachmentLinkViewEditLink');
            editLink(anchorElement, editUrlHandler, targetWindow);
        },
    };
}

async function editLink(
    anchorElement: HTMLAnchorElement,
    editUrlHandler: ReplaceLinkHandler,
    targetWindow: Window
) {
    const anchorElementText = getText(anchorElement);
    const insertLink: InsertLinkProperties = {
        LinkUrl: anchorElement.href,
        DisplayText: anchorElementText,
        HasChanged: false,
    };
    const displayInsertLinkDialog = await lazyDisplayInsertLinkDialog.import();
    const windowInternal = targetWindow || window;
    if (
        // TODO: 78252 Beautified Link in projection popout
        (await displayInsertLinkDialog(insertLink, windowInternal)) === DialogResponse.ok &&
        insertLink.HasChanged
    ) {
        // If the url is unchanged, and the user removed the display text we leave the link as is.
        if (
            insertLink.LinkUrl === anchorElement.href &&
            isNullOrWhiteSpace(insertLink.DisplayText)
        ) {
            return;
        }
        editUrlHandler(
            insertLink.LinkUrl,
            insertLink.DisplayText.length > 0 ? insertLink.DisplayText : null
        );
    }
}
