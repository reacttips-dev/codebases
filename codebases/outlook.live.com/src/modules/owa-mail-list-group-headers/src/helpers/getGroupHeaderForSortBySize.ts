import {
    sizeTinyHeader,
    sizeSmallHeader,
    sizeMediumHeader,
    sizeLargeHeader,
    sizeVeryLargeHeader,
    sizeHugeHeader,
    sizeEnormousHeader,
} from './getGroupHeaderForSortBySize.locstring.json';
import loc from 'owa-localize';
import { GroupHeader, SizeHeaderId } from 'owa-mail-group-headers';
import { TableView, MailRowDataPropertyGetter } from 'owa-mail-list-store';
import { trace } from 'owa-trace';
import { logUsage } from 'owa-analytics';

const sizeGroupHeaders: SizeGroupHeader[] = [];

export interface SizeGroupHeader extends GroupHeader {
    greaterThanSize: number;
}

export function initializeSizeGroupHeaders() {
    sizeGroupHeaders.push({
        headerId: SizeHeaderId.Tiny,
        headerText: () => loc(sizeTinyHeader),
        greaterThanSize: 0, // There should not exist a row with size 0
    });

    sizeGroupHeaders.push({
        headerId: SizeHeaderId.Small,
        headerText: () => loc(sizeSmallHeader),
        greaterThanSize: 1024 * 10,
    });

    sizeGroupHeaders.push({
        headerId: SizeHeaderId.Medium,
        headerText: () => loc(sizeMediumHeader),
        greaterThanSize: 1024 * 25,
    });

    sizeGroupHeaders.push({
        headerId: SizeHeaderId.Large,
        headerText: () => loc(sizeLargeHeader),
        greaterThanSize: 1024 * 100,
    });

    sizeGroupHeaders.push({
        headerId: SizeHeaderId.VeryLarge,
        headerText: () => loc(sizeVeryLargeHeader),
        greaterThanSize: 1024 * 500,
    });

    sizeGroupHeaders.push({
        headerId: SizeHeaderId.Huge,
        headerText: () => loc(sizeHugeHeader),
        greaterThanSize: 1024 * 1024,
    });

    sizeGroupHeaders.push({
        headerId: SizeHeaderId.Enormous,
        headerText: () => loc(sizeEnormousHeader),
        greaterThanSize: 1024 * 1024 * 5,
    });
}

/**
 * Get GroupHeader for row
 * @param rowKey rowKey for which we want to lookup time group range
 * @param tableView tableView
 * @return group header
 */
export default function getGroupHeaderForSortBySize(
    rowKey: string,
    tableView: TableView
): GroupHeader {
    if (sizeGroupHeaders.length == 0) {
        initializeSizeGroupHeaders();
    }

    const rowSize = MailRowDataPropertyGetter.getSize(rowKey, tableView);
    for (let i = sizeGroupHeaders.length - 1; i >= 0; i--) {
        if (rowSize > sizeGroupHeaders[i].greaterThanSize) {
            return sizeGroupHeaders[i];
        }
    }

    const errorString = 'getGroupHeaderForSortBySizeMissingSize';
    logUsage(errorString);
    trace.warn(errorString);
    return {
        headerText: sizeGroupHeaders[0].headerText,
        headerId: sizeGroupHeaders[0].headerId,
    };
}
