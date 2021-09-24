'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import isNumber from 'transmute/isNumber';
import { useViewObjectCount } from '../../table/hooks/useViewObjectCount';

var CompactObjectCount = function CompactObjectCount() {
  var viewObjectCount = useViewObjectCount();
  var viewObjectCountTotal = isNumber(viewObjectCount) ? viewObjectCount : '--';
  return /*#__PURE__*/_jsx(FormattedMessage, {
    message: "indexPage.objectCount.compactTextRecords",
    options: {
      count: viewObjectCountTotal
    }
  });
};

export default CompactObjectCount;