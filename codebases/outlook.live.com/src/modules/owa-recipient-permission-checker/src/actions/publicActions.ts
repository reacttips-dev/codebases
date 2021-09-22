import type { RecipientContainer } from 'owa-link-data';
import type { SharingTipRecipientInfo } from 'owa-sharing-data';
import { action } from 'satcheljs';

export const tryCheckPermForLinks = action(
    'TRY_CHECK_PERM_FOR_LINKS',
    (
        linkIds: string[],
        recipientInfos: SharingTipRecipientInfo[],
        composeId: string,
        isCalendar: boolean
    ) => ({
        linkIds: linkIds,
        recipientInfos: recipientInfos,
        composeId: composeId,
        isCalendar: isCalendar,
    })
);

export const expandGroupsAndSmallDLs = action(
    'EXPAND_GROUPS_AND_SMALL_DLS',
    (
        linkIds: string[],
        recipientInfos: SharingTipRecipientInfo[],
        composeId: string,
        isCalendar: boolean
    ) => ({
        linkIds: linkIds,
        recipientInfos: recipientInfos,
        composeId: composeId,
        isCalendar: isCalendar,
    })
);

export const tryCheckPermForOneLink = action(
    'TRY_CHECK_PERM_FOR_ONE_LINK',
    (
        linkId: string,
        recipientContainers: RecipientContainer[],
        fromAddress: string,
        composeId: string,
        isCalendar: boolean
    ) => ({
        linkId: linkId,
        recipientContainers: recipientContainers,
        fromAddress: fromAddress,
        composeId: composeId,
        isCalendar: isCalendar,
    })
);

export const composeGetHasSharingIssues = action(
    'COMPOSE_GET_HAS_SHARING_ISSUES',
    (composeId: string) => ({
        composeId: composeId,
    })
);

export const onRemoveLink = action('ON_REMOVE_LINK', (composeId: string) => ({
    composeId: composeId,
}));
