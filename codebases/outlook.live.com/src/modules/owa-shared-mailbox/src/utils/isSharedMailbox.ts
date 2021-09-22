import { getStore } from '../store/store';

export default function isSharedMailbox(): boolean {
    return getStore().isSharedMailbox;
}
