'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import { OrderedSet } from 'immutable';
import * as SearchFields from 'SalesContentIndexUI/data/constants/SearchFields';
import TableColumnRecord from 'SalesContentIndexUI/data/records/TableColumnRecord';
var NameColumn = TableColumnRecord({
  id: 'name',
  name: /*#__PURE__*/_jsx(FormattedMessage, {
    message: "selectTable.columnNames.name"
  }),
  searchField: SearchFields.NAME_FIELD
});
var CreatedByColumn = TableColumnRecord({
  id: 'createdBy',
  name: /*#__PURE__*/_jsx(FormattedMessage, {
    message: "selectTable.columnNames.createdBy"
  }),
  searchField: SearchFields.USER_ID_FIELD,
  width: 160
});
var LastUsedAtColumn = TableColumnRecord({
  id: 'lastUsedAt',
  name: /*#__PURE__*/_jsx(FormattedMessage, {
    message: "selectTable.columnNames.lastUsedAt"
  }),
  searchField: SearchFields.LAST_USED_AT_FIELD,
  width: 160
});
var LastModifiedColumn = TableColumnRecord({
  id: 'lastModified',
  name: /*#__PURE__*/_jsx(FormattedMessage, {
    message: "selectTable.columnNames.lastModified"
  }),
  searchField: SearchFields.UPDATED_AT_FIELD,
  width: 160
});
export default OrderedSet([NameColumn, CreatedByColumn, LastUsedAtColumn, LastModifiedColumn]);