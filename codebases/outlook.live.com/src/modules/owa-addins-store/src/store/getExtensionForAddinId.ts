import extensibilityState from './store';
import type Extension from 'owa-service/lib/contract/Extension';

export function getExtensionForAddinId(addinId: string): Extension {
    const context = extensibilityState.Context;
    for (let ext of context.Extensions) {
        if (ext.Id.toLowerCase() === addinId.toLowerCase()) {
            return ext;
        }
    }
    return null;
}
