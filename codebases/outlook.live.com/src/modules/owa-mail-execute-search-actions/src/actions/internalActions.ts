import { action } from 'satcheljs';
import type { TableView } from 'owa-mail-list-store';
import type {
    OnInitialTableLoadComplete,
    OnLoadInitialRowsSucceeded,
} from 'owa-mail-loading-action-types';

/**
 * Action which triggers the find item search
 */
export const findItemSearch = action(
    'FIND_ITEM_SEARCH',
    (
        offset: number,
        tableView: TableView,
        actionSource: string,
        onLoadInitialRowsSucceeded: OnLoadInitialRowsSucceeded,
        onInitialTableLoadComplete: OnInitialTableLoadComplete
    ) => ({
        offset,
        tableView,
        actionSource,
        onLoadInitialRowsSucceeded,
        onInitialTableLoadComplete,
    })
);

/**
 * Action to set highlight terms in tableView
 */
export const setHighlightTerms = action('SET_HIGHLIGHT_TERMS', (highlightTerms: string[]) => ({
    highlightTerms,
}));

/**
 * Action to set isAnswerRendered in search store
 */
export const setIsAnswerRendered = action('SET_IS_ANSWER_RENDERED', (value: boolean) => ({
    value,
}));

/**
 * Action to set tableViewId in search store
 */
export const setTableViewId = action('SET_TABLE_VIEW_ID', (tableViewId: string) => ({
    tableViewId,
}));

/**
 * Action to set answerPlaceholderId in search store
 */
export const setAnswerPlaceholderId = action(
    'SET_ANSWER_PLACEHOLDER_ID',
    (placeholderId: string) => ({
        placeholderId,
    })
);
