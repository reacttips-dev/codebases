'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import isNumber from 'transmute/isNumber';
import { useCrmSearchQuery } from '../../crmSearch/hooks/useCrmSearchQuery';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import get from 'transmute/get';
import { useTableQueryCache } from '../../table/hooks/useTableQueryCache';

var TableObjectCount = function TableObjectCount() {
  var objectTypeId = useSelectedObjectTypeId();
  var query = {
    sorts: [],
    query: '',
    offset: 0,
    count: 0,
    filterGroups: [],
    objectTypeId: objectTypeId
  }; // don't poll for updates; use the same 'total' count until the user closes
  // and re-opens the filter panel

  var _useCrmSearchQuery = useCrmSearchQuery(query),
      totalData = _useCrmSearchQuery.data;

  var totalCount = get('total', totalData);

  var _useTableQueryCache = useTableQueryCache(),
      viewData = _useTableQueryCache.data;

  var viewCount = get('total', viewData);
  var totalObjectCount = isNumber(totalCount) ? totalCount : '--';
  var viewObjectCount = isNumber(viewCount) ? viewCount : '--';
  return /*#__PURE__*/_jsx(FormattedMessage, {
    message: "indexPage.objectCount.textRecords",
    options: {
      totalObjectCount: totalObjectCount,
      count: viewObjectCount
    }
  });
};

export default TableObjectCount;