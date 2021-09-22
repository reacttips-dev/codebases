import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import getFromAddressWrapper from 'owa-mail-compose-actions/lib/utils/fromAddressUtils/getFromAddressWrapper';
import type { ComposeViewState } from 'owa-mail-compose-store';

export const getFrom = (viewState: ComposeViewState) => (): EmailAddressWrapper => {
    return viewState.fromViewState?.from
        ? viewState.fromViewState.from.email
        : getFromAddressWrapper();
};
