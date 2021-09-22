import type LaunchEventType from 'owa-service/lib/contract/LaunchEventType';
import { isFeatureEnabled } from 'owa-feature-flags';
import { launchAutoRunAddins } from 'owa-addins-view';
import { isExtensibilityContextInitialized } from 'owa-addins-store';

let startAutoRunAddin = (hostItemIndex: string, launchEventType: LaunchEventType, args?: any) => {
    if (isFeatureEnabled('addin-autoRun') && isExtensibilityContextInitialized()) {
        launchAutoRunAddins(hostItemIndex, launchEventType, args);
    }
};

export default startAutoRunAddin;
