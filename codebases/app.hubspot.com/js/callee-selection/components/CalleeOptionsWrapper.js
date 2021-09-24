'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { PureComponent } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { OrderedMap } from 'immutable';
import RecordPropType from 'conversations-prop-types/prop-types/RecordPropType';
import { getEntries } from 'conversations-async-data/indexed-async-data/operators/getters';
import { getRequiredCalleeProperties } from 'calling-lifecycle-internal/callees/operators/getPropertyKeys';
import SearchableCalleeListContainer from '../containers/SearchableCalleeListContainer';

var CalleeOptionsWrapper = /*#__PURE__*/function (_PureComponent) {
  _inherits(CalleeOptionsWrapper, _PureComponent);

  function CalleeOptionsWrapper() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, CalleeOptionsWrapper);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(CalleeOptionsWrapper)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {
      searchResults: OrderedMap()
    };

    _this.handleUpdatedSearchResults = function (_ref) {
      var searchResults = _ref.searchResults;

      _this.setState({
        searchResults: searchResults
      });
    };

    return _this;
  }

  _createClass(CalleeOptionsWrapper, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.updateCalleeProperties();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var callableObjectList = this.props.callableObjectList;
      var searchResults = this.state.searchResults;
      if (callableObjectList === prevProps.callableObjectList && searchResults === prevState.searchResults) return;
      this.updateCalleeProperties();
    }
  }, {
    key: "updateCalleeProperties",
    value: function updateCalleeProperties() {
      var _this$props = this.props,
          getCalleeProperties = _this$props.getCalleeProperties,
          calleeProperties = _this$props.calleeProperties,
          callableObjectList = _this$props.callableObjectList;
      var searchResults = this.state.searchResults;
      var propertiesByCallee = getEntries(calleeProperties);
      var requiredCalleeProperties = getRequiredCalleeProperties({
        searchResults: searchResults,
        callableObjects: callableObjectList,
        propertyKeySeq: propertiesByCallee.keySeq()
      });

      if (requiredCalleeProperties.keys.length > 0) {
        getCalleeProperties(requiredCalleeProperties);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          calleesData = _this$props2.calleesData,
          onEditProperty = _this$props2.onEditProperty,
          onSelectToNumber = _this$props2.onSelectToNumber,
          onAddPropertyClick = _this$props2.onAddPropertyClick;
      return /*#__PURE__*/_jsx(SearchableCalleeListContainer, {
        calleesData: calleesData,
        onSelectToNumber: onSelectToNumber,
        onEditProperty: onEditProperty,
        onAddPropertyClick: onAddPropertyClick,
        onUpdateSearchResults: this.handleUpdatedSearchResults,
        showSingleContactNames: false
      });
    }
  }]);

  return CalleeOptionsWrapper;
}(PureComponent);

CalleeOptionsWrapper.propTypes = {
  getCalleeProperties: PropTypes.func.isRequired,
  onEditProperty: PropTypes.func.isRequired,
  onSelectToNumber: PropTypes.func.isRequired,
  onAddPropertyClick: PropTypes.func.isRequired,
  calleeProperties: RecordPropType('IndexedAsyncData').isRequired,
  callableObjectList: ImmutablePropTypes.orderedMap.isRequired,
  calleesData: RecordPropType('CalleesRecord')
};
export { CalleeOptionsWrapper as default };