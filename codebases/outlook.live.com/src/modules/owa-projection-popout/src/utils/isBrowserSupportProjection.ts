import {
    isBrowserChrome,
    isBrowserEDGECHROMIUM,
    isBrowserFirefox,
    isBrowserSafari,
} from 'owa-user-agent';

export default function isBrowserSupportProjection() {
    return isBrowserChrome() || isBrowserFirefox() || isBrowserEDGECHROMIUM() || isBrowserSafari();
}
