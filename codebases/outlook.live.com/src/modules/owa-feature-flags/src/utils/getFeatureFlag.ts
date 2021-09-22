import getStore from '../store/Store';

export default function getFeatureFlag(featureName: string) {
    return getStore().featureFlags.get(featureName);
}
