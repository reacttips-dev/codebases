export default function isCmdHeld(e, isMacOS) {
    if (isMacOS && e.metaKey) {
        return true;
    }
    if (!isMacOS && e.ctrlKey) {
        return true;
    }
    return false;
}