import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIButton from 'UIComponents/button/UIButton';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UIModal from 'UIComponents/dialog/UIModal';
import H3 from 'UIComponents/elements/headings/H3';
import UITourCancelButton from 'ui-shepherd-react/button/UITourCancelButton';
import { EVENTS } from '../../constants/TrackingConstants';
import { removeNextTourToStorage } from '../../util/tourStorage';
import { UsageTracker } from '../../util/usageTracker';

var trackCloseModal = function trackCloseModal(stepId, tourId, action) {
  UsageTracker.track(EVENTS.TOUR_VIEW_CLOSE_MODAL, {
    action: action,
    tourId: tourId,
    stepId: stepId
  });
};

var OnboardingTourCloseModal = function OnboardingTourCloseModal(_ref) {
  var onConfirm = _ref.onConfirm,
      onReject = _ref.onReject,
      tourId = _ref.tourId,
      stepId = _ref.stepId;
  useEffect(function () {
    trackCloseModal(stepId, tourId, 'open tour close modal');
  }, [stepId, tourId]);
  return /*#__PURE__*/_jsxs(UIModal, {
    use: "conversational",
    children: [/*#__PURE__*/_jsx(UIDialogHeader, {
      children: /*#__PURE__*/_jsx(H3, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "onboarding-tours.modal.close.title"
        })
      })
    }), /*#__PURE__*/_jsxs(UIDialogFooter, {
      className: "p-top-6",
      children: [/*#__PURE__*/_jsx(UITourCancelButton, {
        onClick: function onClick() {
          trackCloseModal(stepId, tourId, 'confirm closing tour');
          onConfirm();
          removeNextTourToStorage();
        },
        use: "primary",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "onboarding-tours.modal.close.confirm"
        })
      }), /*#__PURE__*/_jsx(UIButton, {
        onClick: function onClick() {
          trackCloseModal(stepId, tourId, 'reject closing tour');
          onReject();
        },
        use: "secondary",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "onboarding-tours.modal.close.reject"
        })
      })]
    })]
  });
};

OnboardingTourCloseModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  stepId: PropTypes.string.isRequired,
  tourId: PropTypes.string.isRequired
};
export default OnboardingTourCloseModal;