import createFromRecipientWell from './createFromRecipientWell';
import { FromViewState, LoadAliasActionStatus } from 'owa-mail-compose-store';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';

export default function createFromViewState(
    isFromShown: boolean,
    fromAddress?: EmailAddressWrapper,
    isFromReadOnly?: boolean,
    isPost?: boolean
): FromViewState {
    return {
        // Usually, if the well is hidden, we don't need to set a from address.
        // However, if the well is read only or the compose scenario belongs to post, we need to/should calculate one anyway.
        from: isFromShown || isFromReadOnly || isPost ? createFromRecipientWell(fromAddress) : null,
        isFromShown: isFromShown,
        isFromContextMenuShown: false,
        sendAsEmailAddresses: [],
        loadAliasActionStatus: isConsumer()
            ? LoadAliasActionStatus.NotStarted
            : LoadAliasActionStatus.Finished,
        isFromReadOnly: isFromReadOnly,
        isFromEditing: false,
        isFromValid: true,
        fromWellFindControlViewState: null,
    };
}
