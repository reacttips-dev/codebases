'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { forwardRef, useContext } from 'react';
import classNames from 'classnames';
import { FieldsetContext } from '../context/FieldsetContext';
var LABEL_SIZE_OPTIONS = {
  default: '',
  small: 'private-form__label--small'
};
var UIFormLabel = /*#__PURE__*/forwardRef(function (props, ref) {
  var className = props.className,
      error = props.error,
      readOnly = props.readOnly,
      required = props.required,
      rest = _objectWithoutProperties(props, ["className", "error", "readOnly", "required"]);

  var _useContext = useContext(FieldsetContext),
      fieldSize = _useContext.size;
  /* eslint-disable jsx-a11y/label-has-associated-control */


  return /*#__PURE__*/_jsx("label", Object.assign({}, rest, {
    className: classNames('private-form__label', LABEL_SIZE_OPTIONS[fieldSize], className, readOnly && 'private-form__label--readonly', required && 'private-form__label--required', error && 'error-msg'),
    ref: ref
  }));
  /* eslint-enable jsx-a11y/label-has-associated-control */
});
UIFormLabel.propTypes = {
  children: PropTypes.node,
  error: PropTypes.bool.isRequired,
  htmlFor: PropTypes.string,
  readOnly: PropTypes.bool.isRequired,
  required: PropTypes.bool.isRequired
};
UIFormLabel.defaultProps = {
  error: false,
  required: false,
  readOnly: false
};
UIFormLabel.displayName = 'UIFormLabel';
export default UIFormLabel;