import { orchestrator } from 'satcheljs';
import { lazyMountAndShowFullOptions } from 'owa-options-view';
import { manageLgpdAdsOptions } from '../actions/internalActions';

const manageLgpdAdsOptionsOrchestrator = orchestrator(manageLgpdAdsOptions, actionMessage => {
    lazyMountAndShowFullOptions.importAndExecute('general', 'advertisementlgpd');
});

export default manageLgpdAdsOptionsOrchestrator;
