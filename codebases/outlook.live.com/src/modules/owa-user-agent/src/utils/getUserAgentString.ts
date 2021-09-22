export default function getUserAgentString() {
    return typeof navigator != 'undefined' && navigator.userAgent ? navigator.userAgent : '';
}
