import store from '../store/store';

export default function (emailAddress: string): boolean {
    if (emailAddress && store.trustedSendersAndDomains) {
        return (
            store.trustedSendersAndDomains.indexOf(emailAddress) != -1 ||
            store.trustedSendersAndDomains.indexOf(emailAddress.split('@')[1]) != -1
        );
    } else {
        return false;
    }
}
