import { isFeatureEnabled } from 'owa-feature-flags';
import { ComposeTarget } from 'owa-mail-compose-store';
import isSxSDisplayed from 'owa-sxs-store/lib/utils/isSxSDisplayed';
import { getActiveSxSId } from 'owa-sxs-store';
import { isDeepLink } from 'owa-url';

export default function getComposeTarget(targetWindow?: Window): ComposeTarget {
    const sxsId = getActiveSxSId(targetWindow);
    const openInSxS = isSxSDisplayed(sxsId);
    const openInTab = !isDeepLink();
    if (openInSxS) {
        return ComposeTarget.SxS;
    } else if (
        isFeatureEnabled('mail-popout-projection') &&
        !!targetWindow &&
        targetWindow != window
    ) {
        return ComposeTarget.ExistingProjection;
    } else if (openInTab) {
        return ComposeTarget.SecondaryTab;
    }

    return ComposeTarget.PrimaryReadingPane;
}
