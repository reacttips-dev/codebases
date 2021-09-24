'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import EmptyState from '../Components/EmptyState';
import PropTypes from 'prop-types';
import { memo } from 'react';
import classNames from 'classnames';
import { getTextContentFromHtml } from 'sanitize-text/sanitizers/TextSanitizer';
/**
 * Renders sanitized plain text extracted from a raw html value.
 * Sanitization is critical, as property values are untrusted and may
 * contain malicious scripts!
 */

var HtmlCell = function HtmlCell(_ref) {
  var value = _ref.value,
      className = _ref.className;

  if (!value) {
    return /*#__PURE__*/_jsx(EmptyState, {});
  }

  var classes = classNames('text-left truncate-text', className);
  return /*#__PURE__*/_jsx("span", {
    className: classes,
    title: value,
    children: getTextContentFromHtml(value)
  });
};

HtmlCell.propTypes = {
  className: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.node, PropTypes.number, PropTypes.string])
};
export default /*#__PURE__*/memo(HtmlCell);