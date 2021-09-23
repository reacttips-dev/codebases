'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UILink from 'UIComponents/link/UILink';
import UIAlert from 'UIComponents/alert/UIAlert';
import { UsageTrackingLinkTypes, UsageTrackingActions, AlertTypes } from '../../../enums/Video2MigrationUsageTrackingProps';

var getI18nKey = function getI18nKey(suffix) {
  return "FileManagerCore.videoIsChangingAlert.portalOptedInManualMigration." + suffix;
};

var PortalLinedUpForManualMigrationAlert = function PortalLinedUpForManualMigrationAlert(_ref) {
  var wrapperClassName = _ref.wrapperClassName,
      onTrackInteraction = _ref.onTrackInteraction;
  return /*#__PURE__*/_jsx("div", {
    className: wrapperClassName,
    children: /*#__PURE__*/_jsxs(UIAlert, {
      type: "success",
      titleText: /*#__PURE__*/_jsx("div", {
        className: "p-top-3",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: getI18nKey('title')
        })
      }),
      children: [/*#__PURE__*/_jsx(FormattedMessage, {
        message: getI18nKey('message')
      }), /*#__PURE__*/_jsx(UILink, {
        className: "m-left-1",
        href: "hubspot.com",
        external: true,
        onClick: function onClick() {
          return onTrackInteraction(UsageTrackingActions.CLICK_LINK, {
            linkType: UsageTrackingLinkTypes.MANUAL_MIGRATION_LEARN_MORE,
            alert: AlertTypes.PORTAL_BEING_MIGRATED
          });
        },
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: getI18nKey('learnMoreLink')
        })
      })]
    })
  });
};

PortalLinedUpForManualMigrationAlert.propTypes = {
  wrapperClassName: PropTypes.string,
  onTrackInteraction: PropTypes.func.isRequired
};
export default PortalLinedUpForManualMigrationAlert;