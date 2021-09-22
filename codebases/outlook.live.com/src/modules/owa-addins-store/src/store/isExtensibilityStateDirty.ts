import { extensibilityState } from '../index';

export default function isExtensibilityStateDirty(): boolean {
    return extensibilityState.ExtensibilityStateIsDirty;
}
