'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AbstractElement from './AbstractElement';
import { USES, WEIGHTS } from './TextElementConstants';

var getClasses = function getClasses(className, disabled, use, weight) {
  return classNames(className, disabled ? 'is--text--disabled' : {
    'is--text--regular': weight === WEIGHTS.regular,
    'is--text--medium': weight === WEIGHTS.medium,
    'is--text--demibold': weight === WEIGHTS.demi,
    'is--text--bold': weight === WEIGHTS.bold,
    'is--text--error': use === USES.error,
    'is--text--help': use === USES.help,
    'is--text--success': use === USES.success
  });
};

function AbstractTextElement(props) {
  var className = props.className,
      disabled = props.disabled,
      use = props.use,
      weight = props.weight,
      rest = _objectWithoutProperties(props, ["className", "disabled", "use", "weight"]);

  return /*#__PURE__*/_jsx(AbstractElement, Object.assign({}, rest, {
    className: getClasses(className, disabled, use, weight)
  }));
}

AbstractTextElement.propTypes = Object.assign({}, AbstractElement.propTypes, {
  use: PropTypes.oneOf(Object.keys(USES)),
  weight: PropTypes.oneOf(Object.keys(WEIGHTS))
});
AbstractTextElement.defaultProps = AbstractElement.defaultProps;
AbstractTextElement.displayName = 'AbstractTextElement';
export default AbstractTextElement;