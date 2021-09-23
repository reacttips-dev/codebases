'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import * as BulkEnrollTourSteps from 'sales-modal/constants/BulkEnrollTourSteps';
import H4 from 'UIComponents/elements/headings/H4';
import UITourStep from 'ui-shepherd-react/tour/UITourStep';
import UIButtonWrapper from 'UIComponents/layout/UIButtonWrapper';
import UITourNextButton from 'ui-shepherd-react/button/UITourNextButton';
import UITourCancelButton from 'ui-shepherd-react/button/UITourCancelButton';

var AllContactsBulkEnrollTourStep = function AllContactsBulkEnrollTourStep(_ref) {
  var children = _ref.children,
      onSkip = _ref.onSkip;
  return /*#__PURE__*/_jsx(UITourStep, {
    stepKey: BulkEnrollTourSteps.ALL_CONTACTS,
    placement: "right bottom",
    width: 350,
    content: {
      header: /*#__PURE__*/_jsxs(H4, {
        children: [' ', /*#__PURE__*/_jsx(FormattedMessage, {
          message: "bulkEnroll.shepherdTour.primarySequenceStep.header"
        })]
      }),
      body: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "bulkEnroll.shepherdTour.primarySequenceStep.body"
      }),
      footer: /*#__PURE__*/_jsxs(UIButtonWrapper, {
        children: [/*#__PURE__*/_jsx(UITourCancelButton, {
          size: "small",
          beforeCancel: onSkip,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "bulkEnroll.shepherdTour.primarySequenceStep.skipTour"
          })
        }), /*#__PURE__*/_jsx(UITourNextButton, {
          use: "primary",
          size: "small"
        })]
      })
    },
    showSteps: true,
    showCloseButton: true,
    onOpenChange: onSkip,
    children: children
  });
};

AllContactsBulkEnrollTourStep.propTypes = {
  children: PropTypes.node.isRequired,
  onSkip: PropTypes.func.isRequired
};
export default AllContactsBulkEnrollTourStep;