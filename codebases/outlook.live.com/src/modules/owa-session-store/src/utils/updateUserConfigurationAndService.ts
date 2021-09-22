import type OwaUserConfiguration from 'owa-service/lib/contract/OwaUserConfiguration';
import { updateUserConfiguration } from '../actions/updateUserConfiguration';
import type UpdateUserConfigurationJsonResponse from 'owa-service/lib/contract/UpdateUserConfigurationJsonResponse';
import type {
    UpdateUserConfigurationEntry,
    UserOptionsUpdateConfigName,
} from 'owa-service/lib/types/UpdateUserConfigurationEntry';
import { lazyUpdateUserConfigurationService } from '../lazyFunctions';

export function updateUserConfigurationAndService<
    TConfig extends UserOptionsUpdateConfigName = 'OWA.UserOptions'
>(
    updateFunction: (userConfig: OwaUserConfiguration) => void,
    updates: UpdateUserConfigurationEntry<TConfig>[],
    configName?: TConfig
): Promise<UpdateUserConfigurationJsonResponse> {
    updateUserConfiguration(updateFunction);
    return lazyUpdateUserConfigurationService.importAndExecute(updates, configName);
}
