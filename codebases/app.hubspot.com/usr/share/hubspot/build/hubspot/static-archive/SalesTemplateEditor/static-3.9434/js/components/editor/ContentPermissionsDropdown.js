'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { Map as ImmutableMap } from 'immutable';
import PropTypes from 'prop-types';
import { canWrite } from 'SalesTemplateEditor/lib/permissions';
import { trackInteraction } from 'SalesTemplateEditor/tracking/tracker';
import { SHARE_PRIVATE, SHARE_EVERYONE } from 'SalesTemplateEditor/tracking/Actions';
import { connect } from 'react-redux';
import * as PermissionActions from 'SalesTemplateEditor/actions/PermissionActions';
import UIDropdown from 'UIComponents/dropdown/UIDropdown';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UITruncateString from 'UIComponents/text/UITruncateString';
import UITypeahead from 'UIComponents/typeahead/UITypeahead';
import { canEditPermissions, sharingOptionValues, getTemplateSharingOptions, getSharingOptionValue } from 'SalesTemplateEditor/utils/sharingPermissionsUtils';
import CreateEditTemplateTooltip from '../CreateEditTemplateTooltip';

function renderShareOption(passedProps) {
  var children = passedProps.children,
      option = passedProps.option,
      __onClick = passedProps.onClick,
      rest = _objectWithoutProperties(passedProps, ["children", "option", "onClick"]);

  return /*#__PURE__*/_jsx(UITooltip, Object.assign({}, option.tooltipProps, {
    children: /*#__PURE__*/_jsx("li", Object.assign({}, rest, {
      children: children
    }))
  }));
}

var ContentPermissionsDropdown = function ContentPermissionsDropdown(_ref) {
  var template = _ref.template,
      readOnly = _ref.readOnly,
      userProfile = _ref.userProfile,
      permissions = _ref.permissions,
      setShared = _ref.setShared;

  if (readOnly) {
    return null;
  }

  function handleShareSelect(e) {
    var value = e.target.value;
    var selectedPrivate = value === sharingOptionValues.private;
    setShared(selectedPrivate);
    var action = selectedPrivate ? SHARE_PRIVATE : SHARE_EVERYONE;
    trackInteraction(action);
  }

  var sharingOptions = getTemplateSharingOptions();
  var value = getSharingOptionValue(permissions);
  var sharedText = sharingOptions.find(function (opt) {
    return opt.value === value;
  }).text;
  return /*#__PURE__*/_jsx("div", {
    className: "inline-dropdown",
    children: /*#__PURE__*/_jsx(CreateEditTemplateTooltip, {
      buttonCreatesNewTemplate: false,
      children: /*#__PURE__*/_jsx(UIDropdown, {
        buttonUse: "link",
        iconName: "contacts",
        buttonText: /*#__PURE__*/_jsx(UITruncateString, {
          className: "display-inline-flex",
          maxWidth: 200,
          children: sharedText
        }),
        disabled: !canWrite() || !canEditPermissions({
          template: template,
          userProfile: userProfile
        }),
        children: /*#__PURE__*/_jsx(UITypeahead, {
          minimumSearchCount: 100,
          onChange: handleShareSelect,
          options: sharingOptions,
          value: value,
          itemComponent: renderShareOption
        })
      })
    })
  });
};

ContentPermissionsDropdown.propTypes = {
  template: PropTypes.instanceOf(ImmutableMap).isRequired,
  readOnly: PropTypes.bool.isRequired,
  userProfile: PropTypes.object,
  permissions: PropTypes.instanceOf(ImmutableMap).isRequired,
  setShared: PropTypes.func.isRequired
};
export default connect(function (state) {
  return {
    permissions: state.permissions.get('permissionsData')
  };
}, {
  setShared: PermissionActions.setShared
})(ContentPermissionsDropdown);