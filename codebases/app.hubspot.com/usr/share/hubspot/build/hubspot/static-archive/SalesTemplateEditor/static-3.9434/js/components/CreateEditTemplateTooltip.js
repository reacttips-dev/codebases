'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback } from 'react';
import { Map as ImmutableMap } from 'immutable';
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { canWrite, hasHigherTemplateLimit } from 'SalesTemplateEditor/lib/permissions';
import { onViewWritePermissionTooltip } from 'SalesTemplateEditor/tracking/TrackingInterface';
import UITooltip from 'UIComponents/tooltip/UITooltip';

var CreateEditTemplateTooltip = function CreateEditTemplateTooltip(_ref) {
  var children = _ref.children,
      portalIsAtLimit = _ref.portalIsAtLimit,
      usage = _ref.usage,
      buttonCreatesNewTemplate = _ref.buttonCreatesNewTemplate;
  var trackViewWritePermissionTooltip = useCallback(function (_ref2) {
    var open = _ref2.target.value;

    if (open) {
      onViewWritePermissionTooltip();
    }
  }, []);

  function getWritePermissionsTooltip() {
    if (canWrite()) {
      return null;
    }

    var tooltipMessage = buttonCreatesNewTemplate ? 'templateEditor.noWritePermissions.create' : 'templateEditor.noWritePermissions.edit';
    return /*#__PURE__*/_jsx(FormattedMessage, {
      message: tooltipMessage
    });
  }

  function getTemplateLimitsTooltip() {
    if (!buttonCreatesNewTemplate || !usage) {
      return null;
    }

    var isAtFreeUserLimit = !hasHigherTemplateLimit() && usage.get('count') >= usage.get('userLimit');

    if (!isAtFreeUserLimit && !portalIsAtLimit) {
      return null;
    }

    var tooltipMessage = portalIsAtLimit ? 'templateEditor.portalOverLimitTooltip' : 'templateEditor.freeUserOverLimitToolip';
    return /*#__PURE__*/_jsx(FormattedMessage, {
      message: tooltipMessage,
      options: {
        limit: usage.get('limit'),
        count: usage.get('count'),
        userLimit: usage.get('userLimit')
      }
    });
  }

  var tooltipTitle = getWritePermissionsTooltip() || getTemplateLimitsTooltip();
  var onOpenChange = canWrite() ? undefined : trackViewWritePermissionTooltip;
  return tooltipTitle ? /*#__PURE__*/_jsx(UITooltip, {
    title: tooltipTitle,
    onOpenChange: onOpenChange,
    children: children
  }) : children;
};

CreateEditTemplateTooltip.propTypes = {
  children: PropTypes.node.isRequired,
  usage: PropTypes.instanceOf(ImmutableMap),
  portalIsAtLimit: PropTypes.bool,
  buttonCreatesNewTemplate: PropTypes.bool
};
export default CreateEditTemplateTooltip;