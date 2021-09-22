import type { UserOutlookClients } from '../store/schema/UserOutlookClients';
import { userOutlookClientsStore } from '../store/store';

export function getUserOutlookClientsState(): UserOutlookClients {
    return userOutlookClientsStore().clients;
}
