import {
    ContextualAddinCommand,
    getNextControlId,
    setContextualAddinCommand,
} from 'owa-addins-store';

export default function executeContextual(
    entryPointIndex: string,
    contextual: ContextualAddinCommand
) {
    const controlId = getNextControlId();
    setContextualAddinCommand(controlId, entryPointIndex, contextual);
}
