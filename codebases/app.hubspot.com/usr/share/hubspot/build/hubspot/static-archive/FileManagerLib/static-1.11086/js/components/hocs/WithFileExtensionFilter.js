'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import FileExtensionFilters from '../../enums/FileExtensionFilters';
import { clearFilter, setFilter } from '../../actions/Filter';
import { buildFilterFromPOJOs, getIsDrawerWithFileExtensionFilterConfigValid } from '../../utils/fileFiltering';
import { reportError } from 'FileManagerCore/utils/logging';
export default (function (WrappedComponent) {
  var WithFileExtensionFilter = /*#__PURE__*/function (_Component) {
    _inherits(WithFileExtensionFilter, _Component);

    function WithFileExtensionFilter(props) {
      var _this;

      _classCallCheck(this, WithFileExtensionFilter);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(WithFileExtensionFilter).call(this, props));

      if (!getIsDrawerWithFileExtensionFilterConfigValid(props)) {
        reportError(new Error('[FileManagerLib/WithFileExtensionFilter] props.extensions cannot empty when filterType is not "NONE".'));
      }

      _this.setFilter = _this.setFilter.bind(_assertThisInitialized(_this));

      _this.setFilter();

      return _this;
    }

    _createClass(WithFileExtensionFilter, [{
      key: "componentDidUpdate",
      value: function componentDidUpdate() {
        this.setFilter();
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        this.props.clearFilter();
      }
    }, {
      key: "setFilter",
      value: function setFilter() {
        this.props.setFilter(buildFilterFromPOJOs(this.props.filterType, this.props.filteredExtensions, this.props.filteredReasons));
      }
    }, {
      key: "render",
      value: function render() {
        var _this$props = this.props,
            __extensions = _this$props.extensions,
            __reasons = _this$props.reasons,
            __filterType = _this$props.filterType,
            __setFilter = _this$props.setFilter,
            filteredProps = _objectWithoutProperties(_this$props, ["extensions", "reasons", "filterType", "setFilter"]);

        return /*#__PURE__*/_jsx(WrappedComponent, Object.assign({}, filteredProps));
      }
    }]);

    return WithFileExtensionFilter;
  }(Component);

  WithFileExtensionFilter.propTypes = {
    filteredExtensions: PropTypes.arrayOf(PropTypes.string).isRequired,
    filteredReasons: PropTypes.object,
    filterType: PropTypes.oneOf(Object.keys(FileExtensionFilters)).isRequired,
    setFilter: PropTypes.func.isRequired,
    clearFilter: PropTypes.func.isRequired,
    extensions: PropTypes.any,
    reasons: PropTypes.any
  };
  WithFileExtensionFilter.defaultProps = {
    filterType: FileExtensionFilters.SUPPORTED,
    extensions: [],
    reasons: {}
  };
  WithFileExtensionFilter.displayName = "WithFileExtensionFilter(" + WrappedComponent.displayName + ")";
  return connect(null, {
    setFilter: setFilter,
    clearFilter: clearFilter
  })(WithFileExtensionFilter);
});