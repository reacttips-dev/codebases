import { areDisplayAdsEnabled } from './adsUtilities';
import { getNativeAdEnabledOrNotFromUserProperties } from 'owa-mail-ads-shared';

export default function areAdsEnabled() {
    return areDisplayAdsEnabled() || getNativeAdEnabledOrNotFromUserProperties();
}
