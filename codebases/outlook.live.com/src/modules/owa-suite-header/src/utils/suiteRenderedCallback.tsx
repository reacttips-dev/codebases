/* tslint:disable:jsx-no-lambda WI:47690 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { updateIsSuiteHeaderRendered, updateShySuiteHeaderMode } from 'owa-suite-header-store';
import { isFeatureEnabled } from 'owa-feature-flags';
import { OwaSettingsButtonID } from '../constants';
import { WebPushDiscovery } from 'owa-webpush-notifications/lib/lazyFunctions';

export function suiteRenderedCallback() {
    if (isFeatureEnabled('fwk-webPushNotification')) {
        const target = document.getElementById(OwaSettingsButtonID);
        if (target !== null) {
            const webPushDiscoveryContainer = document.createElement('div');
            webPushDiscoveryContainer.id = 'webpushdiscoverycontainer';
            document.body.appendChild(webPushDiscoveryContainer);
            ReactDOM.render(
                <React.StrictMode>
                    <WebPushDiscovery calloutTarget={() => target} />
                </React.StrictMode>,
                webPushDiscoveryContainer
            );
        }
    }
    updateIsSuiteHeaderRendered(true);
    if (window.O365Shell) {
        window.O365Shell.Header.OnShyHeaderModeChanged(updateShySuiteHeaderMode);
    }
}
