import getStore from '../store/store';

export default function getSpotlightCount(): number {
    return getStore().spotlightItems.length;
}
