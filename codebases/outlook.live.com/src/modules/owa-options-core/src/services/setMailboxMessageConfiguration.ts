import type MailboxMessageConfigurationOptions from 'owa-service/lib/contract/MailboxMessageConfigurationOptions';
import type OptionsResponseBase from 'owa-service/lib/contract/OptionsResponseBase';
import mailboxMessageConfigurationOptions from 'owa-service/lib/factory/mailboxMessageConfigurationOptions';
import setMailboxMessageConfigurationRequest from 'owa-service/lib/factory/setMailboxMessageConfigurationRequest';
import setMailboxMessageConfigurationOperation from 'owa-service/lib/operation/setMailboxMessageConfigurationOperation';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';

export default function setMailboxMessageConfiguration(
    newOptions: MailboxMessageConfigurationOptions
): Promise<OptionsResponseBase> {
    return setMailboxMessageConfigurationOperation(
        setMailboxMessageConfigurationRequest({
            Header: getJsonRequestHeader(),
            Options: mailboxMessageConfigurationOptions(newOptions),
        })
    );
}
