import loc, { isStringNullOrWhiteSpace } from 'owa-localize';
import { lazyOpenFeedbackDialog } from 'owa-readwrite-recipient-well-internal-feedback';
import SuggestionsHeaderFooterInfo from '../components/SuggestionsHeaderFooterInfo';
import shouldShowHeaderFooterItem from '../utils/shouldShowHeaderFooterItem';
import type { ITheme } from '@fluentui/style-utilities';
import { findRecipientInfo_SearchDirectory } from 'owa-locstrings/lib/strings/findrecipientinfo_searchdirectory.locstring.json';
import { findRecipientInfo_SearchPeople } from 'owa-locstrings/lib/strings/findrecipientinfo_searchpeople.locstring.json';
import { peopleSuggestions_AvailableAlert } from 'owa-locstrings/lib/strings/findrecipientinfo_suggestionsavailable.locstring.json';
import { peopleFeedbackSubmitSearchFeedback } from 'owa-readwrite-recipient-well-internal-feedback/lib/components/FeedbackFooter.locstring.json';
import findReadWriteRecipient from 'owa-readwrite-recipient-well/lib/actions/findReadWriteRecipient';
import { FindRecipientInfoType } from 'owa-recipient-common-components/lib/components/FindRecipientInfo';
import type FindControlViewState from 'owa-recipient-types/lib/types/FindControlViewState';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';

import type {
    FloatingPeoplePicker,
    IBaseFloatingPickerSuggestionProps,
    ISuggestionsHeaderFooterProps,
} from '@fluentui/react/lib/FloatingPicker';

import styles from '../components/MaskRecipientButton.scss';

export default function getSuggestionProps(
    getViewState: () => FindControlViewState,
    getFindControl: () => FloatingPeoplePicker,
    controlledComponent: boolean,
    theme?: ITheme,
    scenario?: string
): IBaseFloatingPickerSuggestionProps {
    // className isn't explicitly exposed on the whitelisted props passed to the
    // Suggestion by the ExtendedPicker.
    //
    // Sneaking this property on won't be necessary once Suggestions is moved to a
    // renderprops + inversion of control design
    const extraProps = {
        className: styles.containsCustomMaskRecipientButton,
        suggestionsAvailableAlertText: loc(peopleSuggestions_AvailableAlert),
    } as {};
    return {
        ...extraProps,
        showRemoveButtons: true,
        headerItemsProps: getHeaderItemProps(getViewState, getFindControl, theme),
        footerItemsProps: getFooterItemProps(
            getViewState,
            getFindControl,
            controlledComponent,
            theme,
            scenario
        ),
        shouldSelectFirstItem: () => {
            return (
                !isStringNullOrWhiteSpace(getViewState().queryString) &&
                getViewState().findResultSet.length > 0
            );
        },
    };
}

function getHeaderItemProps(
    getViewState: () => FindControlViewState,
    getFindControl: () => FloatingPeoplePicker,
    theme?: ITheme
): ISuggestionsHeaderFooterProps[] {
    return [
        {
            renderItem: renderInfo(getViewState(), FindRecipientInfoType.TypeToSearch, theme),
            shouldShow: shouldShowHeaderFooterItem(
                FindRecipientInfoType.TypeToSearch,
                getViewState()
            ),
        },
        {
            renderItem: renderInfo(getViewState(), FindRecipientInfoType.SuggestedContacts, theme),
            shouldShow: shouldShowHeaderFooterItem(
                FindRecipientInfoType.SuggestedContacts,
                getViewState()
            ),
        },
        {
            renderItem: renderInfo(getViewState(), FindRecipientInfoType.UseAddress, theme),
            shouldShow: shouldShowHeaderFooterItem(
                FindRecipientInfoType.UseAddress,
                getViewState()
            ),
            onExecute: () => {
                if (getFindControl()) {
                    getFindControl().forceResolveSuggestion();
                }
            },
        },
    ];
}

function getFooterItemProps(
    getViewState: () => FindControlViewState,
    getFindControl: () => FloatingPeoplePicker,
    controlledComponent: boolean,
    theme?: ITheme,
    scenario?: string
): ISuggestionsHeaderFooterProps[] {
    return [
        {
            renderItem: renderInfo(getViewState(), FindRecipientInfoType.Searching, theme),
            shouldShow: shouldShowHeaderFooterItem(FindRecipientInfoType.Searching, getViewState()),
        },
        {
            renderItem: renderInfo(getViewState(), FindRecipientInfoType.SearchDirectory, theme),
            shouldShow: shouldShowHeaderFooterItem(
                FindRecipientInfoType.SearchDirectory,
                getViewState()
            ),
            onExecute: () => {
                findReadWriteRecipient(
                    getViewState(),
                    getViewState().queryString,
                    true /* searchDirectory */,
                    null /* resolveIfSingle */,
                    null /* recipientsToExclude */,
                    null /* recipientsToPrioritize */,
                    null /* searchCacheFirstOverride */,
                    scenario
                ).then(() => {
                    !controlledComponent &&
                        getFindControl().updateSuggestions(
                            getViewState().findResultSet.slice(),
                            true /*forceUpdate*/
                        );
                });
            },
            ariaLabel: isConsumer()
                ? loc(findRecipientInfo_SearchPeople)
                : loc(findRecipientInfo_SearchDirectory),
        },
        {
            renderItem: renderInfo(getViewState(), FindRecipientInfoType.TopNResults, theme),
            shouldShow: shouldShowHeaderFooterItem(
                FindRecipientInfoType.TopNResults,
                getViewState()
            ),
        },
        {
            renderItem: renderInfo(getViewState(), FindRecipientInfoType.FindPeopleFeedback, theme),
            shouldShow: () => {
                return (
                    controlledComponent &&
                    shouldShowHeaderFooterItem(
                        FindRecipientInfoType.FindPeopleFeedback,
                        getViewState()
                    )()
                );
            },
            onExecute: () => {
                const getPeopleFeedbackStateCallback = () => {
                    return getViewState().peopleFeedbackState;
                };
                lazyOpenFeedbackDialog.import().then(openFeedbackDialog => {
                    openFeedbackDialog(getPeopleFeedbackStateCallback);
                });
            },
            ariaLabel: loc(peopleFeedbackSubmitSearchFeedback),
        },
    ];
}

function renderInfo(
    viewState: FindControlViewState,
    infoType: FindRecipientInfoType,
    theme?: ITheme
): () => JSX.Element {
    return function (): JSX.Element {
        return SuggestionsHeaderFooterInfo({
            queryString: viewState.queryString,
            numberOfResults: viewState.findResultSet.length,
            infoType: infoType,
            theme: theme,
        });
    };
}
