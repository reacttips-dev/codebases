import getStore from '../store';

export default function removeUserMailboxInfo(mailboxId: string) {
    const userMailboxInfoMap = getStore().userMailboxInfoMap;
    if (userMailboxInfoMap) {
        userMailboxInfoMap.delete(mailboxId);
    }
}
