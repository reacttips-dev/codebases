import getStore from '../store';

export default function getIsImmutableIdFeatureOnForConnectedAccount() {
    return getStore().IsImmutableIdFeatureOnForConnectedAccount;
}
