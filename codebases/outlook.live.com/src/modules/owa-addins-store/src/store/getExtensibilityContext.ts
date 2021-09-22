import type ExtensibilityContext from 'owa-service/lib/contract/ExtensibilityContext';
import extensibilityState from './store';

export default function getExtensibilityContext(): ExtensibilityContext {
    return extensibilityState.Context;
}
