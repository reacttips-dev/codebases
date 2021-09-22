import extensibilityState from './store';
import type ExtensibilityState from './schema/ExtensibilityState';

export default function getExtensibilityState(): ExtensibilityState {
    return extensibilityState;
}
