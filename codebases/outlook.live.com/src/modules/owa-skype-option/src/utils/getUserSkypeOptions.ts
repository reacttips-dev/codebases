import getSwcOptions from '../data/store/swcStore';
import {
    getOptionsForFeature,
    SkypeNotificationOptions,
    OwsOptionsFeatureType,
} from 'owa-outlook-service-options';
import { isFeatureEnabled } from 'owa-feature-flags';

export default function getUserSkypeOption(): SkypeNotificationOptions {
    return isFeatureEnabled('fwk-skypeConsumer')
        ? getSwcOptions()
        : getOptionsForFeature<SkypeNotificationOptions>(OwsOptionsFeatureType.SkypeNotifications);
}
