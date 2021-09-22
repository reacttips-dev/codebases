import { AllowWebPushOverlay } from './AllowWebPushOverlay';
import { EnableWebPushCallout } from './EnableWebPushCallout';
import { EnableWebPushLightningCallout } from './EnableWebPushLightningCallout';
import { ManuallyAllowWebPushPopup } from './ManuallyAllowWebPushPopup';
import { SecondChanceCallout } from './SecondChanceCallout';
import { SuccessCallout } from './SuccessCallout';
import { webPushStore, WebPushWorkflowView } from '../store/store';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

export interface WebPushDiscoveryProps {
    calloutTarget: () => HTMLElement;
}

export const WebPushDiscovery = observer(function WebPushDiscovery(props: WebPushDiscoveryProps) {
    let currentView = null;
    switch (webPushStore.currentView) {
        case WebPushWorkflowView.EnableCallout:
            currentView = <EnableWebPushCallout target={props.calloutTarget} />;
            break;
        case WebPushWorkflowView.ManualPermissionsPopup:
            currentView = <ManuallyAllowWebPushPopup />;
            break;
        case WebPushWorkflowView.PermissionsOverlay:
            currentView = <AllowWebPushOverlay />;
            break;
        case WebPushWorkflowView.SecondChanceCallout:
            currentView = <SecondChanceCallout target={props.calloutTarget} />;
            break;
        case WebPushWorkflowView.Success:
            currentView = <SuccessCallout target={props.calloutTarget} />;
            break;
    }
    return (
        <>
            {currentView}
            <EnableWebPushLightningCallout target={props.calloutTarget} />
        </>
    );
});
