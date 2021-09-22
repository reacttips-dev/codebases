import { getStore as getRoamingSignatureStore } from 'owa-mail-signature/lib/store/signatureStore';
import { updateUserConfiguration } from 'owa-session-store/lib/actions/updateUserConfiguration';
import { action } from 'satcheljs/lib/legacy';
import isRoamingSignatureEnabled from 'owa-roaming-signature-option/lib/utils/isRoamingSignatureEnabled';

export default action('disableClientSignatureOnReply')(function disableClientSignatureOnReply() {
    if (isRoamingSignatureEnabled()) {
        const store = getRoamingSignatureStore();

        if (store.defaultReplySignatureName) {
            store.defaultReplySignatureName = ''; //Disable the client signature check for Reply/ReplyAll/Forward mail
        }
    } else {
        updateUserConfiguration(config => {
            const userOption = config.UserOptions;
            if (userOption.AutoAddSignatureOnReply) {
                userOption.AutoAddSignatureOnReply = !userOption.AutoAddSignatureOnReply; //Disable the client signature check for Reply/ReplyAll/Forward mail
            }
        });
    }
});
