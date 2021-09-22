import { shouldShowFolderPane } from 'owa-mail-layout';
import { isFeatureEnabled } from 'owa-feature-flags';
import { shouldShowFolderPaneAsOverlay } from 'owa-mail-layout/lib/selectors/shouldShowFolderPaneAsOverlay';

export default function shouldShowCommandBarHamburgerButton(): boolean {
    return (
        !isFeatureEnabled('mon-tri-collapsibleFolderPane') &&
        (isFeatureEnabled('mon-densities') ||
            (isFeatureEnabled('tri-officeRail') &&
                (!shouldShowFolderPane() ||
                    (shouldShowFolderPane() && shouldShowFolderPaneAsOverlay()))))
    );
}
