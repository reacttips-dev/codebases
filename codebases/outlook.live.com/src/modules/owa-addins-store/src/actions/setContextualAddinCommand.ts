import type ContextualAddinCommand from '../store/schema/ContextualAddinCommand';
import createRunningInstance from '../store/createRunningInstance';
import getExtensibilityState from '../store/getExtensibilityState';
import { action } from 'satcheljs/lib/legacy';

export default action('setContextualAddinCommand')(function setContextualAddinCommand(
    controlId: string,
    index: string,
    contextual: ContextualAddinCommand
) {
    getExtensibilityState().runningContextualAddinCommand = createRunningInstance(
        controlId,
        contextual,
        index
    );
});
