import { mutatorAction } from 'satcheljs';
import { userOutlookClientsStore } from '../store/store';
import type { UserOutlookClients } from '../store/schema/UserOutlookClients';

export let setUserOutlookClientsState = mutatorAction(
    'setUserOutlookClientsState',
    (UserOutlookClients: UserOutlookClients) => {
        let store = userOutlookClientsStore();
        store.clients = UserOutlookClients;
    }
);
