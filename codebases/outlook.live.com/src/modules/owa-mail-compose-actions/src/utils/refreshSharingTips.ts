import { getSharingTipRecipientInfoFromComposeViewState } from './getSharingTipRecipientInfoFromComposeViewState';
import { preloadLazyImports } from 'owa-attachment-block-on-send/lib/directIndex';
import { lazyRefreshSharingTipsAttachmentWell } from 'owa-attachment-well-data';
import type { ComposeViewState } from 'owa-mail-compose-store';
import type { SharingTipRecipientInfo } from 'owa-sharing-data';

export async function refreshSharingTips(viewState: ComposeViewState) {
    const refreshSharingTipsAttachmentWell = await lazyRefreshSharingTipsAttachmentWell.import();
    const recipientInfo: SharingTipRecipientInfo[] = await getSharingTipRecipientInfoFromComposeViewState(
        viewState
    );
    refreshSharingTipsAttachmentWell(
        viewState.attachmentWell,
        viewState.itemId,
        recipientInfo,
        viewState.infoBarIds.slice(),
        viewState
    );

    preloadLazyImports();
}
