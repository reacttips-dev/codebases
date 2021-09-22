import store from '../store/store';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'removeUserConfiguration',
    function removeUserConfiguration(mailboxId: string) {
        if (store.connectedAccountsUserConfigurationMap) {
            store.connectedAccountsUserConfigurationMap.delete(mailboxId);
        }
    }
);
