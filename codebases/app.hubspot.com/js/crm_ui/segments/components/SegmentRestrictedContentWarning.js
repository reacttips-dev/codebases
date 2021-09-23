'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import PropTypes from 'prop-types';
import UIFlex from 'UIComponents/layout/UIFlex';
import links from 'crm-legacy-links/links';

function SegmentRestrictedContentWarning(_ref) {
  var _ref$restrictedObject = _ref.restrictedObjectCount,
      restrictedObjectCount = _ref$restrictedObject === void 0 ? 0 : _ref$restrictedObject,
      _ref$contactCount = _ref.contactCount,
      contactCount = _ref$contactCount === void 0 ? 0 : _ref$contactCount,
      listId = _ref.listId;

  if (!restrictedObjectCount) {
    return null;
  }

  return /*#__PURE__*/_jsxs(UIFlex, {
    className: "p-x-1",
    direction: "column",
    children: [/*#__PURE__*/_jsx("strong", {
      className: "m-y-3",
      children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: "restrictedContent.addToListWarning.title",
        options: {
          count: restrictedObjectCount,
          details: links.listDetails(listId)
        }
      })
    }), /*#__PURE__*/_jsx(FormattedHTMLMessage, {
      message: "restrictedContent.addToListWarning.body",
      options: {
        count: contactCount
      }
    })]
  });
}

SegmentRestrictedContentWarning.propTypes = {
  contactCount: PropTypes.number,
  listId: PropTypes.string.isRequired,
  restrictedObjectCount: PropTypes.number
};
export default SegmentRestrictedContentWarning;