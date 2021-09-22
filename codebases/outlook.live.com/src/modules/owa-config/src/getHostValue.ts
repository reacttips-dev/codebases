import { NATIVE } from './types/HostApp';
import { getOpxHostApp } from './getOpxHostData';

export function getHostValue() {
    const isNative = (window as any).HxGlobals && (window as any).nativeHost;

    if (isNative) {
        return NATIVE;
    }
    return getOpxHostApp();
}
