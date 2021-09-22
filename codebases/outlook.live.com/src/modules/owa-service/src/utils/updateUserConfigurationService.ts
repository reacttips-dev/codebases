import type {
    UpdateUserConfigurationEntry,
    UserOptionsUpdateConfigName,
} from '../types/UpdateUserConfigurationEntry';
import userConfigurationDictionaryObject from '../factory/userConfigurationDictionaryObject';
import userConfigurationDictionaryEntry from '../factory/userConfigurationDictionaryEntry';
import updateUserConfigurationJsonRequest from '../factory/updateUserConfigurationJsonRequest';
import updateUserConfigurationOperation from '../operation/updateUserConfigurationOperation';
import updateUserConfigurationOwaRequest from '../factory/updateUserConfigurationOwaRequest';
import userConfigurationNameType from '../factory/userConfigurationNameType';
import { getJsonRequestHeader } from '../ServiceRequestUtils';
import serviceUserConfiguration from '../factory/serviceUserConfiguration';
import distinguishedFolderId from '../factory/distinguishedFolderId';
import type RequestOptions from '../RequestOptions';

export function updateUserConfigurationService<
    TConfig extends UserOptionsUpdateConfigName = 'OWA.UserOptions'
>(
    updates: UpdateUserConfigurationEntry<TConfig>[],
    configNames?: TConfig,
    requestOptions?: RequestOptions
) {
    return updateUserConfigurationOperation(
        updateUserConfigurationJsonRequest({
            Header: getJsonRequestHeader(),
            Body: updateUserConfigurationOwaRequest({
                UserConfiguration: serviceUserConfiguration({
                    UserConfigurationName: userConfigurationNameType({
                        BaseFolderId: distinguishedFolderId({
                            Id: 'root',
                        }),
                        Name: (configNames as string) || 'OWA.UserOptions',
                    }),
                    Dictionary: updates.map(update =>
                        userConfigurationDictionaryEntry({
                            DictionaryKey: userConfigurationDictionaryObject({
                                Type: update.keytype || 'String',
                                Value: [update.key],
                            }),
                            DictionaryValue: userConfigurationDictionaryObject({
                                Type: update.valuetype,
                                Value: update.value as string[],
                            }),
                        })
                    ),
                }),
            }),
        }),
        requestOptions
    );
}
