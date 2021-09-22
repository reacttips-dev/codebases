import { isFeatureEnabled } from 'owa-feature-flags';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import { YammerCopyOfMessageScenario } from '../store/schema/YammerCopyOfMessageScenario';
import { YammerDailyDigestScenario } from '../store/schema/YammerDailyDigestScenario';
import { YammerDirectFollowerScenario } from '../store/schema/YammerDirectFollowerScenario';
import { YammerDiscoveryScenario } from '../store/schema/YammerDiscoveryScenario';
import { YammerMandatoryAnnouncementScenario } from '../store/schema/YammerMandatoryAnnouncementScenario';
import type YammerScenario from '../store/schema/YammerScenario';

const YAMMER_EXTENSIBLE_CONTENT_SCENARIO_REGEX = new RegExp('p=y;s=([a-z]+);');

export default function getYammerScenario(
    extensibleContentData: string,
    yammerNotificationData?: string
): YammerScenario {
    let yammerScenario = null;

    if (extensibleContentData) {
        const yammerScenarioMatch = extensibleContentData.match(
            YAMMER_EXTENSIBLE_CONTENT_SCENARIO_REGEX
        );

        if (yammerScenarioMatch?.length == 2) {
            switch (yammerScenarioMatch[1]) {
                case 'com':
                    yammerScenario = new YammerCopyOfMessageScenario(
                        extensibleContentData,
                        yammerNotificationData
                    );
                    break;
                case 'dd':
                    // For Outlook Desktop Opx, the feature rollout will be controlled on the host so we won't check for the flight here
                    if (
                        isFeatureEnabled('rp-yammer-dailyDigest') ||
                        isHostAppFeatureEnabled('yammerDailyDigest')
                    ) {
                        yammerScenario = new YammerDailyDigestScenario(extensibleContentData);
                    }
                    break;
                case 'df':
                    // For Outlook Desktop Opx, the feature rollout will be controlled on the host so we won't check for the flight here
                    if (
                        isFeatureEnabled('rp-yammer-discovery') ||
                        isHostAppFeatureEnabled('yammerDiscovery')
                    ) {
                        yammerScenario = new YammerDiscoveryScenario(extensibleContentData);
                    }
                    break;
                case 'dfm':
                    if (
                        isFeatureEnabled('rp-yammer-directFollower') ||
                        isHostAppFeatureEnabled('yammerDirectFollower')
                    ) {
                        yammerScenario = new YammerDirectFollowerScenario(
                            extensibleContentData,
                            yammerNotificationData
                        );
                    }
                    break;
                case 'ma':
                    yammerScenario = new YammerMandatoryAnnouncementScenario(
                        extensibleContentData,
                        yammerNotificationData
                    );
                    break;
            }
        }
    }

    if (!yammerScenario?.isValid() && yammerNotificationData) {
        yammerScenario = new YammerCopyOfMessageScenario(null, yammerNotificationData);
    }

    return yammerScenario?.isValid() ? yammerScenario : null;
}
