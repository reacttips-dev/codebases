import { isFeatureEnabled } from 'owa-feature-flags';
import {
    isBrowserChrome,
    isBrowserEDGECHROMIUM,
    isBrowserFirefox,
    isBrowserSafari,
} from 'owa-user-agent/lib/userAgent';

export default function isProofingSupported(): boolean {
    return (
        isBrowserChrome() ||
        isBrowserEDGECHROMIUM() ||
        (isFeatureEnabled('mc-officeEditorBXFirefoxSafari') &&
            (isBrowserFirefox() || isBrowserSafari()))
    );
}
