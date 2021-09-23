'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { List } from 'immutable';
import map from 'transmute/map';
import { OptionType } from 'UIComponents/types/OptionTypes';
import pipe from 'transmute/pipe';
import { Component } from 'react';
import { listOf, recordOf } from 'react-immutable-proptypes';
import ReferenceInputEnumAll from './enum/ReferenceInputEnumAll';
import ReferenceInputEnumNone from './enum/ReferenceInputEnumNone';
import ReferenceInputEnumSearch from './enum/ReferenceInputEnumSearch';
import ReferenceResolverType from 'reference-resolvers/schema/ReferenceResolverType';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import toJS from 'transmute/toJS';
import translate from 'transmute/translate';
import omit from 'transmute/omit';
import PropTypes from 'prop-types';
import { propertyDescriptionTranslator, propertyLabelTranslator } from 'property-translator/propertyTranslator';
import { defaultFilterOption } from './defaults/defaultFilterOption';
var toSelectOptions = pipe(map(translate({
  help: function help(property) {
    return property.hubspotDefined ? propertyDescriptionTranslator(property.label, property.description) : property.description;
  },
  icon: true,
  text: function text(property) {
    return property.hubspotDefined ? propertyLabelTranslator(property.label) : property.label;
  },
  value: true,
  disabled: true
})), toJS);
var propTypes = {
  multi: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.oneOfType([PropTypes.arrayOf(OptionType.isRequired).isRequired, listOf(recordOf({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  })).isRequired]).isRequired,
  resolver: ReferenceResolverType,
  value: PropTypes.oneOfType([PropTypes.string, listOf(PropTypes.string.isRequired)])
};
var defaultProps = {
  options: []
};

var ReferenceInputEnum = /*#__PURE__*/function (_Component) {
  _inherits(ReferenceInputEnum, _Component);

  function ReferenceInputEnum() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ReferenceInputEnum);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ReferenceInputEnum)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.handleChange = function (evt) {
      var _this$props = _this.props,
          multi = _this$props.multi,
          onChange = _this$props.onChange;

      if (multi) {
        onChange(SyntheticEvent(List(evt.target.value)));
        return;
      }

      onChange(evt);
    };

    return _this;
  }

  _createClass(ReferenceInputEnum, [{
    key: "focus",
    value: function focus() {
      this.input.focus();
    }
  }, {
    key: "getOptions",
    value: function getOptions() {
      var options = this.props.options;

      if (!options || Array.isArray(options)) {
        return options;
      }

      return toSelectOptions(options);
    }
  }, {
    key: "getReferenceEnumComponent",
    value: function getReferenceEnumComponent() {
      var resolver = this.props.resolver;

      if (!resolver) {
        return ReferenceInputEnumNone;
      }

      if (resolver.search) {
        return ReferenceInputEnumSearch;
      }

      return ReferenceInputEnumAll;
    }
  }, {
    key: "getValue",
    value: function getValue() {
      var _this$props2 = this.props,
          multi = _this$props2.multi,
          value = _this$props2.value;

      if (multi) {
        return value ? value.toArray() : [];
      }

      return value;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var ReferenceEnum = this.getReferenceEnumComponent();
      var transferableProps = omit(['isInline', 'getProperty', 'objectType', 'onInvalidProperty', 'propertyIndex', 'readOnlySourceData', 'showError', 'showPlaceholder', 'subjectId', 'secondaryChanges', 'onSecondaryChange'], this.props);
      return /*#__PURE__*/_jsx(ReferenceEnum, Object.assign({}, transferableProps, {
        anchorType: "button",
        filterOption: defaultFilterOption,
        onChange: this.handleChange,
        options: this.getOptions(),
        ref: function ref(component) {
          return _this2.input = component;
        },
        value: this.getValue()
      }));
    }
  }]);

  return ReferenceInputEnum;
}(Component);

export { ReferenceInputEnum as default };
ReferenceInputEnum.propTypes = propTypes;
ReferenceInputEnum.defaultProps = defaultProps;