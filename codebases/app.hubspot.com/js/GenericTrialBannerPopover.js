'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useCallback, useState, useEffect } from 'react';
import H4 from 'UIComponents/elements/headings/H4';
import UIPopover from 'UIComponents/tooltip/UIPopover';
import { useHasSeenPopover } from './useHasSeenPopover';
import UIButton from 'UIComponents/button/UIButton';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { tracker } from 'ui-addon-upgrades/_core/common/eventTracking/tracker'; // Setting the height expands the banner iFrame so the popover can be shown

var StyledDiv = styled.div.withConfig({
  displayName: "GenericTrialBannerPopover__StyledDiv",
  componentId: "f5ridq-0"
})(["height:", "px;"], function (_ref) {
  var popoverHeight = _ref.popoverHeight;
  return popoverHeight || 200;
});

var GenericTrialBannerPopover = function GenericTrialBannerPopover(_ref2) {
  var popoverTargetRef = _ref2.popoverTargetRef,
      popoverHeight = _ref2.popoverHeight,
      popoverName = _ref2.popoverName,
      popoverWidth = _ref2.popoverWidth,
      shouldUseDelay = _ref2.shouldUseDelay,
      showFlydown = _ref2.showFlydown,
      translatedTitle = _ref2.translatedTitle,
      translatedBody = _ref2.translatedBody,
      translatedConfirmButtonText = _ref2.translatedConfirmButtonText,
      userAttributesKey = _ref2.userAttributesKey;

  var _useState = useState(shouldUseDelay),
      _useState2 = _slicedToArray(_useState, 2),
      isDelaying = _useState2[0],
      setIsDelaying = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      hasDismissedPopover = _useState4[0],
      setHasDismissedPopover = _useState4[1];

  var _useState5 = useState(false),
      _useState6 = _slicedToArray(_useState5, 2),
      hasTrackedPopoverView = _useState6[0],
      setHasTrackedPopoverView = _useState6[1];

  var hasSeenPopover = useHasSeenPopover(showFlydown, userAttributesKey);
  var shouldShowPopover = !hasSeenPopover && popoverTargetRef && !isDelaying;
  useEffect(function () {
    if (shouldShowPopover && !hasTrackedPopoverView) {
      tracker.track('interaction', {
        action: "view " + popoverName + " popover"
      });
      setHasTrackedPopoverView(true);
    }
  }, [hasTrackedPopoverView, popoverName, shouldShowPopover]);
  useEffect(function () {
    if (!hasSeenPopover && popoverTargetRef && isDelaying) {
      setTimeout(function () {
        setIsDelaying(false);
      }, 4000);
    }
  }, [hasSeenPopover, isDelaying, popoverTargetRef]);
  var handleTrackClose = useCallback(function (evt) {
    var isPopoverOpen = evt.target.value;

    if (!isPopoverOpen) {
      setHasDismissedPopover(true);
      tracker.track('interaction', {
        action: "close " + popoverName + " popover"
      });
    }
  }, [popoverName]);
  var handleConfirmClick = useCallback(function () {
    var closedEvt = {
      target: {
        value: false
      }
    };
    handleTrackClose(closedEvt);
  }, [handleTrackClose]);
  var renderedBody = useMemo(function () {
    return /*#__PURE__*/_jsxs(_Fragment, {
      children: [/*#__PURE__*/_jsx("p", {
        children: translatedBody
      }), /*#__PURE__*/_jsx("div", {
        className: "display-flex justify-end",
        children: /*#__PURE__*/_jsx(UIButton, {
          size: "small",
          use: "primary",
          onClick: handleConfirmClick,
          children: translatedConfirmButtonText
        })
      })]
    });
  }, [handleConfirmClick, translatedBody, translatedConfirmButtonText]);
  var renderedPopoverContent = useMemo(function () {
    return {
      header: /*#__PURE__*/_jsx(H4, {
        children: translatedTitle
      }),
      body: renderedBody
    };
  }, [renderedBody, translatedTitle]);
  if (!shouldShowPopover) return null;
  return /*#__PURE__*/_jsx(StyledDiv, {
    popoverHeight: popoverHeight,
    children: /*#__PURE__*/_jsx(UIPopover, {
      onOpenChange: handleTrackClose,
      content: renderedPopoverContent,
      open: !hasDismissedPopover,
      placement: "bottom",
      showCloseButton: true,
      target: popoverTargetRef,
      use: "shepherd",
      width: popoverWidth
    })
  });
};

GenericTrialBannerPopover.propTypes = {
  popoverTargetRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({
    current: PropTypes.instanceOf(Element)
  })]),
  popoverHeight: PropTypes.number,
  popoverName: PropTypes.string,
  popoverWidth: PropTypes.number,
  shouldUseDelay: PropTypes.bool,
  showFlydown: PropTypes.bool,
  translatedBody: PropTypes.node.isRequired,
  translatedConfirmButtonText: PropTypes.node.isRequired,
  translatedTitle: PropTypes.node.isRequired,
  userAttributesKey: PropTypes.string.isRequired
};
export default GenericTrialBannerPopover;