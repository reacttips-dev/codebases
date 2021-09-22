import { getStore as getRoamingSignatureStore } from 'owa-mail-signature/lib/store/signatureStore';
import { updateUserConfiguration } from 'owa-session-store/lib/actions/updateUserConfiguration';
import { action } from 'satcheljs/lib/legacy';
import isRoamingSignatureEnabled from 'owa-roaming-signature-option/lib/utils/isRoamingSignatureEnabled';

export default action('disableClientSignatureOnNew')(function disableClientSignatureOnNew() {
    if (isRoamingSignatureEnabled()) {
        const store = getRoamingSignatureStore();

        if (store.defaultSignatureName) {
            store.defaultSignatureName = ''; //Disable the client signature check for New mail
        }
    } else {
        updateUserConfiguration(config => {
            const userOption = config.UserOptions;
            if (userOption.AutoAddSignature) {
                userOption.AutoAddSignature = !userOption.AutoAddSignature; //Disable the client signature check for New mail
            }
        });
    }
});
