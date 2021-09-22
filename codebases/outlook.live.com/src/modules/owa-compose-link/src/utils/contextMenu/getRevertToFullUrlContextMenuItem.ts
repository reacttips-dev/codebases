import type { IContextualMenuItem } from '@fluentui/react/lib/ContextualMenu';
import { logUsage } from 'owa-analytics';
import { ControlIcons } from 'owa-control-icons';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getExtensionFromFileName } from 'owa-file';
import { getSharingLinkInfo } from 'owa-link-data';
import loc from 'owa-localize';
import { showOriginalUrl } from './getRevertToFullUrlContextMenuItem.locstring.json';
import { closeLinkContextMenu, ReplaceLinkHandler } from '../../components/LinkContextMenu';
import type ComposeLinkViewState from '../../store/schema/ComposeLinkViewState';

export function getRevertToFullUrlContextMenuItem(
    composeLinkViewState: ComposeLinkViewState,
    anchorElement: HTMLAnchorElement,
    convertToFullUrlHandler: ReplaceLinkHandler
): IContextualMenuItem {
    const sharingLinkInfo = getSharingLinkInfo(composeLinkViewState.linkId);
    const extension = (getExtensionFromFileName(sharingLinkInfo.fileName) || '').toLowerCase();
    if (!composeLinkViewState.isLinkBeautified || extension === '.fluid') {
        return null;
    }

    return {
        name: loc(showOriginalUrl),
        key: 'RevertToFullUrl',
        iconProps:
            isFeatureEnabled('wvn-chicletEditOptions') ||
            isFeatureEnabled('wvn-chicletEditOptionsNoDownload') ||
            isFeatureEnabled('wvn-editOptionsMasterFlight')
                ? { iconName: ControlIcons.Globe }
                : undefined,
        onClick: () => {
            logUsage('AttachmentLinkViewRevertToFullUrl');
            closeLinkContextMenu();
            convertToFullUrlHandler(anchorElement.href, anchorElement.href);
        },
    };
}
