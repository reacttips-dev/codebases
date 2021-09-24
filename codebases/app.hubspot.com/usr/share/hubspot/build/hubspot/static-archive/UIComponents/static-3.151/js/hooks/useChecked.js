'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
export var useChecked = function useChecked(props) {
  var checked = props.checked,
      defaultChecked = props.defaultChecked,
      onChange = props.onChange;

  var _useState = useState(defaultChecked),
      _useState2 = _slicedToArray(_useState, 2),
      checkedState = _useState2[0],
      setCheckedState = _useState2[1];

  var handleChange = useCallback(function (evt) {
    setCheckedState(evt.target.checked);
    if (onChange) onChange(evt);
  }, [onChange]);
  return {
    checked: checked !== undefined ? checked : checkedState,
    onChange: handleChange
  };
};
export var checkedPropTypes = {
  checked: PropTypes.bool,
  defaultChecked: PropTypes.bool,
  onChange: PropTypes.func
};
export var checkedDefaultProps = {
  defaultChecked: false
};