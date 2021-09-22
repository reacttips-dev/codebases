import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { UserAccountType } from '../schema/Enumeration';
import WebSessionType from 'owa-service/lib/contract/WebSessionType';
import { assertNever } from 'owa-assert';
import { isPremiumConsumer } from 'owa-session-store';

export function getUserAccountType(): UserAccountType {
    const userWebSessionType = getUserConfiguration()?.SessionSettings?.WebSessionType;

    switch (userWebSessionType) {
        case WebSessionType.Business:
            return UserAccountType.PaidCommercialOutlook;
        case WebSessionType.ExoConsumer:
            return isPremiumConsumer()
                ? UserAccountType.PaidConsumerOutlook
                : UserAccountType.FreeConsumerOutlook;
        case WebSessionType.GMail:
            return UserAccountType.GmailCloudCache;
        default:
            return assertNever(userWebSessionType);
    }
}
