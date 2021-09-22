import { MailListFilterMenu } from 'owa-mail-list-filter-view';
import type { TableView } from 'owa-mail-list-store';
import type { SearchTableQuery } from 'owa-mail-list-search';
import loc from 'owa-localize';
import {
    searchResults,
    searchResultsFromArchive,
} from 'owa-locstrings/lib/strings/searchresults.locstring.json';
import MailListHeaderSecondRowTextContent from './MailListHeaderSecondRowTextContent';
import SearchFiltersContainer from 'owa-mail-search/lib/components/SearchFiltersContainer';
import { SearchScopeKind } from 'owa-search-service/lib/data/schema/SearchScope';
import * as React from 'react';
import type ViewFilter from 'owa-service/lib/contract/ViewFilter';
import { observer } from 'mobx-react-lite';
import SelectAllCheckbox from '../SelectAllCheckbox';
import { SearchHeaderFirstRowContent } from 'owa-mail-search';

import styles from './MailPersonaSearchResultsHeader.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface MailPersonaSearchResultsHeaderProps {
    tableView: TableView | undefined;
    hideCheckAll: boolean;
    hideFilter: boolean;
    styleSelectorAsPerUserSettings: string;
    showInteractiveFilters: boolean;
}

export default observer(function MailPersonaSearchResultsHeader(
    props: MailPersonaSearchResultsHeaderProps
): JSX.Element {
    const viewFiltersForMailFolderNode: ViewFilter[] = [
        'All',
        'Unread',
        'ToOrCcMe',
        'Flagged',
        'Mentioned',
        'HasAttachment',
    ];

    const { tableView, hideCheckAll, hideFilter, styleSelectorAsPerUserSettings } = props;
    const searchScope = (tableView?.tableQuery as SearchTableQuery).searchScope;
    const searchResultHeaderText =
        searchScope?.kind == SearchScopeKind.ArchiveMailbox
            ? loc(searchResultsFromArchive)
            : loc(searchResults);

    return (
        <>
            {props.showInteractiveFilters && (
                <SearchHeaderFirstRowContent
                    className={null}
                    showModifiedQueryInformation={false}
                />
            )}
            <div className={classNames(styles.secondRowContainer, styleSelectorAsPerUserSettings)}>
                {!hideCheckAll && (
                    <SelectAllCheckbox tableViewId={tableView.id} isInboxWithPivots={false} />
                )}
                <MailListHeaderSecondRowTextContent
                    text={searchResultHeaderText}
                    containerCssClass={styles.resultsText}
                />
                {props.showInteractiveFilters && <SearchFiltersContainer />}
                {!hideFilter && (
                    <div className={styles.filterWrapper}>
                        <MailListFilterMenu
                            supportedViewFilters={viewFiltersForMailFolderNode}
                            containerClassName={styles.mailFilterContainer}
                            filterMenuSource={'PeopleFilterMenu'}
                            tableViewId={tableView.id}
                        />
                    </div>
                )}
            </div>
        </>
    );
});
