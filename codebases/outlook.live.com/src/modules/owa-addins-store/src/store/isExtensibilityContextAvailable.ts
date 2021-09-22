import getExtensibilityState from './getExtensibilityState';

export default function isExtensibilityContextAvailable(): boolean {
    const context = getExtensibilityState().Context;
    return context != null;
}
