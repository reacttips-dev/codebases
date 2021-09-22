import type { TableView } from 'owa-mail-list-store';
import { action } from 'satcheljs';

export default action('ROW_UPDATED', (rowKey: string, tableView: TableView) => ({
    rowKey,
    tableView,
}));
