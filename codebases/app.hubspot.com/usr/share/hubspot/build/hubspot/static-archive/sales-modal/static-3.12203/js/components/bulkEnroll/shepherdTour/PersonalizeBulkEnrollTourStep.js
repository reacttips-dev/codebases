'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import * as BulkEnrollTourSteps from 'sales-modal/constants/BulkEnrollTourSteps';
import H4 from 'UIComponents/elements/headings/H4';
import UITourStep from 'ui-shepherd-react/tour/UITourStep';
import UITourFinishButton from 'ui-shepherd-react/button/UITourFinishButton';

var PersonalizeBulkEnrollTourStep = function PersonalizeBulkEnrollTourStep(_ref) {
  var children = _ref.children,
      onFinish = _ref.onFinish,
      onCloseButtonClick = _ref.onCloseButtonClick;
  return /*#__PURE__*/_jsx(UITourStep, {
    stepKey: BulkEnrollTourSteps.PERSONALIZE,
    placement: "right bottom",
    width: 350,
    content: {
      header: /*#__PURE__*/_jsx(H4, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "bulkEnroll.shepherdTour.singleContactStep.header"
        })
      }),
      body: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "bulkEnroll.shepherdTour.singleContactStep.body"
      }),
      footer: /*#__PURE__*/_jsx(UITourFinishButton, {
        use: "primary",
        size: "small",
        beforeFinish: onFinish
      })
    },
    showSteps: true,
    showCloseButton: true,
    onOpenChange: onCloseButtonClick,
    children: children
  });
};

PersonalizeBulkEnrollTourStep.propTypes = {
  children: PropTypes.node.isRequired,
  onFinish: PropTypes.func.isRequired,
  onCloseButtonClick: PropTypes.func.isRequired
};
export default PersonalizeBulkEnrollTourStep;