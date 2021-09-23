'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UILink from 'UIComponents/link/UILink';
import UIBackButton from 'UIComponents/nav/UIBackButton';

var SequenceEnrollBreadcrumbs = function SequenceEnrollBreadcrumbs(_ref) {
  var goBackToSequences = _ref.goBackToSequences,
      isWithinSalesModal = _ref.isWithinSalesModal;

  if (!isWithinSalesModal) {
    return null;
  }

  return /*#__PURE__*/_jsx(UIBackButton, {
    className: "m-right-6",
    children: /*#__PURE__*/_jsx(UILink, {
      onClick: goBackToSequences,
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "enrollModal.header.backButton"
      })
    })
  });
};

SequenceEnrollBreadcrumbs.propTypes = {
  goBackToSequences: PropTypes.func,
  isWithinSalesModal: PropTypes.bool.isRequired
};
export default SequenceEnrollBreadcrumbs;