import { getItem, setItem } from 'owa-local-storage';

const ClientIdKey = 'OwaClientId';

let clientId: string | null = null;
export default function getClientId() {
    if (!clientId) {
        // try to get the client id from the cookie
        // eslint-disable-next-line @microsoft/sdl/no-cookies
        const clientIdStart = document?.cookie && document.cookie.split('ClientId=')[1];
        let newClientId = clientIdStart && clientIdStart.split(';')[0];
        if (newClientId) {
            clientId = newClientId;
            setItem(window, ClientIdKey, newClientId);
        } else {
            // Try to get it from local storage if we don't have it in the cookie
            clientId = getItem(window, ClientIdKey);
        }
    }
    return clientId;
}
