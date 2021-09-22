import styles from '../components/MailListItem.scss';
import type MailListItemDataProps from '../utils/types/MailListItemDataProps';
import type MailListTableProps from '../utils/types/MailListTableProps';
import shouldShowUnstackedReadingPane from 'owa-mail-store/lib/utils/shouldShowUnstackedReadingPane';

export default function getBackgroundColorClass(
    itemProps: MailListItemDataProps,
    tableProps: MailListTableProps,
    isChecked: boolean,
    isRowExpanded?: boolean
) {
    if (itemProps.isSelected || isChecked) {
        const showOnlySubject = shouldShowUnstackedReadingPane() && isRowExpanded;
        if (showOnlySubject) {
            if (tableProps.supportsFlagging && itemProps.isFlagged) {
                // This color will eventually be replaced by a lighter shade of yellow to match win32
                return styles.flaggedMailListItemColor;
            }
            return styles.expandedMailListItemColor;
        }
        return styles.selectedMailListItemColor;
    } else if (tableProps.supportsFlagging && itemProps.isFlagged) {
        return styles.flaggedMailListItemColor;
    } else if (tableProps.supportsPinning && itemProps.isPinned) {
        return styles.pinnedMailListItemColor;
    } else {
        return styles.regularMailListItemColor;
    }
}
