import { observer } from 'mobx-react-lite';
import { getDateRange } from '../../datapoints';
import { getStore } from '../../store/store';
import { DefaultButton, PrimaryButton, IButton } from '@fluentui/react/lib/Button';
import { logUsage } from 'owa-analytics';
import { getAggregationBucket } from 'owa-analytics-actions';
import KeyboardCharCodes from 'owa-hotkeys/lib/utils/keyboardCharCodes';
import loc from 'owa-localize';
import { clearFiltersButtonText } from 'owa-locstrings/lib/strings/clearfiltersbuttontext.locstring.json';
import { SearchPlaceholder } from 'owa-locstrings/lib/strings/searchplaceholder.locstring.json';
import { SearchScenarioId } from 'owa-search-store';
import * as React from 'react';
import {
    onAdvancedSearchSearchButtonClicked,
    onClearFiltersButtonClicked,
} from '../../actions/internalActions';

import styles from './AdvancedSearch.scss';

export interface ActionButtonsProps {
    onFocusChange: (isFowardNavigation: boolean) => void;
}

export interface ActionButtonsHandle {
    focusElement(): void;
}

export default observer(
    function ActionButtons(props: ActionButtonsProps, ref: React.Ref<ActionButtonsHandle>) {
        const clearFiltersButton = React.useRef<IButton>();
        React.useImperativeHandle(
            ref,
            () => ({
                focusElement() {
                    clearFiltersButton.current.focus();
                },
            }),
            []
        );
        const onKeyDown = (evt: React.KeyboardEvent<unknown>) => {
            if (!evt.shiftKey && evt.keyCode === KeyboardCharCodes.Tab) {
                evt.preventDefault();
                evt.stopPropagation();
                props.onFocusChange(true);
            }
        };
        return (
            <div className={styles.actionButtonContainer}>
                <PrimaryButton
                    className={styles.actionButton}
                    styles={{ root: { marginRight: '8px' } }}
                    text={loc(SearchPlaceholder)}
                    onClick={onSearchButtonClicked}
                />
                <DefaultButton
                    className={styles.actionButton}
                    text={loc(clearFiltersButtonText)}
                    onClick={onClearFiltersClicked}
                    onKeyDown={onKeyDown}
                    componentRef={clearFiltersButton}
                />
            </div>
        );
    },
    { forwardRef: true }
);

function onSearchButtonClicked() {
    const {
        fromPeopleSuggestions,
        toPeopleSuggestions,
        subjectFieldText,
        keywordsFieldText,
        hasAttachments,
        fromDate,
        toDate,
    } = getStore().advancedSearchViewState;
    // Log click on "Search" button, and include form values.
    logUsage('Search_AdvancedSearchSearchButtonClicked', [
        getAggregationBucket({ value: fromPeopleSuggestions.length }),
        getAggregationBucket({ value: toPeopleSuggestions.length }),
        getAggregationBucket({ value: subjectFieldText.length }),
        getAggregationBucket({ value: keywordsFieldText.length }),
        getDateRange(fromDate, toDate),
        hasAttachments,
        SearchScenarioId.Mail,
    ]);
    onAdvancedSearchSearchButtonClicked();
}

function onClearFiltersClicked() {
    // Log click on "Clear filters" button.
    logUsage('Search_AdvancedSearchClearFiltersButtonClicked', [SearchScenarioId.Mail]);
    onClearFiltersButtonClicked();
}
