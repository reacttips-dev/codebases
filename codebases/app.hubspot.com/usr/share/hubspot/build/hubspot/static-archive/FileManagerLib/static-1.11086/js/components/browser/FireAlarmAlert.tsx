import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import UIFireAlarm from 'UIComponents/alert/UIFireAlarm';
import UILink from 'UIComponents/link/UILink';
import { getBooleanKey, setKey } from 'FileManagerCore/utils/storage';
import FireAlarm from '../../records/FireAlarm';
var SEVERITY_TO_TYPE = {
  MAINTENANCE: 'warning',
  OUTAGE: 'danger'
};

var FireAlarmAlert = function FireAlarmAlert(_ref) {
  var fireAlarm = _ref.fireAlarm,
      trackInteraction = _ref.trackInteraction;

  var _useState = useState(getBooleanKey(fireAlarm.getDismissedLocalStorageKey())),
      _useState2 = _slicedToArray(_useState, 2),
      dismissed = _useState2[0],
      setDismissed = _useState2[1];

  var alertType = SEVERITY_TO_TYPE[fireAlarm.severity || SEVERITY_TO_TYPE.MAINTENANCE];

  if (dismissed) {
    return null;
  }

  var renderCta = function renderCta() {
    if (fireAlarm.callToAction && fireAlarm.callToAction.ctaText && fireAlarm.callToAction.url) {
      return /*#__PURE__*/_jsx(UILink, {
        external: true,
        href: fireAlarm.callToAction.url,
        children: fireAlarm.callToAction.ctaText
      });
    }

    return null;
  };

  return /*#__PURE__*/_jsx(UIFireAlarm, {
    closeable: true,
    titleText: fireAlarm.title,
    type: alertType,
    onClose: function onClose() {
      setDismissed(true);
      setKey(fireAlarm.getDismissedLocalStorageKey(), 'true');
      trackInteraction('fileManagerExploreFiles', 'dismiss-firealarm');
    },
    children: /*#__PURE__*/_jsxs(_Fragment, {
      children: [/*#__PURE__*/_jsx("p", {
        children: fireAlarm.message
      }), renderCta()]
    })
  });
};

FireAlarmAlert.propTypes = {
  fireAlarm: PropTypes.instanceOf(FireAlarm).isRequired,
  trackInteraction: PropTypes.func.isRequired
};
export default FireAlarmAlert;