import { orchestrator } from 'satcheljs';
import { lazyMountAndShowFullOptions } from 'owa-options-view';
import { manageAdsOptions } from '../actions/internalActions';

const manageAdsOptionsOrchestrator = orchestrator(manageAdsOptions, actionMessage => {
    if (actionMessage.showGdprPartnerListViewV3) {
        lazyMountAndShowFullOptions.importAndExecute('general', 'advertisement', 'showpartnerlist');
    } else {
        lazyMountAndShowFullOptions.importAndExecute('general', 'advertisement');
    }
});

export default manageAdsOptionsOrchestrator;
