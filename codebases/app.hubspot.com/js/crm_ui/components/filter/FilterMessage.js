'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import EmptyStateMessage from '../../emptyState/EmptyStateMessage';
import ObjectTypesType from 'customer-data-objects-ui-components/propTypes/ObjectTypesType';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';

var renderBody = function renderBody(key) {
  if (key) {
    return /*#__PURE__*/_jsx("p", {
      children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: key
      })
    }, key);
  }

  return null;
};

var renderBodies = function renderBodies(bodies) {
  if (bodies.map) {
    return bodies.map(renderBody);
  }

  return renderBody(bodies);
};

var FilterMessage = function FilterMessage(_ref) {
  var title = _ref.title,
      objectType = _ref.objectType,
      illustration = _ref.illustration,
      bodies = _ref.bodies,
      children = _ref.children;
  return /*#__PURE__*/_jsxs(EmptyStateMessage, {
    titleText: title,
    illustration: illustration,
    objectType: objectType,
    children: [renderBodies(bodies), children]
  });
};

FilterMessage.propTypes = {
  title: PropTypes.string.isRequired,
  objectType: ObjectTypesType.isRequired,
  illustration: PropTypes.string.isRequired,
  bodies: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  children: PropTypes.node
};
export default FilterMessage;