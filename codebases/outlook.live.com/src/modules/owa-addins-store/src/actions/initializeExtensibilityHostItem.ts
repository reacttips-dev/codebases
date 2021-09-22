import extensibilityState from '../store/store';
import { action } from 'satcheljs/lib/legacy';
import { createExtensibilityHostItem } from '../store/schema/ExtensibilityHostItem';

export default action('initializeExtensibilityHostItem')(function initializeExtensibilityHostItem(
    index: string
) {
    if (!extensibilityState.HostItems.has(index)) {
        extensibilityState.HostItems.set(index, createExtensibilityHostItem());
    }
});
