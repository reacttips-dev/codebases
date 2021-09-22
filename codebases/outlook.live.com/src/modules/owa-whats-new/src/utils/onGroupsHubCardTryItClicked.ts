import { getHostLocation } from 'owa-url/lib/hostLocation';
import { getGroupsHubPath, getGroupsHubDeletedSectionPath } from 'owa-url';
import { logUsage } from 'owa-analytics';

export function onGroupsHubCardTryItClicked(isGroupsHubPendingMembershipCard: boolean): void {
    let action;
    const queryParam = getHostLocation().search;
    const sourceParam = 'source=whatsnew';
    if (isGroupsHubPendingMembershipCard) {
        action = getGroupsHubPath(true) + queryParam;
        logUsage('whatsNewGroupsHubPendingMembershipCardClicked');
    } else {
        action = getGroupsHubDeletedSectionPath() + queryParam;
        logUsage('whatsNewGroupsHubRestoreCardClicked');
    }
    action += (queryParam ? '&' : '?') + sourceParam;
    window.open(action.toString(), '_blank');
}
