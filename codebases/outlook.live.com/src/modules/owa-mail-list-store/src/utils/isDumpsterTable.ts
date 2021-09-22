import type { TableQuery } from '../index';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import {
    PRIMARY_DUMPSTER_DISTINGUISHED_ID,
    ARCHIVE_DUMPSTER_DISTINGUISHED_ID,
} from 'owa-folders-constants';

/**
 * Returns a flag indicating whether the table is the dumpster table
 * @param tableQuery - the table query
 * @return whether the table is the dumpster table
 */
export default function isDumpsterTable(tableQuery: TableQuery | undefined): boolean {
    return (
        !!tableQuery &&
        (tableQuery.folderId === folderNameToId(ARCHIVE_DUMPSTER_DISTINGUISHED_ID) ||
            tableQuery.folderId === folderNameToId(PRIMARY_DUMPSTER_DISTINGUISHED_ID))
    );
}
