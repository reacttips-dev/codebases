import ExtensionEventType from 'owa-service/lib/contract/ExtensionEventType';
import isExtensibilityContextInitialized from 'owa-addins-store/lib/store/isExtensibilityContextInitialized';
import isExtensibilityContextAvailable from 'owa-addins-store/lib/store/isExtensibilityContextAvailable';
import getExtensionEventByType from 'owa-addins-store/lib/utils/getExtensionEventByType';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

export default function shouldForceOnSendCompliantBehavior(): boolean {
    const context = isExtensibilityContextAvailable();
    const isInitialized = isExtensibilityContextInitialized();
    const policyEnabled = getUserConfiguration().SegmentationSettings.OnSendAddinsEnabled;

    if (context && isInitialized) {
        return policyEnabled && getExtensionEventByType(ExtensionEventType.ItemSend).length > 0;
    } else {
        // ExtensibilityContext failed to load or is still loading force anyway
        return policyEnabled;
    }
}
