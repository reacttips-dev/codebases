import getStore from '../store/store';

export default function getNumberOfSharingLinks(): number {
    const store = getStore();
    return store.sharingLinks.size;
}
