'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { memo } from 'react';
import PropTypes from 'prop-types';
import RecordPropType from 'conversations-prop-types/prop-types/RecordPropType';
import UITruncateString from 'UIComponents/text/UITruncateString';
import { calleeName } from 'calling-lifecycle-internal/callees/utils/calleeName';
import SectionLabel from '../../active-call-settings/components/SectionLabel';
import styled from 'styled-components';
var CalleeNameLabel = styled(SectionLabel).withConfig({
  displayName: "CalleeName__CalleeNameLabel",
  componentId: "sc-2iiaz1-0"
})(["width:100%;overflow:hidden;text-overflow:ellipsis;"]);

function CalleeName(_ref) {
  var className = _ref.className,
      calleeObject = _ref.calleeObject;
  return /*#__PURE__*/_jsx(UITruncateString, {
    className: className,
    children: /*#__PURE__*/_jsx(CalleeNameLabel, {
      children: calleeName(calleeObject)
    })
  });
}

CalleeName.propTypes = {
  className: PropTypes.string,
  calleeObject: RecordPropType('CallableObject')
};
export default /*#__PURE__*/memo(CalleeName);