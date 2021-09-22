import { OperationType } from '../utils/constants';
import { logUsage } from 'owa-analytics';
import { setItem, localStorageExists } from 'owa-local-storage';
import { mailtoProtocolHandlerTitle } from 'owa-locstrings/lib/strings/pwa.locstring.json';
import { getOrigin, getMailPath } from 'owa-url';
import loc from 'owa-localize';

export function registerMailtoProtocolHandler() {
    if (window?.navigator?.registerProtocolHandler) {
        window.navigator.registerProtocolHandler(
            'mailto',
            `${getOrigin()}${getMailPath()}deeplink/compose?mailtouri=%s`,
            loc(mailtoProtocolHandlerTitle)
        );
    }
}

export default function handleAndLogOperation(operation: OperationType) {
    if (localStorageExists(window)) {
        setItem(window, operation, new Date().getTime().toString());
    }

    if (operation === OperationType.TryItNow) {
        registerMailtoProtocolHandler();
    }

    logUsage('mailToHandlerEvent', { UserAction: operation });
}
