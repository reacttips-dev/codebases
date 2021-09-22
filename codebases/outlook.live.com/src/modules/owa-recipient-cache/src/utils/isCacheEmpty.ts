import rcStore from '../store/store';

export default function isCacheEmpty(): boolean {
    return rcStore.recipientCache === null || rcStore.recipientCache.length == 0;
}
