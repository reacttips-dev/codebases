import extensibilityState from './store';
import type { ExtensibilityHostItem } from './schema/ExtensibilityHostItem';

export default function getHostItem(hostItemIndex: string): ExtensibilityHostItem {
    return extensibilityState.HostItems.get(hostItemIndex);
}
