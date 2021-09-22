import { isWebView2BridgeInitialized } from '@microsoft/pie.webview2bridge';

export function isPieHostBridgeInitialized(): boolean {
    return isWebView2BridgeInitialized();
}
