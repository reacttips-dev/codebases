import { HostBridge } from '@microsoft/pie.sharedbridge';
import { isWebView2BridgeInitialized } from '@microsoft/pie.webview2bridge';
import * as trace from 'owa-trace';

export async function isPieNamespaceGTE(namespaceName: string, version: number): Promise<boolean> {
    if (isWebView2BridgeInitialized()) {
        try {
            const namespaceVersion = await HostBridge.getNamespaceVersion(namespaceName);
            return namespaceVersion >= version;
        } catch (errorMessage) {
            // An exception is expected if the namespace is not present, it could also indicate
            // an unexpected. Log the reason the PIE call was rejected.
            trace.trace.warn(errorMessage);
        }
    } else {
        trace.errorThatWillCauseAlert('PieUsedOutsideOfNative');
    }

    return false;
}
