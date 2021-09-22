import { observer } from 'mobx-react-lite';
import { options_inboxRules_includesWords } from 'owa-locstrings/lib/strings/options_inboxrules_includeswords.locstring.json';
import { SubjectColumnHeaderText } from 'owa-locstrings/lib/strings/subjectcolumnheadertext.locstring.json';
import loc from 'owa-localize';
import ActionButtons, { ActionButtonsHandle } from './ActionButtons';
import AttachmentsCheckbox from './AttachmentsCheckbox';
import DateFilters from './DateFilters';
import FoldersDropdown, { FoldersDropdownHandle } from './FoldersDropdown';
import FormTextField from './FormTextField';
import PeoplePickers from './PeoplePickers';
import { ADVANCED_SEARCH_BREAKPOINT, FILTERS_BUTTON_ID } from '../../searchConstants';
import { getStore } from '../../store/store';
import { getSearchBoxWidth, SearchBoxDropdown } from 'owa-search';
import { SearchScenarioId } from 'owa-search-store';

import * as React from 'react';
import {
    onAdvancedSearchMounted,
    onSubjectFieldChanged,
    onKeywordsFieldChanged,
    onHasAttachmentsCheckboxChanged,
    onDismissAdvanceSearchUi,
    onAdvancedSearchUiDismissed,
} from '../../actions/internalActions';
import { elementContains } from '@fluentui/react/lib/Utilities';

import styles from './AdvancedSearch.scss';

export interface AdvancedSearchProps {
    showAttachmentRefiner: boolean;
}

export default observer(function AdvancedSearch(props: AdvancedSearchProps) {
    React.useEffect(() => {
        onAdvancedSearchMounted();
        return () => {
            onAdvancedSearchUiDismissed();
        };
    }, []);
    const foldersDropdown = React.useRef<FoldersDropdownHandle>();
    const actionButtons = React.useRef<ActionButtonsHandle>();
    const onFocusChange = (isForwardNavigation: boolean) => {
        if (isForwardNavigation) {
            foldersDropdown.current.focusElement();
        } else {
            actionButtons.current.focusElement();
        }
    };
    const renderAdvancedSearchContent = (): JSX.Element => {
        const {
            hasAttachments,
            keywordsFieldText,
            subjectFieldText,
        } = getStore().advancedSearchViewState;
        const useLeftLabel = getSearchBoxWidth(SearchScenarioId.Mail) >= ADVANCED_SEARCH_BREAKPOINT;
        return (
            <div className={styles.form}>
                <FoldersDropdown
                    useLeftLabel={useLeftLabel}
                    ref={foldersDropdown}
                    onFocusChange={onFocusChange}
                />
                <PeoplePickers useLeftLabel={useLeftLabel} />
                <FormTextField
                    onChange={onSubjectFieldChange}
                    label={loc(SubjectColumnHeaderText)}
                    value={subjectFieldText}
                    useLeftLabel={useLeftLabel}
                />
                <FormTextField
                    onChange={onKeywordsFieldChange}
                    label={loc(options_inboxRules_includesWords)}
                    value={keywordsFieldText}
                    useLeftLabel={useLeftLabel}
                />
                <DateFilters useLeftLabel={useLeftLabel} />
                {props.showAttachmentRefiner && (
                    <AttachmentsCheckbox
                        useLeftLabel={useLeftLabel}
                        value={hasAttachments}
                        onChange={onAttachmentsCheckboxChanged}
                    />
                )}
                <ActionButtons ref={actionButtons} onFocusChange={onFocusChange} />
            </div>
        );
    };
    const onDismiss = (evt?: any): void => {
        /**
         * The click handler on the Filters button handles visiblity, so ignore
         * any events regarding that button.
         *
         * NOTE: evt.target.innerHTML can be undefined when the event is on
         * the window itself, so ensure that it exists.
         */
        if (
            evt.target.id !== FILTERS_BUTTON_ID &&
            !elementContains(document.getElementById(FILTERS_BUTTON_ID), evt.target) &&
            typeof evt.target.innerHTML === 'string' &&
            evt.target.innerHTML.indexOf(FILTERS_BUTTON_ID) === -1
        ) {
            onDismissAdvanceSearchUi();
        }
    };
    const onSubjectFieldChange = (event: any, value: string): void => {
        onSubjectFieldChanged(value);
    };
    const onKeywordsFieldChange = (event: any, value: string): void => {
        onKeywordsFieldChanged(value);
    };
    const onAttachmentsCheckboxChanged = (event: any, value: boolean): void => {
        onHasAttachmentsCheckboxChanged(value);
    };
    return (
        <SearchBoxDropdown
            content={renderAdvancedSearchContent()}
            onDismiss={onDismiss}
            scenarioId={SearchScenarioId.Mail}
            setInitialFocus={true}
        />
    );
});
