import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { isFeatureEnabled } from 'owa-feature-flags';

export default function isSendAsAliasEnabled(): boolean {
    return (
        getUserConfiguration().UserOptions?.SendFromAliasEnabled &&
        isFeatureEnabled('cmp-proxy-address')
    );
}
