import type { ComposeViewState } from 'owa-mail-compose-store';
import disableClientSignatureOnReply from '../../actions/disableClientSignatureOnReply';
import disableClientSignatureOnNew from '../../actions/disableClientSignatureOnNew';
import { insertSignature } from 'owa-mail-compose-command';
import type { ComposeTypeResponse } from 'owa-addins-types';
import { ComposeType } from 'owa-editor-addin-plugin-types/lib/utils/AddinViewState';
import { setMailboxMessageConfiguration } from 'owa-options-core';
import type MailboxMessageConfigurationOptions from 'owa-service/lib/contract/MailboxMessageConfigurationOptions';
import { getStore as getRoamingSignatureStore } from 'owa-mail-signature/lib/store/signatureStore';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import {
    saveDefaultRoamingSignature,
    saveDefaultReplyRoamingSignature,
} from 'owa-mail-signature/lib/service/saveRoamingSignature';
import isRoamingSignatureEnabled from 'owa-roaming-signature-option/lib/utils/isRoamingSignatureEnabled';

export const getComposeTypeAndCoercionType = (
    viewState: ComposeViewState
) => (): ComposeTypeResponse => {
    let response: ComposeTypeResponse;
    let composeType: string = 'newMail';
    if (viewState.addin.draftComposeType === ComposeType.Reply) {
        composeType = 'reply';
    }
    if (viewState.addin.draftComposeType === ComposeType.Forward) {
        composeType = 'forward';
    }
    if (viewState.addin.draftComposeType === ComposeType.New) {
        composeType = 'newMail';
    }
    response = {
        coercionType: viewState.bodyType.toLowerCase(),
        composeType: composeType,
    };

    return response;
};

export const setSignature = (viewState: ComposeViewState) => (
    signature: string
): Promise<boolean> => {
    return insertSignature(viewState, signature, true /*replaceExisting*/)
        .then(() => true)
        .catch(() => false);
};

export const isClientSignatureEnabled = () => (): boolean => {
    if (isRoamingSignatureEnabled()) {
        const store = getRoamingSignatureStore();

        if (store.defaultSignatureName === '' && store.defaultReplySignatureName === '') {
            return false;
        }
        return true;
    } else {
        const userOption = getUserConfiguration().UserOptions;
        const isNativeSignatureEnabled: boolean =
            userOption.AutoAddSignature || userOption.AutoAddSignatureOnReply;
        return isNativeSignatureEnabled;
    }
};

export async function disableClientSignature(): Promise<boolean> {
    if (isRoamingSignatureEnabled()) {
        const store = getRoamingSignatureStore();
        let wasClientSignatureEnabled: boolean = false;
        if (store.defaultSignatureName) {
            disableClientSignatureOnNew();
            saveDefaultRoamingSignature('');
            wasClientSignatureEnabled = true;
        }
        if (store.defaultReplySignatureName) {
            disableClientSignatureOnReply();
            saveDefaultReplyRoamingSignature('');
            wasClientSignatureEnabled = true;
        }
        return wasClientSignatureEnabled;
    } else {
        const userOption = getUserConfiguration().UserOptions;
        let wasClientSignatureEnabled: boolean = false;
        if (userOption.AutoAddSignature) {
            disableClientSignatureOnNew();
            wasClientSignatureEnabled = true;
        }
        if (userOption.AutoAddSignatureOnReply) {
            disableClientSignatureOnReply();
            wasClientSignatureEnabled = true;
        }
        await setMailboxMessageConfiguration(<MailboxMessageConfigurationOptions>(<any>{
            AutoAddSignature: userOption.AutoAddSignature,
            AutoAddSignatureOnReply: userOption.AutoAddSignatureOnReply,
        }));
        return wasClientSignatureEnabled;
    }
}
