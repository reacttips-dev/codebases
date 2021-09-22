import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import { isPremiumConsumer } from 'owa-session-store';

/**
 * The encryption feature is enabled when
 * 1. You're a premium consumer user (get the ProtectMessage version)
 * 2. You're an enterprise user with SegmentationSettings.Irm = true
 */
export default function isEncryptionEnabled() {
    return isConsumer() ? isPremiumConsumer() : getUserConfiguration().SegmentationSettings?.Irm;
}
