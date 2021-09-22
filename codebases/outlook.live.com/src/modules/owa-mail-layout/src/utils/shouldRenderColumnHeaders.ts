import { isFeatureEnabled } from 'owa-feature-flags';
import { getMailListLoadStateFromTableView } from 'owa-mail-list-store/lib/utils/getMailListLoadState';
import { isSingleLineListView } from '../selectors/listViewLayout';
import { listViewStore, TableQueryType } from 'owa-mail-list-store';
import { MailListViewState } from 'owa-mail-store/lib/store/schema/MailListViewState';

export function shouldRenderColumnHeaders(tableViewId: string) {
    const tableView = listViewStore.tableViews.get(tableViewId);

    return (
        isFeatureEnabled('mon-tri-columnHeadersSlv') &&
        isSingleLineListView() &&
        getMailListLoadStateFromTableView(tableView) === MailListViewState.Loaded &&
        tableView?.tableQuery.type !== TableQueryType.Search
    );
}
