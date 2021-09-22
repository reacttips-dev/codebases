import type IEnabledAddinCommands from '../store/schema/interfaces/IEnabledAddinCommands';
import extensibilityState from '../store/store';
import { action } from 'satcheljs/lib/legacy';

export default action('setEnabledAddinCommands')(function setEnabledAddinCommands(
    enabledAddinCommands: IEnabledAddinCommands
) {
    extensibilityState.EnabledAddinCommands = enabledAddinCommands;
});
