import createGenericItem from './createGenericItem';
import { getRecipientAriaLabel } from './getRecipientAriaLabel';
import updateQueryString from '../actions/updateQueryString';
import FindResultRecipient from '../components/FindResultRecipient';
import getSuggestionProps from '../utils/getSuggestionProps';
import type { ITheme } from '@fluentui/style-utilities';
import { logUsage } from 'owa-analytics';
import pauseSession from 'owa-controls-findpeople-feedback-manager/lib/actions/pauseSession';
import resumeSession from 'owa-controls-findpeople-feedback-manager/lib/actions/resumeSession';
import findReadWriteRecipient from 'owa-readwrite-recipient-well/lib/actions/findReadWriteRecipient';
import maskRecipientFromFindControl from 'owa-readwrite-recipient-well/lib/actions/maskRecipientFromFindControl';
import { lazyGetZeroQueryResults } from 'owa-readwrite-recipient-zeroquery';
import isValidAddressWithOptionalDisplayName from 'owa-recipient-email-address/lib/utils/isValidAddressWithOptionalDisplayName';
import type FindControlViewState from 'owa-recipient-types/lib/types/FindControlViewState';
import type FindRecipientPersonaType from 'owa-recipient-types/lib/types/FindRecipientPersonaType';
import type ReadWriteRecipientViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';
import {
    FloatingPeoplePicker,
    IPeopleFloatingPickerProps,
    SuggestionsStore,
} from '@fluentui/react/lib/FloatingPicker';

export default function getFloatingPickerProps(
    getViewState: () => FindControlViewState,
    getFindControl: () => FloatingPeoplePicker,
    controlledComponent: boolean,
    theme?: ITheme,
    onPickerHidden?: () => void,
    scenario?: string,
    getAdditionalRecipientEmailAddresses?: () => string[] | undefined
): IPeopleFloatingPickerProps {
    return {
        suggestionsStore: new SuggestionsStore<FindRecipientPersonaType>({
            getAriaLabel: getRecipientAriaLabel,
        }),
        onValidateInput: isValidAddressWithOptionalDisplayName,
        onRenderSuggestionsItem: onRenderSuggestion(theme),
        createGenericItem: createGenericItem,
        onResolveSuggestions: controlledComponent
            ? getQuerySuggestions(getViewState(), scenario)
            : getQuerySuggestionsSynchronous(getViewState(), scenario),
        onZeroQuerySuggestion: controlledComponent
            ? getZeroQuerySuggestions(
                  getViewState(),
                  scenario,
                  getAdditionalRecipientEmailAddresses
              )
            : getZeroQuerySuggestionsSynchronous(
                  getViewState(),
                  scenario,
                  getAdditionalRecipientEmailAddresses
              ),
        calloutWidth: 300,
        resolveDelay: 150,
        onRemoveSuggestion: onMaskRecipient(getFindControl, getViewState, controlledComponent),
        getTextFromItem: (item: FindRecipientPersonaType) => {
            return item.EmailAddress.Name;
        },
        pickerSuggestionsProps: getSuggestionProps(
            getViewState,
            getFindControl,
            controlledComponent,
            theme,
            scenario
        ),
        onSuggestionsShown: onSuggestionsShown(getViewState()),
        onSuggestionsHidden: onSuggestionsHidden(getViewState(), onPickerHidden),
    };
}

function onMaskRecipient(
    getFindControl: () => FloatingPeoplePicker,
    getViewState: () => FindControlViewState,
    controlledComponent: boolean
): (recipientToMask: FindRecipientPersonaType) => void {
    return function (recipientToMask: FindRecipientPersonaType): void {
        logUsage('RWFindPeopleMasking');
        const viewState = getViewState();
        maskRecipientFromFindControl(viewState, recipientToMask);

        if (!controlledComponent) {
            getFindControl().updateSuggestions(viewState.findResultSet.slice(), true /*updateUI*/);
        }
    };
}

function onRenderSuggestion(
    theme: ITheme
): (props: FindRecipientPersonaType, itemProps: any) => JSX.Element {
    return function (props: FindRecipientPersonaType, itemProps: any): JSX.Element {
        return FindResultRecipient({
            itemProps: itemProps,
            persona: props,
            theme: theme,
        });
    };
}

/* This won't be needed after vso: 35556 */ function getQuerySuggestionsSynchronous(
    viewState: FindControlViewState,
    scenario: string
): (
    filterText: string,
    recipients: ReadWriteRecipientViewState[]
) => Promise<FindRecipientPersonaType[]> {
    return async function (filterText: string, recipients: ReadWriteRecipientViewState[]) {
        if (viewState.queryString === filterText) {
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
            return viewState.findResultSet.slice();
        }

        return null;
    };
}

function getQuerySuggestions(
    viewState: FindControlViewState,
    scenario: string
): (filterText: string, recipients: ReadWriteRecipientViewState[]) => FindRecipientPersonaType[] {
    return function (filterText: string, recipients: ReadWriteRecipientViewState[]) {
        if (viewState.queryString === filterText) {
            findReadWriteRecipient(
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
        return null;
    };
}

/* This won't be needed after vso: 35556 */ function getZeroQuerySuggestionsSynchronous(
    viewState: FindControlViewState,
    scenario: string,
    getAdditionalRecipientEmailAddresses?: () => string[] | undefined
): (recipients: ReadWriteRecipientViewState[]) => Promise<FindRecipientPersonaType[]> {
    return async function (recipients: ReadWriteRecipientViewState[]) {
        updateQueryString(viewState, '');
        const getZeroQueryResults = await lazyGetZeroQueryResults.import();
        await getZeroQueryResults(
            viewState,
            recipients,
            scenario,
            getAdditionalRecipientEmailAddresses?.()
        );
        return viewState.findResultSet.slice();
    };
}

function getZeroQuerySuggestions(
    viewState: FindControlViewState,
    scenario: string,
    getAdditionalRecipientEmailAddresses?: () => string[] | undefined
): (recipients: ReadWriteRecipientViewState[]) => FindRecipientPersonaType[] {
    return function (recipients: ReadWriteRecipientViewState[]) {
        updateQueryString(viewState, '');
        lazyGetZeroQueryResults.import().then(getZeroQueryResults => {
            getZeroQueryResults(
                viewState,
                recipients,
                scenario,
                getAdditionalRecipientEmailAddresses?.()
            );
        });
        return null;
    };
}

function onSuggestionsShown(viewState: FindControlViewState): () => void {
    return function () {
        resumeSession(viewState.findPeopleFeedbackManager);
    };
}

function onSuggestionsHidden(
    viewState: FindControlViewState,
    onPickerHidden?: () => void
): () => void {
    return function () {
        onPickerHidden?.();
        pauseSession(viewState.findPeopleFeedbackManager);
    };
}
