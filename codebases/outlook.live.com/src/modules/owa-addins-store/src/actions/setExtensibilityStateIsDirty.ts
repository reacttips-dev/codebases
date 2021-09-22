import extensibilityState from '../store/store';
import { action } from 'satcheljs/lib/legacy';

export default action('setExtensibilityStateIsDirty')(function setExtensibilityStateIsDirty(
    newValue: boolean
) {
    extensibilityState.ExtensibilityStateIsDirty = newValue;
});
