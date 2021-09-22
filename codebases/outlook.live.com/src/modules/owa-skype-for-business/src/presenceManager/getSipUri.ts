export const SIP_PREFIX = 'sip:';

export default function getSipUri(imAddress: string): string {
    if (!imAddress) {
        return null;
    }

    let sipUri = imAddress.toLowerCase();
    if (sipUri.indexOf(SIP_PREFIX) != 0) {
        sipUri = SIP_PREFIX + sipUri;
    }
    return sipUri;
}
