import getStore from '../store/store';

export default function getSpotlightLogicalId(): string {
    return getStore().logicalId;
}
