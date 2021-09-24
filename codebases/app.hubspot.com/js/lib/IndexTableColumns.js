'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import { OrderedSet } from 'immutable';
import * as SearchFields from 'SalesContentIndexUI/data/constants/SearchFields';
import TableColumnRecord from 'SalesContentIndexUI/data/records/TableColumnRecord';
var NameColumn = TableColumnRecord({
  id: 'name',
  name: /*#__PURE__*/_jsx(FormattedMessage, {
    message: "index.sequenceTable.columns.name"
  }),
  searchField: SearchFields.NAME_FIELD
});
var TotalEnrolledColumn = TableColumnRecord({
  id: 'totalEnrolled',
  name: /*#__PURE__*/_jsx(FormattedMessage, {
    message: "index.sequenceTable.columns.totalEnrolled"
  }),
  width: 100
});
var ReplyRateColumn = TableColumnRecord({
  id: 'replyRate',
  name: /*#__PURE__*/_jsx(FormattedMessage, {
    message: "index.sequenceTable.columns.replyRate"
  }),
  width: 100
});
var MeetingRateColumn = TableColumnRecord({
  id: 'meetingRate',
  name: /*#__PURE__*/_jsx(FormattedMessage, {
    message: "index.sequenceTable.columns.meetingRate"
  }),
  width: 100
});
var OwnerColumn = TableColumnRecord({
  id: 'owner',
  name: /*#__PURE__*/_jsx(FormattedMessage, {
    message: "index.sequenceTable.columns.owner"
  }),
  searchField: SearchFields.USER_ID_FIELD,
  width: 160
});
var UpdatedAtColumn = TableColumnRecord({
  id: 'updatedAt',
  name: /*#__PURE__*/_jsx(FormattedMessage, {
    message: "index.sequenceTable.columns.dateModified"
  }),
  searchField: SearchFields.UPDATED_AT_FIELD,
  width: 160
});
export default OrderedSet([NameColumn, TotalEnrolledColumn, ReplyRateColumn, MeetingRateColumn, OwnerColumn, UpdatedAtColumn]);