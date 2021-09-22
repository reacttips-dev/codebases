import { action } from 'satcheljs/lib/legacy';
import addRecipientsToRecipientWell from 'owa-recipient-common/lib/actions/addRecipientsToRecipientWell';
import isRecipientWellWithFindControlViewState from '../../utils/isRecipientWellWithFindControlViewState';
import type {
    default as FindControlViewState,
    FindResultType,
} from 'owa-recipient-types/lib/types/FindControlViewState';
import type RecipientWellWithFindControlViewState from 'owa-recipient-types/lib/types/RecipientWellWithFindControlViewState';
import { getReadWriteRecipientViewStateFromFindRecipientPersonaType } from 'owa-recipient-create-viewstate/lib/util/getReadWriteRecipientViewStateFromFindRecipientPersonaType';

export default action('postProcessSuggestionsResult')(function postProcessSuggestionsResult(
    recipientWell: FindControlViewState | RecipientWellWithFindControlViewState,
    resultType: FindResultType,
    numberOfCacheResults: number,
    resolveIfSingle?: boolean
) {
    if (
        recipientWell.findResultSet.length == 1 &&
        resolveIfSingle &&
        isRecipientWellWithFindControlViewState(recipientWell)
    ) {
        // Autoresolve if there's only a single result
        addRecipientsToRecipientWell(
            recipientWell.findResultSet.map(
                getReadWriteRecipientViewStateFromFindRecipientPersonaType
            ),
            recipientWell
        );
    } else {
        recipientWell.findResultType = resultType;
        recipientWell.numberOfCacheResults = numberOfCacheResults;
    }
});
