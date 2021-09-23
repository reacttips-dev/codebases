'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Map as ImmutableMap } from 'immutable';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import FormattedMessage from 'I18n/components/FormattedMessage';
import formatName from 'I18n/utils/formatName';
import UITruncateString from 'UIComponents/text/UITruncateString';

var TemplateOwner = function TemplateOwner(_ref) {
  var template = _ref.template,
      userProfile = _ref.userProfile,
      readOnly = _ref.readOnly;

  if (readOnly) {
    return null;
  }

  var name;
  var userView = template.get('userView');

  if (userView) {
    name = formatName(userView.toObject());
  } else {
    // Current user is creating a new template, so show their name
    name = formatName({
      firstName: userProfile['first_name'],
      lastName: userProfile['last_name'],
      email: userProfile['email']
    });
  }

  return /*#__PURE__*/_jsxs(Fragment, {
    children: [/*#__PURE__*/_jsx("label", {
      "data-test-id": "template-owner-label",
      className: " m-bottom-0 is--text--bold",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "templateEditor.ownedBy"
      })
    }), /*#__PURE__*/_jsx(UITruncateString, {
      "data-test-id": "template-owner-name",
      className: " p-left-1 p-right-5",
      maxWidth: 200,
      useFlex: true,
      children: name
    })]
  });
};

TemplateOwner.propTypes = {
  template: PropTypes.instanceOf(ImmutableMap).isRequired,
  readOnly: PropTypes.bool.isRequired,
  userProfile: PropTypes.object
};
export default TemplateOwner;