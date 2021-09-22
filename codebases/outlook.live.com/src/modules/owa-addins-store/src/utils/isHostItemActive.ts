import getExtensibilityState from '../store/getExtensibilityState';

export default function isHostItemActive(hostItemIndex: string) {
    return getExtensibilityState().HostItems.has(hostItemIndex);
}
