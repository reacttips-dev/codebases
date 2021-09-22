import { groupsLeftNav_DropNotAllowedSubtitle } from './dropMailListRowsOnGroup.locstring.json';
import { groupsLeftNav_MoveFailedTitlePlural } from '../strings.locstring.json';
import loc, { format } from 'owa-localize';
import { confirm } from 'owa-confirm-dialog';

import { MAX_NUM_MESSAGES_DROPPED_IN_GROUP } from 'owa-group-left-nav/lib/utils/constants';
import type { MailListRowDragData } from 'owa-mail-types/lib/types/MailListRowDragData';
import moveMailListRowsToGroup from './moveMailListRowsToGroup';

// Drop either MailListRow or MultiMailListMessageRows type on a group
export default function dropMailListRowsOnGroup(
    mailListRowDragData: MailListRowDragData,
    groupId: string
) {
    /* Block drop action if > 100 messages */
    mailListRowDragData.rowKeys.length > MAX_NUM_MESSAGES_DROPPED_IN_GROUP
        ? confirm(
              loc(groupsLeftNav_MoveFailedTitlePlural),
              format(loc(groupsLeftNav_DropNotAllowedSubtitle), MAX_NUM_MESSAGES_DROPPED_IN_GROUP),
              false,
              {
                  hideCancelButton: true,
              }
          )
        : moveMailListRowsToGroup(mailListRowDragData, groupId);
}
