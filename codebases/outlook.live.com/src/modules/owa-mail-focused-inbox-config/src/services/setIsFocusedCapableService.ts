import type SetFocusedInboxConfigurationRequest from 'owa-service/lib/contract/SetFocusedInboxConfigurationRequest';
import type SetFocusedInboxConfigurationResponse from 'owa-service/lib/contract/SetFocusedInboxConfigurationResponse';
import setFocusedInboxConfigurationOperation from 'owa-service/lib/operation/setFocusedInboxConfigurationOperation';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';

/**
 * Sets IsFocusedInboxCapable flag on server to indicate enable mailbox for focused inbox
 * @return the SetFocusedInboxConfigurationResponse
 */
export function setIsFocusedInboxCapableService(): Promise<SetFocusedInboxConfigurationResponse> {
    const request: SetFocusedInboxConfigurationRequest = {
        Header: getJsonRequestHeader(),
        IsFocusedInboxCapable: true,
    };

    return setFocusedInboxConfigurationOperation({
        request: request,
    }).then(response => {
        return response;
    });
}
