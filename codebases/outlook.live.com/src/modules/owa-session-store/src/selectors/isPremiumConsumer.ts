import { getUserConfiguration } from '../index';
import { isFeatureEnabled } from 'owa-feature-flags';

const PREMIUM_CONSUMER_OPTION = 'PremiumConsumerSetting';

export default function isPremiumConsumer(): boolean {
    if (getUserConfiguration()?.SessionSettings?.IsPremiumConsumerMailbox) {
        return true;
    }
    if (isFeatureEnabled('auth-PremiumCheckUpdates')) {
        const primeSettingsItems = getUserConfiguration()?.PrimeSettings?.Items;
        const primePremiumConsumerSetting: any = primeSettingsItems?.filter(
            item => item?.Id === PREMIUM_CONSUMER_OPTION
        );
        return primePremiumConsumerSetting?.[0]?.Value ?? false;
    }
    return false;
}
