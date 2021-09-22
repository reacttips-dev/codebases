import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { ComposeOperation } from 'owa-mail-compose-store';
import isRoamingSignatureEnabled from 'owa-roaming-signature-option/lib/utils/isRoamingSignatureEnabled';
import { getStore as getRoamingSignatureStore } from 'owa-mail-signature/lib/store/signatureStore';

export default function shouldAutoAddSignature(operation: ComposeOperation): boolean {
    const userOptions = getUserConfiguration().UserOptions;
    const {
        defaultSignatureName,
        defaultReplySignatureName,
        roamingSignatureMap,
    } = getRoamingSignatureStore();
    let autoAddSignature = false;
    switch (operation) {
        case ComposeOperation.New:
            if (isRoamingSignatureEnabled()) {
                autoAddSignature =
                    roamingSignatureMap.size > 0 && !!roamingSignatureMap.get(defaultSignatureName);
            } else {
                autoAddSignature = userOptions.AutoAddSignature;
            }
            break;
        case ComposeOperation.Reply:
        case ComposeOperation.ReplyAll:
        case ComposeOperation.Forward:
            if (isRoamingSignatureEnabled()) {
                autoAddSignature =
                    roamingSignatureMap.size > 0 &&
                    !!roamingSignatureMap.get(defaultReplySignatureName);
            } else {
                autoAddSignature = userOptions.AutoAddSignatureOnReply;
            }
            break;
    }

    return autoAddSignature;
}
