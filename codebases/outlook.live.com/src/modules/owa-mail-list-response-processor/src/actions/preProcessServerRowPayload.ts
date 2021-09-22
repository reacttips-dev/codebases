import shouldSkipProcessRow from './helpers/shouldSkipProcessRow';
import syncClientTombstonedPropertiesToServerRow from '../internal/syncClientTombstonedPropertiesToServerRow';
import type { MailListRowDataType, TableView } from 'owa-mail-list-store';

/**
 * Pre-processor determines whether the server row payload should be consumed and
 * if client properties need to be synced when client receives payload as a part of add or update notification
 * @param serverRow row payload from server
 * @param tableView to which the row belongs
 * @returns a flag indicating whether the row should be processed further or not
 */
export default function preProcessServerRowPayload(
    serverRow: MailListRowDataType,
    tableView: TableView
): boolean {
    if (shouldSkipProcessRow(serverRow, tableView)) {
        return false;
    }

    // Else sync the properties before further processing server row payload
    syncClientTombstonedPropertiesToServerRow(serverRow, tableView);
    return true;
}
