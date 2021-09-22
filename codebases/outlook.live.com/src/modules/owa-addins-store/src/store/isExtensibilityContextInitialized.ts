import getExtensibilityState from './getExtensibilityState';
import type IEnabledAddinCommands from '../store/schema/interfaces/IEnabledAddinCommands';

export default function isExtensibilityContextInitialized(): boolean {
    const enabledAddinCommands: IEnabledAddinCommands = getExtensibilityState()
        .EnabledAddinCommands;
    return !!enabledAddinCommands ? enabledAddinCommands.isInitialized : false;
}
