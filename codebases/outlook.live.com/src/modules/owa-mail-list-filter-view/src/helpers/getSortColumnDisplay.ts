import {
    dateSortColumn,
    fromSortColumn,
    sizeSortColumn,
    importanceSortColumn,
} from './getSortColumnDisplay.locstring.json';
import { SubjectColumnHeaderText } from 'owa-locstrings/lib/strings/subjectcolumnheadertext.locstring.json';
import loc from 'owa-localize';
import { SortColumn } from 'owa-mail-list-store';

/**
 * Gets the display name for the sort column
 * @param sortColumn sort column
 * @return the string to be showin in UI for the given sort column
 */
export default function getSortColumnDisplay(sortColumn: SortColumn): string {
    switch (sortColumn) {
        case SortColumn.Date:
            return loc(dateSortColumn);
        case SortColumn.From:
            return loc(fromSortColumn);
        case SortColumn.Size:
            return loc(sizeSortColumn);
        case SortColumn.Importance:
            return loc(importanceSortColumn);
        case SortColumn.Subject:
            return loc(SubjectColumnHeaderText);
        default:
            throw new Error('Sort not implemented');
    }
}
