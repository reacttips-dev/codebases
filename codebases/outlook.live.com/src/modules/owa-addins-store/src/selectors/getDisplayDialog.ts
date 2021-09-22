import extensibilityState from '../store/store';
import type { ActiveDialog } from '../store/schema/interfaces/Dialog';

export default function getDisplayDialog(hostItemIndex: string): ActiveDialog {
    return extensibilityState.activeDialogs.get(hostItemIndex);
}
