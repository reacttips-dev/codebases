import getO365ShellShim from '../../utils/getO365ShellShim';
import openFlexPane from '../actions/openFlexPane';
import { orchestrator } from 'satcheljs';

export const openFlexPaneMutator = orchestrator(openFlexPane, actionMessage => {
    const shim = getO365ShellShim();
    if (shim) {
        shim.FlexPane.OpenFlexPaneForProvider(actionMessage.flexPaneId);
    }
});
