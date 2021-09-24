'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import OverlayResultsInterface from 'draft-plugins/components/overlay/OverlayResultsInterface';
import UITypeaheadResults from 'UIComponents/typeahead/results/UITypeaheadResults';
import UITypeaheadResultsItem from 'UIComponents/typeahead/results/UITypeaheadResultsItem';

var ContentResults = /*#__PURE__*/function (_Component) {
  _inherits(ContentResults, _Component);

  function ContentResults(props) {
    var _this;

    _classCallCheck(this, ContentResults);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ContentResults).call(this, props));
    _this.handMouseDown = _this.handleMouseDown.bind(_assertThisInitialized(_this));
    _this.renderResults = _this.renderResults.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(ContentResults, [{
    key: "handleMouseDown",
    value: function handleMouseDown(e, option) {
      var _this$props = this.props,
          onSelect = _this$props.onSelect,
          offset = _this$props.offset,
          length = _this$props.length;
      e.preventDefault();
      e.stopPropagation();
      onSelect(option, {
        offset: offset,
        length: length
      });
    }
  }, {
    key: "renderResults",
    value: function renderResults() {
      var _this2 = this;

      var _this$props2 = this.props,
          portalId = _this$props2.portalId,
          results = _this$props2.results,
          selection = _this$props2.selection,
          ContentEmptyState = _this$props2.ContentEmptyState,
          toggleForcedOverlayFocus = _this$props2.toggleForcedOverlayFocus;

      if (results.length === 0) {
        return /*#__PURE__*/_jsx(ContentEmptyState, {
          portalId: portalId,
          toggleForcedOverlayFocus: toggleForcedOverlayFocus
        });
      }

      return results.slice(0, 20).map(function (option, index) {
        var highlighted = selection === index;
        return /*#__PURE__*/_jsx(UITypeaheadResultsItem, {
          highlighted: highlighted,
          option: {
            text: option.text
          },
          onMouseDown: function onMouseDown(e) {
            return _this2.handleMouseDown(e, option);
          },
          "aria-pressed": true
        }, "content-results-" + option.value);
      });
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_jsx(UITypeaheadResults, {
        style: {
          maxHeight: 300
        },
        children: this.renderResults()
      });
    }
  }]);

  return ContentResults;
}(Component);

ContentResults.propTypes = Object.assign({}, OverlayResultsInterface, {
  portalId: PropTypes.number.isRequired
});
export default ContentResults;