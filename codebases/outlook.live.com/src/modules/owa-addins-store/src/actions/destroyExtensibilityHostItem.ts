import extensibilityState from '../store/store';
import { action } from 'satcheljs/lib/legacy';

export default action('destroyExtensibilityHostItem')(function destroyExtensibilityHostItem(
    hostItemIndex: string
) {
    extensibilityState.HostItems.delete(hostItemIndex);
});
