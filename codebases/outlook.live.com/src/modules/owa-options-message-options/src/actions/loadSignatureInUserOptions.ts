import setSignatureInUserOptions from '../actions/setSignatureInUserOptions';
import getMailboxMessageConfigurationOperation from 'owa-service/lib/operation/getMailboxMessageConfigurationOperation';

let loadSignatureInUserOptionsPromise: Promise<void>;

/**
 * SignatureHtml and SignatureText is not fetched through session data
 * Instead, it needs to be fetched separately from GetMailboxMessageConfiguration
 */
export default function loadSignatureInUserOptions(): Promise<void> {
    if (!loadSignatureInUserOptionsPromise) {
        loadSignatureInUserOptionsPromise = getMailboxMessageConfigurationOperation().then(
            messageConfigurationResponse => {
                let mailboxMessageConfigurationOptions = messageConfigurationResponse.Options;
                if (mailboxMessageConfigurationOptions) {
                    setSignatureInUserOptions(
                        mailboxMessageConfigurationOptions.SignatureHtml,
                        mailboxMessageConfigurationOptions.SignatureText
                    );
                }
            }
        );
    }

    return loadSignatureInUserOptionsPromise;
}
