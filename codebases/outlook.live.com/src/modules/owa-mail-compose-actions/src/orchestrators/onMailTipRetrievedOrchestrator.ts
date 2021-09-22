import type { ComposeViewState } from 'owa-mail-compose-store';
import findComposeViewStateById, { IdSource } from '../utils/findComposeViewStateById';
import { refreshSharingTips } from '../utils/refreshSharingTips';
import { onMailTipRetrieved } from 'owa-mail-tips';
import { orchestrator } from 'satcheljs';
import { lazyExpandGroupsAndSmallDLs } from 'owa-recipient-permission-checker';
import type { SharingTipRecipientInfo } from 'owa-sharing-data';
import { getSharingTipRecipientInfoFromComposeViewState } from '../utils/getSharingTipRecipientInfoFromComposeViewState';

orchestrator(onMailTipRetrieved, async actionMessage => {
    const composeViewState: ComposeViewState = findComposeViewStateById(
        actionMessage.composeId,
        IdSource.Compose
    );
    if (!composeViewState) {
        return;
    }

    const recipientInfos: SharingTipRecipientInfo[] = await getSharingTipRecipientInfoFromComposeViewState(
        composeViewState
    );
    lazyExpandGroupsAndSmallDLs.importAndExecute(
        composeViewState.attachmentWell.sharingLinkIds,
        recipientInfos,
        composeViewState.composeId,
        false /* isCalendar */
    );
    refreshSharingTips(composeViewState);
});
