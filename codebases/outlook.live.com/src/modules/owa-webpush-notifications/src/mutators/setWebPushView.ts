import { completeEnableWebPushCallout, showEnableWebPushCallout } from '../actions/calloutActions';
import {
    completeManualNotificationPermissionsPrompt,
    showManualNotificationPermissionsPrompt,
} from '../actions/manualPromptActions';
import {
    dismissNotificationPermissionsOverlay,
    showNotificationPermissionsOverlay,
} from '../actions/overlayActions';
import {
    completeWebPushSecondChanceCallout,
    showWebPushSecondChanceCallout,
} from '../actions/secondChanceCalloutActions';
import {
    dismissWebPushSuccessCallout,
    showWebPushSuccessCallout,
} from '../actions/successCalloutActions';
import { webPushStore, WebPushWorkflowView } from '../store/store';
import { mutator } from 'satcheljs';

export { CalloutResult } from '../actions/calloutActions';

export const setCalloutVisible = mutator(showEnableWebPushCallout, () =>
    setView(WebPushWorkflowView.EnableCallout)
);
export const setCalloutHidden = mutator(completeEnableWebPushCallout, () =>
    unsetView(WebPushWorkflowView.EnableCallout)
);

export const setPermissionsOverlayVisible = mutator(showNotificationPermissionsOverlay, () =>
    setView(WebPushWorkflowView.PermissionsOverlay)
);
export const setPermissionsOverlayHidden = mutator(dismissNotificationPermissionsOverlay, () =>
    unsetView(WebPushWorkflowView.PermissionsOverlay)
);

export const setManualPermissionsVisible = mutator(showManualNotificationPermissionsPrompt, () =>
    setView(WebPushWorkflowView.ManualPermissionsPopup)
);
export const setManualPermissionsHidden = mutator(completeManualNotificationPermissionsPrompt, () =>
    unsetView(WebPushWorkflowView.ManualPermissionsPopup)
);

export const setSecondChanceCalloutVisible = mutator(showWebPushSecondChanceCallout, () =>
    setView(WebPushWorkflowView.SecondChanceCallout)
);
export const setSecondChanceCalloutHidden = mutator(completeWebPushSecondChanceCallout, () =>
    unsetView(WebPushWorkflowView.SecondChanceCallout)
);

export const setSuccessCalloutVisible = mutator(showWebPushSuccessCallout, () =>
    setView(WebPushWorkflowView.Success)
);
export const setSuccessCalloutHidden = mutator(dismissWebPushSuccessCallout, () =>
    unsetView(WebPushWorkflowView.Success)
);

const setView = (view: WebPushWorkflowView) => {
    webPushStore.currentView = view;
};

const unsetView = (view: WebPushWorkflowView) => {
    if (webPushStore.currentView === view) {
        webPushStore.currentView = WebPushWorkflowView.None;
    }
};
