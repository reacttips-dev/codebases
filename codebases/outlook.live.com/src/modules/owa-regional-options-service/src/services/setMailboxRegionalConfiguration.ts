import type SetMailboxRegionalConfigurationResponse from 'owa-service/lib/contract/SetMailboxRegionalConfigurationResponse';
import setMailboxRegionalConfigurationOperation from 'owa-service/lib/operation/setMailboxRegionalConfigurationOperation';
import setMailboxRegionalConfigurationData from 'owa-service/lib/factory/setMailboxRegionalConfigurationData';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';

export default function setMailboxRegionalConfiguration(
    locale: string,
    renameDefaultFolders: boolean,
    dateFormat: string,
    timeFormat: string,
    timeZone: string
): Promise<SetMailboxRegionalConfigurationResponse> {
    return setMailboxRegionalConfigurationOperation({
        Header: getJsonRequestHeader(),
        Options: setMailboxRegionalConfigurationData({
            Language: locale,
            LocalizeDefaultFolderName: renameDefaultFolders,
            DateFormat: dateFormat,
            TimeFormat: timeFormat,
            TimeZone: timeZone,
        }),
        SkipUserCultureCookies: false,
    });
}
