'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { createRef, Component, Fragment } from 'react';
import styled from 'styled-components';
import omit from 'transmute/omit';
import getIn from 'transmute/getIn';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import UITypeahead from 'UIComponents/typeahead/UITypeahead';

var getHtmlBodyForOption = function getHtmlBodyForOption(id, options) {
  return getIn(['snippet', 'htmlBody'], options.find(function (option) {
    return option.value === id;
  }));
};

var areOptionsRenderable = function areOptionsRenderable(options) {
  return options && options.length > 0;
};

var LoadingPositioner = styled.div.withConfig({
  displayName: "ContentTypeahead__LoadingPositioner",
  componentId: "wh69b9-0"
})(["align-items:center;display:flex;height:180px;justify-content:center;"]);
var CompactTypeahead = styled(UITypeahead).withConfig({
  displayName: "ContentTypeahead__CompactTypeahead",
  componentId: "wh69b9-1"
})([".content-popover-search-results{height:180px;}.content-popover-search{background:none;margin-bottom:12px;padding:0;}"]);

var ContentTypeahead = /*#__PURE__*/function (_Component) {
  _inherits(ContentTypeahead, _Component);

  function ContentTypeahead(props) {
    var _this;

    _classCallCheck(this, ContentTypeahead);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ContentTypeahead).call(this, props));
    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(ContentTypeahead, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var wasLoading = prevProps.isLoading,
          prevOptions = prevProps.options;
      var _this$props = this.props,
          isLoading = _this$props.isLoading,
          options = _this$props.options;
      var didPreviouslyRenderTypeahead = areOptionsRenderable(prevOptions);
      var isTypeaheadRendered = areOptionsRenderable(options);

      if ((!didPreviouslyRenderTypeahead && isTypeaheadRendered || wasLoading && !isLoading) && this._inputRef && this._inputRef.current) {
        this._inputRef.current.focus();
      }
    }
  }, {
    key: "handleChange",
    value: function handleChange(e) {
      var _this$props2 = this.props,
          onChange = _this$props2.onChange,
          options = _this$props2.options;
      var id = e.target.value;
      var htmlBody = getHtmlBodyForOption(id, options);
      onChange({
        id: id,
        htmlBody: htmlBody
      });
    }
  }, {
    key: "renderLoadingSpinner",
    value: function renderLoadingSpinner() {
      var isLoading = this.props.isLoading;

      if (isLoading) {
        return /*#__PURE__*/_jsx(LoadingPositioner, {
          children: /*#__PURE__*/_jsx(UILoadingSpinner, {})
        });
      }

      return null;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          EmptyState = _this$props3.EmptyState,
          ErrorState = _this$props3.ErrorState,
          search = _this$props3.search,
          handleSearch = _this$props3.handleSearch,
          options = _this$props3.options,
          isLoading = _this$props3.isLoading,
          portalId = _this$props3.portalId,
          searchPlaceHolder = _this$props3.searchPlaceHolder;

      if (!options) {
        return /*#__PURE__*/_jsx(ErrorState, {
          portalId: portalId
        });
      }

      if (options.length === 0 && search.length === 0 && !isLoading) {
        return /*#__PURE__*/_jsx(EmptyState, {
          portalId: portalId
        });
      }

      this._inputRef = this._inputRef || /*#__PURE__*/createRef();
      return /*#__PURE__*/_jsxs(Fragment, {
        children: [/*#__PURE__*/_jsx(CompactTypeahead, {
          autoFilter: false,
          options: options,
          placeholder: I18n.text(searchPlaceHolder),
          resultsClassName: "content-popover-search-results",
          searchClassName: "content-popover-search",
          onChange: this.handleChange,
          search: search,
          onSearchChange: function onSearchChange(event) {
            return handleSearch(event, omit(['results'], options));
          },
          inputRef: this._inputRef,
          hideResults: isLoading
        }), this.renderLoadingSpinner()]
      });
    }
  }]);

  return ContentTypeahead;
}(Component);

ContentTypeahead.propTypes = {
  ErrorState: PropTypes.func.isRequired,
  EmptyState: PropTypes.func.isRequired,
  search: PropTypes.string,
  handleSearch: PropTypes.func,
  onChange: PropTypes.func,
  options: PropTypes.array,
  isLoading: PropTypes.bool,
  portalId: PropTypes.number.isRequired,
  searchPlaceHolder: PropTypes.string.isRequired
};
export default ContentTypeahead;