import { ComposeViewState, UIEnabledState } from 'owa-mail-compose-store';

export default function canModifyRecipients(viewState: ComposeViewState) {
    const { IRMData } = viewState.protectionViewState;
    const isReadonly = viewState.uiEnabledState === UIEnabledState.AllDisabled;
    return (!IRMData || IRMData.IsOwner || IRMData.ForwardAllowed) && !isReadonly;
}
