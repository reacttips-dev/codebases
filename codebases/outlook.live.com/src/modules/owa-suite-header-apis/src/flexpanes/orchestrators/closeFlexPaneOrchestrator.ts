import getO365ShellShim from '../../utils/getO365ShellShim';
import closeFlexPane from '../actions/closeFlexPane';
import { orchestrator } from 'satcheljs';

export const closeFlexPaneMutator = orchestrator(closeFlexPane, actionMessage => {
    const shim = getO365ShellShim();
    if (shim) {
        shim.FlexPane.CloseFlexPaneForProvider(actionMessage.flexPaneId);
    }
});
