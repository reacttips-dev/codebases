import getExtensibilityState from '../store/getExtensibilityState';
import type RunningInstance from '../store/schema/RunningInstance';

export default function getContextualRunningInstance(controlId: string): RunningInstance {
    const state = getExtensibilityState();
    if (
        state.runningContextualAddinCommand &&
        state.runningContextualAddinCommand.controlId === controlId
    ) {
        return state.runningContextualAddinCommand;
    }
    return null;
}
