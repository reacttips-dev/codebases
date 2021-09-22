import { getReadWriteRecipientViewStateFromFindRecipientPersonaType } from 'owa-recipient-create-viewstate/lib/util/getReadWriteRecipientViewStateFromFindRecipientPersonaType';
import type FindRecipientPersonaType from 'owa-recipient-types/lib/types/FindRecipientPersonaType';
import processGetGroupInfoResult from 'owa-readwrite-recipient-well/lib/actions/processGetGroupInfoResult';
import type ReadWriteRecipientViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';
import updateIsExpanding from '../actions/updateIsExpanding';
import { getGroupInfo } from 'owa-readwrite-recipient-well/lib/services/getGroupInfo';
import shouldExpandGroup from 'owa-recipient-common/lib/utils/shouldExpandGroup';
import { logUsage } from 'owa-analytics';
import { getAggregationBucket } from 'owa-analytics-actions';

export default async function expandGroup(
    recipientToExpand: ReadWriteRecipientViewState
): Promise<ReadWriteRecipientViewState[]> {
    updateIsExpanding(recipientToExpand, true);

    let personaId = recipientToExpand.persona.PersonaId;
    if (!personaId) {
        // GetGroupInfo requires to provide Id. Try to extract PersonaId if it was provided
        // as EmailAddress property value.
        let id = (<any>recipientToExpand.persona.EmailAddress)?.PersonaId?.Id;
        // If that fails, try again
        if (!id) {
            id = recipientToExpand.persona.Id;
        }
        personaId = {
            Id: id,
        };
    }

    let groupResponse = await getGroupInfo(
        personaId,
        recipientToExpand.persona.ADObjectId,
        recipientToExpand.persona.EmailAddress
    );

    updateIsExpanding(recipientToExpand, false);
    const membersCount = groupResponse?.MembersCount ? groupResponse.MembersCount : 0;
    let expandedEmails: FindRecipientPersonaType[] = [];
    const shouldExpand = await shouldExpandGroup(membersCount);

    if (shouldExpand) {
        processGetGroupInfoResult(expandedEmails, groupResponse);
    }

    // Log that group recipient has been expanded
    logUsage('RWRecipientGroupExpand', {
        size: getAggregationBucket({
            value: membersCount,
            exactMatches: [],
            buckets: [25, 50, 75, 100, 125, 150, 175, 200],
        }),
        shouldExpand,
    });

    return expandedEmails.map(getReadWriteRecipientViewStateFromFindRecipientPersonaType);
}
