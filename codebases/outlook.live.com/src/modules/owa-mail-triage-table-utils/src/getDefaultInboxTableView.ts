import type TableView from 'owa-mail-list-store/lib/store/schema/TableView';
import { getTableViewFromTableQuery } from './index';
import { getDefaultInboxTableQuery } from './getDefaultInboxTableQueries';

export function getDefaultInboxTableView(): TableView {
    const defaultTableQuery = getDefaultInboxTableQuery();
    return getTableViewFromTableQuery(defaultTableQuery);
}
