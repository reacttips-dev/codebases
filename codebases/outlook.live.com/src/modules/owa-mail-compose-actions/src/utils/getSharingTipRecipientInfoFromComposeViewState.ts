import { getRecipientWellsFromComposeViewState } from './getAllRecipientsAsEmailAddressStrings';
import getCurrentFromAddress from './getFromAddressFromRecipientWell';
import type { ComposeViewState } from 'owa-mail-compose-store';
import { lazyGetSharingTipRecipientInfo } from 'owa-link-data';
import type { SharingTipRecipientInfo } from 'owa-sharing-data';

export async function getSharingTipRecipientInfoFromComposeViewState(
    viewState: ComposeViewState
): Promise<SharingTipRecipientInfo[]> {
    const recipientWells = getRecipientWellsFromComposeViewState(viewState);
    const fromAddress: string = getCurrentFromAddress(viewState.toRecipientWell);
    const getSharingTipRecipientInfo = await lazyGetSharingTipRecipientInfo.import();
    return getSharingTipRecipientInfo(recipientWells, fromAddress);
}
