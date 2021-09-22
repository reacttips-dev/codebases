import { orchestrator } from 'satcheljs';
import { onViewModeChanged } from '../actions/onViewModeChanged';
import { onViewModeChangedInternal } from '../mutators/onViewModeChangedInternal';
import { saveCommandingViewModeOption } from 'owa-commanding-option';

export const onSetViewModeOrchestrator = orchestrator(onViewModeChanged, async actionMessage => {
    const { viewMode } = actionMessage;

    // Update store
    onViewModeChangedInternal(viewMode);

    // Update OWS'
    return saveCommandingViewModeOption(viewMode);
});
