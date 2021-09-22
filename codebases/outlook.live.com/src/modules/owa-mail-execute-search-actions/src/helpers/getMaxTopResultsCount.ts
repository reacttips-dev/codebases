import { isSingleLineListView } from 'owa-mail-layout';

export function getMaxTopResultsCount(): number {
    // Show more top results when list view is in single line
    return isSingleLineListView() ? 5 : 3;
}
