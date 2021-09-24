'use es6';

import { connect } from 'react-redux';
import { OUTLOOK } from 'sales-modal/constants/Platform';
export default connect(function (_ref) {
  var salesModalInterface = _ref.salesModalInterface;
  var target = '_blank';

  if (!salesModalInterface || !salesModalInterface.platform) {
    return {
      target: target
    };
  }

  var shouldTargetSelf = salesModalInterface.platform === OUTLOOK;

  if (shouldTargetSelf) {
    target = '_self';
  }

  return {
    target: target
  };
}, function () {
  return {};
});