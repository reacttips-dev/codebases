'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsx as _jsx } from "react/jsx-runtime";
import pick from '../utils/underscore/pick';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { getDefaultPropName, getOnChangeName, getPropFromDefaultName } from '../core/PropNames';
import getComponentName from 'react-utils/getComponentName';
import invariant from 'react-utils/invariant';
import { attachWrappedComponent, makeDecoratorRefCallback } from './utils';
import { notRequired } from '../utils/propTypes/decorators';
var DEFAULT_FIELDS = ['value'];
/**
 * @param  {React.Component}
 * @param  {Array<string>}
 * @return {Object}
 */

function _getDefaultProps(component, fields) {
  // shallow copy of defaultProps to use as the initial value to prevent mutation
  var defaultProps = Object.assign({}, component.defaultProps);
  return fields.reduce(function (defaults, field) {
    if (Object.prototype.hasOwnProperty.call(defaults, field)) {
      defaults[getDefaultPropName(field)] = defaults[field];
      delete defaults[field];
    }

    return defaults;
  }, defaultProps);
}
/**
 * @param  {Object}
 * @param  {Array<string>}
 * @return {Object}
 */


function getDefaultPropTypes(originalPropTypes, fields) {
  return fields.reduce(function (propTypes, field) {
    var originalPropType = propTypes[field];

    if (typeof originalPropType !== 'function') {
      originalPropType = PropTypes.any;
    }

    var notRequiredPropType = notRequired(originalPropType);
    propTypes[getDefaultPropName(field)] = notRequiredPropType;
    propTypes[field] = notRequiredPropType;
    return propTypes;
  }, Object.assign({}, originalPropTypes));
}
/**
 * @param  {Array<string>}
 * @return {Object}
 */


function getHandlerPropTypes(fields) {
  return fields.reduce(function (propTypes, field) {
    propTypes[getOnChangeName(field)] = PropTypes.func;
    return propTypes;
  }, {});
}
/**
 * @param  {ReactElement} instance
 * @param  {string} field
 * @param  {Object} event
 * @return {void}
 */


function handleChange(instance, field, evt) {
  if (process.env.NODE_ENV !== 'production') {
    invariant(evt && evt.target != null, getComponentName(instance.constructor) + " handleChange: expected " + 'argument in shape of SyntheticEvent ({target: value})');
  }

  instance.setState(_defineProperty({}, field, evt.target.value));
  var onChange = instance.props[getOnChangeName(field)];

  if (typeof onChange === 'function') {
    onChange(evt);
  }
}
/**
 * @param  {React.Component}
 * @param  {Array<string>}
 * @return {React.Component}
 */


export default function Controllable(InputComponent) {
  var fields = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_FIELDS;
  var onChangeKeys = fields.map(getOnChangeName);
  var defaultProps = fields.map(getDefaultPropName);
  var controlledComponent = createReactClass({
    displayName: "Controllable(" + getComponentName(InputComponent) + ")",
    propTypes: Object.assign({}, getDefaultPropTypes(InputComponent.propTypes, fields), {}, getHandlerPropTypes(fields)),

    /**
     * @return {Object}
     */
    getDefaultProps: function getDefaultProps() {
      return _getDefaultProps(InputComponent, fields);
    },

    /**
     * @return {Object}
     */
    getInitialState: function getInitialState() {
      var defaults = pick(this.props, defaultProps);
      var initialState = {};
      Object.keys(defaults).forEach(function (defaultKey) {
        initialState[getPropFromDefaultName(defaultKey)] = defaults[defaultKey];
      });
      return initialState;
    },

    /**
     * @return {void}
     */
    UNSAFE_componentWillMount: function UNSAFE_componentWillMount() {
      var _this = this;

      var handlers = {};
      onChangeKeys.forEach(function (onChangeKey, i) {
        handlers[onChangeKey] = function () {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return handleChange.apply(void 0, [_this, fields[i]].concat(args));
        };
      });
      this.handlers = handlers;
      this._refCallback = makeDecoratorRefCallback(InputComponent, this);
    },

    /**
     * @return {void}
     */
    UNSAFE_componentWillReceiveProps: function UNSAFE_componentWillReceiveProps(nextProps) {
      var _this2 = this;

      fields.forEach(function (field) {
        if (_this2.props[field] !== undefined && nextProps[field] === undefined) {
          _this2.setState(_defineProperty({}, field, nextProps[getDefaultPropName(field)]));
        }
      });
    },

    /**
     * @return {Object}
     */
    getProps: function getProps() {
      var _this3 = this;

      var applicableProps = {};
      Object.keys(this.props).forEach(function (key) {
        if (defaultProps.indexOf(key) === -1 && _this3.props[key] !== undefined) applicableProps[key] = _this3.props[key];
      });
      return Object.assign({}, this.state, {}, applicableProps, {}, this.handlers);
    },

    /**
     * @return {React.Element}
     */
    render: function render() {
      return /*#__PURE__*/_jsx(InputComponent, Object.assign({}, this.getProps(), {
        ref: this._refCallback
      }));
    }
  });
  attachWrappedComponent(controlledComponent, InputComponent);
  return controlledComponent;
}