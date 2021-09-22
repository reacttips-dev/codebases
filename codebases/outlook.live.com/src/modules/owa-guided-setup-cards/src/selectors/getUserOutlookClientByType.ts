import type { UserOutlookClient } from '../store/schema/UserOutlookClients';
import { userOutlookClientsStore } from '../store/store';

export function getUserOutlookClientByType(clientType: string): UserOutlookClient {
    return userOutlookClientsStore().clients.filter(client => client.clientType === clientType)[0];
}
