import { getExtensibilityState } from 'owa-addins-store';

export default function isContextualCalloutRunning(controlId: string): boolean {
    return (
        getExtensibilityState().runningContextualAddinCommand &&
        getExtensibilityState().runningContextualAddinCommand.controlId === controlId
    );
}
