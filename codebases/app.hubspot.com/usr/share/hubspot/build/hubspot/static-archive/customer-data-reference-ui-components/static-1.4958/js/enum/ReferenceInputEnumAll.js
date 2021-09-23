'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { deref, watch, unwatch } from 'atom';
import { OptionType } from 'UIComponents/types/OptionTypes';
import PropTypes from 'prop-types';
import { Component } from 'react';
import ReferenceResolverAllType from 'reference-resolvers/schema/ReferenceResolverAllType';
import UISelect from 'UIComponents/input/UISelect';
import { isResolved } from 'reference-resolvers/utils';
import omit from 'transmute/omit';
import { propertyLabelTranslator } from 'property-translator/propertyTranslator';
import { defaultEnumOptionFormatter } from '../defaults/defaultEnumOptionFormatter';

var translateReferenceLabelIfHubSpotDefined = function translateReferenceLabelIfHubSpotDefined(reference) {
  return reference.getIn(['referencedObject', 'hubspotDefined']) ? reference.update('label', propertyLabelTranslator) : reference;
};

var propTypes = {
  filter: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  optionFormatter: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(OptionType.isRequired),
  readOnly: PropTypes.bool,
  resolver: ReferenceResolverAllType.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string.isRequired)]),
  multi: PropTypes.bool
};
var defaultProps = {
  options: [],
  optionFormatter: defaultEnumOptionFormatter
};
var initialState = {
  options: []
};

var ReferenceInputEnumAll = /*#__PURE__*/function (_Component) {
  _inherits(ReferenceInputEnumAll, _Component);

  function ReferenceInputEnumAll() {
    var _this;

    _classCallCheck(this, ReferenceInputEnumAll);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ReferenceInputEnumAll).call(this));

    _this.handleOptionsChange = function (options) {
      var _this$props = _this.props,
          filter = _this$props.filter,
          optionFormatter = _this$props.optionFormatter;

      if (isResolved(options)) {
        var filteredOptions = filter ? options.filter(filter) : options;

        _this.setState({
          options: filteredOptions.map(translateReferenceLabelIfHubSpotDefined).sort(function (a, b) {
            return a.getIn(['referencedObject', 'displayOrder'], -1) - b.getIn(['referencedObject', 'displayOrder'], -1);
          }).map(optionFormatter).toArray()
        });
      }
    };

    _this.state = initialState;
    _this.referenceAtom = null;
    return _this;
  }

  _createClass(ReferenceInputEnumAll, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.configureResolver(this.props);
    }
  }, {
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.resolver !== this.props.resolver) {
        if (this.referenceAtom) {
          unwatch(this.referenceAtom, this.handleOptionsChange);
        }

        this.configureResolver(nextProps);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.referenceAtom) {
        unwatch(this.referenceAtom, this.handleOptionsChange);
      }
    }
  }, {
    key: "configureResolver",
    value: function configureResolver(props) {
      var resolver = props.resolver;
      this.referenceAtom = resolver.all();
      watch(this.referenceAtom, this.handleOptionsChange);
      this.handleOptionsChange(deref(this.referenceAtom));
    }
  }, {
    key: "focus",
    value: function focus() {
      this.refs.input.focus();
    }
  }, {
    key: "getOptions",
    value: function getOptions() {
      var options = this.props.options;
      return options.concat(this.state.options);
    }
  }, {
    key: "render",
    value: function render() {
      var transferrableProps = omit(['onCancel', 'onSecondaryChange', 'onInvalidProperty'], this.props);
      return /*#__PURE__*/_jsx(UISelect, Object.assign({}, transferrableProps, {
        options: this.getOptions(),
        ref: "input"
      }));
    }
  }]);

  return ReferenceInputEnumAll;
}(Component);

export { ReferenceInputEnumAll as default };
ReferenceInputEnumAll.propTypes = propTypes;
ReferenceInputEnumAll.defaultProps = defaultProps;