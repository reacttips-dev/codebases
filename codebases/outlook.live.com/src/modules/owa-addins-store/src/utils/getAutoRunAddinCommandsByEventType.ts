import type LaunchEventType from 'owa-service/lib/contract/LaunchEventType';
import type IAddin from '../store/schema/interfaces/IAddin';
import type IEnabledAddinCommands from '../store/schema/interfaces/IEnabledAddinCommands';
import getExtensibilityState from '../store/getExtensibilityState';
import type IAutoRunAddinCommand from '../store/schema/interfaces/IAutoRunAddinCommand';

let getAutoRunAddinCommandsByEventType = (
    launchEventType: LaunchEventType
): IAutoRunAddinCommand[] => {
    const enabledAddinCommands: IEnabledAddinCommands = getExtensibilityState()
        .EnabledAddinCommands;
    if (!enabledAddinCommands) {
        return [];
    }

    const autoRunAddinList: IAddin[] = enabledAddinCommands.getAutoRunAddinsByLaunchEventType(
        launchEventType
    );
    const autoRunAddinCommandsList = autoRunAddinList.map(addin => {
        return addin.AddinCommands.get(launchEventType.toString());
    }) as IAutoRunAddinCommand[];

    return autoRunAddinCommandsList;
};

export default getAutoRunAddinCommandsByEventType;
