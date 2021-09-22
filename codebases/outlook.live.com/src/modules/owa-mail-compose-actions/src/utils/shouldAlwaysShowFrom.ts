import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { isConsumer } from 'owa-session-store';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';

export default function shouldAlwaysShowFrom(): boolean {
    const userOptions = getUserConfiguration().UserOptions;
    const sessionSettings = getUserConfiguration().SessionSettings;
    return (
        userOptions.AlwaysShowFrom ||
        (isConsumer() &&
            (isLengthGreaterThan(sessionSettings.ConnectedAccountInfos, 0) ||
                isLengthGreaterThan(sessionSettings.NotManagedEmailAddresses, 0) ||
                isLengthGreaterThan(sessionSettings.UserProxyAddresses, 1))) ||
        isHostAppFeatureEnabled('composeFrom')
    );
}

function isLengthGreaterThan<T>(arr: readonly T[], minCount: number) {
    return arr && arr.length > minCount;
}
