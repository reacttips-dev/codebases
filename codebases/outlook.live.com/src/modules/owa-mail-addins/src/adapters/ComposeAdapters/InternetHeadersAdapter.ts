import removeInternetHeaders from 'owa-addins-editor-plugin/lib/actions/removeInternetHeaders';
import setIsDirty from 'owa-mail-compose-actions/lib/actions/setIsDirty';
import setInternetHeaders from 'owa-addins-editor-plugin/lib/actions/setInternetHeaders';
import { ComposeViewState, ComposeOperation } from 'owa-mail-compose-store';
import type { InternetHeaders } from 'owa-addins-core';
import { updateViewStateWithAnyMissingHeaders } from '../../utils/InternetHeaderUtils';

export const setInternetHeadersAdapter = (viewState: ComposeViewState) => (
    dictionary: InternetHeaders
) => {
    setInternetHeaders(viewState.addin, dictionary);
    setIsDirty(viewState);
};

export const removeInternetHeadersAdapter = (viewState: ComposeViewState) => async (
    headerNames: string[]
) => {
    if (viewState.operation === ComposeOperation.EditDraft) {
        await updateViewStateWithAnyMissingHeaders(viewState, headerNames);
    }
    removeInternetHeaders(viewState.addin, headerNames);
    setIsDirty(viewState);
};

export const getComposeInternetHeaders = (viewState: ComposeViewState) => async (
    headerNames: string[]
): Promise<InternetHeaders> => {
    if (viewState.operation === ComposeOperation.EditDraft) {
        await updateViewStateWithAnyMissingHeaders(viewState, headerNames);
    }

    return [...viewState.addin.internetHeaders.keys()]
        .filter(key => headerNames.includes(key))
        .reduce((dictionary, key) => {
            dictionary[key] = viewState.addin.internetHeaders.get(key);
            return dictionary;
        }, {});
};
