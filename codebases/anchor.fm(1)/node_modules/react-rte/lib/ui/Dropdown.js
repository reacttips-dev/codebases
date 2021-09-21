import _slicedToArray from 'babel-runtime/helpers/slicedToArray';
import _Array$from from 'babel-runtime/core-js/array/from';
import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { Component } from 'react';
import autobind from 'class-autobind';
import cx from 'classnames';

import styles from './Dropdown.css';

var Dropdown = function (_Component) {
  _inherits(Dropdown, _Component);

  function Dropdown() {
    _classCallCheck(this, Dropdown);

    var _this = _possibleConstructorReturn(this, (Dropdown.__proto__ || _Object$getPrototypeOf(Dropdown)).apply(this, arguments));

    autobind(_this);
    return _this;
  }

  _createClass(Dropdown, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          choices = _props.choices,
          selectedKey = _props.selectedKey,
          className = _props.className,
          otherProps = _objectWithoutProperties(_props, ['choices', 'selectedKey', 'className']);

      className = cx(className, styles.root);
      var selectedItem = selectedKey == null ? null : choices.get(selectedKey);
      var selectedValue = selectedItem && selectedItem.label || '';
      return React.createElement(
        'span',
        { className: className, title: selectedValue },
        React.createElement(
          'select',
          _extends({}, otherProps, { value: selectedKey, onChange: this._onChange }),
          this._renderChoices()
        ),
        React.createElement(
          'span',
          { className: styles.value },
          selectedValue
        )
      );
    }
  }, {
    key: '_onChange',
    value: function _onChange(event) {
      var value = event.target.value;
      this.props.onChange(value);
    }
  }, {
    key: '_renderChoices',
    value: function _renderChoices() {
      var choices = this.props.choices;

      var entries = _Array$from(choices.entries());
      return entries.map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            _ref2$ = _ref2[1],
            label = _ref2$.label,
            className = _ref2$.className;

        return React.createElement(
          'option',
          { key: key, value: key, className: className },
          label
        );
      });
    }
  }]);

  return Dropdown;
}(Component);

export default Dropdown;