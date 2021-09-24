'use es6';

import { compose } from 'draft-extend';
import { onInsertToken } from 'SalesTemplateEditor/tracking/TrackingInterface';
import MergeTagGroupPlugin from 'draft-plugins/plugins/mergeTags/MergeTagGroupPlugin';
import PaintSelectionOnBlur from 'draft-plugins/plugins/PaintSelectionOnBlur';
import SubjectBlock from '../SubjectBlock';
import arrowKeysOnly from '../arrowKeysOnly';
import DisableImmutableEntityInput from '../DisableImmutableEntityInput';
import noStyles from '../noStyles';
import { hasTicketAccess } from 'SalesTemplateEditor/lib/permissions';
export default (function () {
  return compose(PaintSelectionOnBlur(SubjectBlock, arrowKeysOnly, MergeTagGroupPlugin({
    includeTicketTokens: hasTicketAccess(),
    includeCustomTokens: true,
    onInsertToken: onInsertToken
  }), DisableImmutableEntityInput(), noStyles));
});