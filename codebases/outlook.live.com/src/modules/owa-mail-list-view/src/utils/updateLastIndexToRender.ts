import { action } from 'satcheljs';
import type { TableView } from 'owa-mail-list-store';

export default action('updateLastIndexToRender', (rowKeys: string[], tableView: TableView) => ({
    rowKeys,
    tableView,
}));
