import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Fragment, useEffect } from 'react';
import styled from 'styled-components';
import PortalIdParser from 'PortalIdParser';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIModal from 'UIComponents/dialog/UIModal';
import H4 from 'UIComponents/elements/headings/H4';
import H5 from 'UIComponents/elements/headings/H5';
import UIButton from 'UIComponents/button/UIButton';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UITile from 'UIComponents/tile/UITile';
import Confetti from '../Confetti';
import { GRID_BREAKPOINT_SMALL } from 'HubStyleTokens/sizes';
import { getUserGuideUrl } from '../../constants/URL';
import { EVENTS } from '../../constants/TrackingConstants';
import { UsageTracker } from '../../util/usageTracker';
var ConfettiContainer = styled.div.withConfig({
  displayName: "OnboardingTourFinishModal__ConfettiContainer",
  componentId: "v1xqjv-0"
})(["@media only screen and (min-width:", "){height:200%;left:-50%;overflow:hidden;pointer-events:none;position:absolute;top:-60px;width:200%;}"], GRID_BREAKPOINT_SMALL);

var OnboardingTourFinishModal = function OnboardingTourFinishModal(props) {
  var onClose = props.onClose,
      tourData = props.tourData,
      tourId = props.tourId,
      rest = _objectWithoutProperties(props, ["onClose", "tourData", "tourId"]);

  var recommendNextTour = tourData.recommendNextTour;
  useEffect(function () {
    UsageTracker.track(EVENTS.TOUR_VIEW_FINISH_MODAL, {
      tourId: tourId
    });
  }, [tourId]);
  var recommendedTourLink;
  var recommendedTourLinkClassName = 'm-top-4';

  if (recommendNextTour && recommendNextTour.ctaLink) {
    recommendedTourLink = recommendNextTour.ctaLink.replace('%portalId%', String(PortalIdParser.get()));
    var ctaClassName = recommendNextTour.ctaClassName;

    if (ctaClassName) {
      recommendedTourLinkClassName = recommendedTourLinkClassName + " " + ctaClassName;
    }
  }

  return /*#__PURE__*/_jsxs(UIModal, Object.assign({}, rest, {
    className: "m-top-0",
    use: "conversational",
    width: 550,
    children: [/*#__PURE__*/_jsx(ConfettiContainer, {
      children: /*#__PURE__*/_jsx(Confetti, {})
    }), /*#__PURE__*/_jsx(UIDialogHeader, {
      className: "text-center",
      children: /*#__PURE__*/_jsx(UIDialogCloseButton, {
        onClick: onClose
      })
    }), /*#__PURE__*/_jsxs(UIDialogBody, {
      children: [/*#__PURE__*/_jsx(H4, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "onboarding-tours.modal.finish.title"
        })
      }), recommendNextTour && /*#__PURE__*/_jsxs(Fragment, {
        children: [/*#__PURE__*/_jsx("div", {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "onboarding-tours.modal.finish.recommendTour"
          })
        }), /*#__PURE__*/_jsxs(UITile, {
          className: "m-x-6 m-top-3 p-x-10 p-y-6 text-left",
          children: [/*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx(H5, {
              children: recommendNextTour.title
            }), /*#__PURE__*/_jsx("span", {
              children: recommendNextTour.text
            })]
          }), /*#__PURE__*/_jsx(UIButton, {
            className: recommendedTourLinkClassName,
            href: recommendedTourLink,
            size: "sm",
            use: "primary",
            children: recommendNextTour.cta
          })]
        })]
      })]
    }), /*#__PURE__*/_jsx(UIDialogFooter, {
      align: "center",
      children: /*#__PURE__*/_jsx(UIButton, {
        href: getUserGuideUrl(),
        size: recommendNextTour ? 'sm' : undefined,
        use: recommendNextTour ? undefined : 'primary',
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "onboarding-tours.modal.finish.cta"
        })
      })
    })]
  }));
};

OnboardingTourFinishModal.propTypes = {
  onClose: PropTypes.func,
  step: PropTypes.object,
  tourData: PropTypes.object,
  tourId: PropTypes.string
};
export default OnboardingTourFinishModal;