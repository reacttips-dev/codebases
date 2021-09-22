import { getUserConfiguration, isPremiumConsumer } from 'owa-session-store';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';

let userType: string | null = null;

export default function getUserType(isEdu: boolean): string {
    if (!userType) {
        if (isConsumer()) {
            var userConfiguration = getUserConfiguration();
            if (userConfiguration?.IsConsumerChild) {
                userType = 'c_child';
            } else if (isPremiumConsumer()) {
                userType = 'c_premium';
            } else if (userConfiguration?.SessionSettings?.IsShadowMailbox) {
                userType = 'c_shadow';
            } else {
                userType = 'c_standard';
            }
        } else {
            userType = isEdu ? 'b_edu' : 'b_standard';
        }
    }

    return userType;
}
