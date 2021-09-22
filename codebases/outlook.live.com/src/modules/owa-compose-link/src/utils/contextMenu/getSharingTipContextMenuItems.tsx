import { SharingTipContextMenuItem } from '../../components/SharingTipContextMenuItem';
import type ComposeLinkViewState from '../../store/schema/ComposeLinkViewState';
import type { IContextualMenuItem } from '@fluentui/react/lib/ContextualMenu';
import { logUsage } from 'owa-analytics';
import { getSharingDataFromLink, getSharingLinkInfo, SharingLinkInfo } from 'owa-link-data';
import { lazyGetSharingIssuesForSharingData, SharingTipRecipientInfo } from 'owa-sharing-data';
import * as React from 'react';

export function getSharingTipContextMenuItems(
    composeLinkViewState: ComposeLinkViewState,
    recipientInfos: SharingTipRecipientInfo[],
    composeId: string,
    isCalendar: boolean
): IContextualMenuItem[] | null {
    const getSharingIssuesForSharingData = lazyGetSharingIssuesForSharingData.tryImportForRender();

    if (!getSharingIssuesForSharingData) {
        return null;
    }

    const sharingData = getSharingDataFromLink(composeLinkViewState.linkId);
    const sharingIssues = getSharingIssuesForSharingData(sharingData, recipientInfos);

    // Only show the menu item if there is a sharing tip that the user has not chosen to ignore
    if (sharingIssues.length > 0) {
        if (sharingIssues.length > 1) {
            logUsage('AttachmentLinkMultipleSharingTipsShown');
        }
        const contextMenuItems: IContextualMenuItem[] = [];

        sharingIssues.map(sharingIssue => {
            const sharingLinkInfo: SharingLinkInfo = getSharingLinkInfo(
                composeLinkViewState.linkId
            );

            contextMenuItems.push({
                key: 'contextualSharingTip',
                onRender: (
                    item: any,
                    dismissMenu: (ev?: any, dismissAll?: boolean) => void
                ): React.ReactNode => {
                    return (
                        // The SharingTipContextMenuItem must be its own component, as it is dynamic and needs an
                        // observer in order to show status updates
                        <SharingTipContextMenuItem
                            sharingIssue={sharingIssue}
                            sharingLinkInfo={sharingLinkInfo}
                            composeId={composeId}
                            recipientInfos={recipientInfos}
                            isCalendar={isCalendar}
                        />
                    );
                },
            });
        });
        return contextMenuItems;
    }

    return null;
}
