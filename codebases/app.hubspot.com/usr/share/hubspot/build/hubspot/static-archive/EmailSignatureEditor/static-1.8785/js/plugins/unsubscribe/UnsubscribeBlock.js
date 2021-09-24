'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { ContentBlock } from 'draft-js';
import UnsubscribeEdit from './UnsubscribeEdit';

var UnsubscribeBlock = function UnsubscribeBlock(_ref, _ref2) {
  var block = _ref.block;
  var onUnsubscribeChange = _ref2.onUnsubscribeChange;
  return /*#__PURE__*/_jsx(UnsubscribeEdit, {
    unsubscribeData: block.getData(),
    onConfirm: onUnsubscribeChange
  });
};

UnsubscribeBlock.propTypes = {
  block: PropTypes.instanceOf(ContentBlock).isRequired
};
UnsubscribeBlock.contextTypes = {
  onUnsubscribeChange: PropTypes.func
};
export default UnsubscribeBlock;