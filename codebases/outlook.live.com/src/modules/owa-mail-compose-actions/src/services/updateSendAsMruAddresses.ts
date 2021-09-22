import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { lazyUpdateUserConfigurationService } from 'owa-session-store/lib/lazyFunctions';

export default function updateSendAsMruAddresses() {
    lazyUpdateUserConfigurationService.importAndExecute([
        {
            key: 'SendAsMruAddresses',
            valuetype: 'StringArray',
            value: getUserConfiguration().UserOptions.SendAsMruAddresses as string[],
        },
    ]);
}
