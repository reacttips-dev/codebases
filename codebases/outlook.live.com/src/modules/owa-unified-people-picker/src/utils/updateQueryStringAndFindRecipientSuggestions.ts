import updateQueryString from 'owa-readwrite-recipient-well-fabric/lib/actions/updateQueryString';
import findReadWriteRecipient from 'owa-readwrite-recipient-well/lib/actions/findReadWriteRecipient';
import { lazyGetZeroQueryResults } from 'owa-readwrite-recipient-zeroquery';
import type RecipientWellWithFindControlViewState from 'owa-recipient-types/lib/types/RecipientWellWithFindControlViewState';

const updateQueryStringAndFindRecipientSuggestions = async (
    viewState: RecipientWellWithFindControlViewState,
    filterText: string,
    scenario: string | undefined,
    additionalRecipientEmailAddresses?: string[]
): Promise<void> => {
    updateQueryString(viewState, filterText);

    if (viewState.queryString === '') {
        lazyGetZeroQueryResults.import().then(getZeroQueryResults => {
            getZeroQueryResults(
                viewState,
                viewState.recipients,
                scenario,
                additionalRecipientEmailAddresses
            );
        });
    } else if (viewState.queryString === filterText) {
        await findReadWriteRecipient(
            viewState,
            filterText,
            false /*searchDirectory*/,
            null /*resolveIfSingle*/,
            null /*recipientsToExclude*/,
            null /*recipientsToPrioritize*/,
            null /*searchCacheFirstOverride*/,
            scenario
        );
    }
};

export default updateQueryStringAndFindRecipientSuggestions;
