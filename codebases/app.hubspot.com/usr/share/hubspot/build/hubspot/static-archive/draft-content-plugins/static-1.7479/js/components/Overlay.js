'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { EditorState, SelectionState, Modifier } from 'draft-js';
import { Map as ImmutableMap } from 'immutable';
import PropTypes from 'prop-types';
import { Component } from 'react';
import createGetVisibleSelectionRectAtTrigger from 'draft-plugins/utils/createGetVisibleSelectionRectAtTrigger';
import makeTypingTriggerRegex from 'draft-plugins/utils/makeTypingTriggerRegex';
import UIPopover from 'UIComponents/tooltip/UIPopover';
import OverlayContents from './OverlayContents';

var Overlay = /*#__PURE__*/function (_Component) {
  _inherits(Overlay, _Component);

  function Overlay(props) {
    var _this;

    _classCallCheck(this, Overlay);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Overlay).call(this, props));
    _this.getVisibleSelectionRectAtTrigger = createGetVisibleSelectionRectAtTrigger({
      trigger: _this.props.trigger,
      maximumSearch: _this.props.maximumSearch
    });
    _this.TYPING_TRIGGER_REGEX = makeTypingTriggerRegex({
      trigger: _this.props.trigger,
      maximumSearch: _this.props.maximumSearch
    });
    _this.getCurrentSearch = _this.getCurrentSearch.bind(_assertThisInitialized(_this));
    _this.cancel = _this.cancel.bind(_assertThisInitialized(_this));
    _this.forceClose = _this.forceClose.bind(_assertThisInitialized(_this));
    _this.saveCoordinates = _this.saveCoordinates.bind(_assertThisInitialized(_this));
    _this.handleToggleForcedOverlayFocus = _this.handleToggleForcedOverlayFocus.bind(_assertThisInitialized(_this)); // Save coordinates for the dropdown so that we can use this if there is
    // no current window selection (eg. when we want to forceOverlay but editor isn't focused)

    _this.savedCoordinates = {};
    _this.state = {
      // Keeps the overlay onscreen when editor is out of focus
      forceOverlayFocus: false,
      // Force closes the overlay if a user doesn't want to use the shortcut
      forceCloseSelection: false
    };
    return _this;
  }

  _createClass(Overlay, [{
    key: "getCurrentSearch",
    value: function getCurrentSearch() {
      var editorState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props.editorState;
      var trigger = this.props.trigger;
      var selection = editorState.getSelection();
      var _this$state = this.state,
          forceCloseSelection = _this$state.forceCloseSelection,
          forceOverlayFocus = _this$state.forceOverlayFocus;

      if (!selection.getHasFocus() && !forceOverlayFocus) {
        return null;
      }

      var contentState = editorState.getCurrentContent();
      var block = contentState.getBlockForKey(selection.getStartKey());
      var blockText = block && block.getText();
      var offset = selection.getStartOffset();

      if (!selection.isCollapsed() || blockText === undefined) {
        return null;
      }

      var matchArray = blockText.slice(0, offset).match(this.TYPING_TRIGGER_REGEX);

      if (matchArray === null) {
        return null;
      }

      var beforeCursorText = matchArray[0].slice(trigger.length);
      var pastCursorMatch = blockText.slice(offset).match(/^\w+/);
      var pastCursorText = pastCursorMatch !== null ? pastCursorMatch[0] : '';

      if (forceCloseSelection && forceCloseSelection === selection) {
        return null;
      }

      return {
        search: beforeCursorText + pastCursorText,
        offset: offset - beforeCursorText.length - trigger.length,
        length: trigger.length + beforeCursorText.length + pastCursorText.length
      };
    }
  }, {
    key: "handleToggleForcedOverlayFocus",
    value: function handleToggleForcedOverlayFocus(isFocused) {
      this.setState({
        forceOverlayFocus: isFocused
      });
    }
  }, {
    key: "cancel",
    value: function cancel(_ref) {
      var offset = _ref.offset,
          length = _ref.length;
      var _this$props = this.props,
          editorState = _this$props.editorState,
          onChange = _this$props.onChange;
      var blockKey = editorState.getSelection().getStartKey();
      var targetRange = SelectionState.createEmpty(blockKey).merge({
        anchorOffset: offset + length,
        focusOffset: offset + length,
        isBackward: false,
        hasFocus: true
      });
      var contentState = Modifier.insertText(editorState.getCurrentContent(), targetRange, '  ');
      onChange(EditorState.push(editorState, contentState, 'insert-characters'));
    }
  }, {
    key: "forceClose",
    value: function forceClose() {
      this.setState({
        forceCloseSelection: this.props.editorState.getSelection()
      });
    }
  }, {
    key: "saveCoordinates",
    value: function saveCoordinates(boundingRect) {
      this.savedCoordinates = boundingRect;
    }
  }, {
    key: "renderDropdown",
    value: function renderDropdown(currentSearch) {
      var _this$props2 = this.props,
          addKeyCommandListener = _this$props2.addKeyCommandListener,
          removeKeyCommandListener = _this$props2.removeKeyCommandListener,
          onSelect = _this$props2.onSelect,
          data = _this$props2.data,
          setSearchQuery = _this$props2.setSearchQuery,
          options = _this$props2.options,
          isLoading = _this$props2.isLoading,
          portalId = _this$props2.portalId,
          ResultsComponent = _this$props2.ResultsComponent;
      return /*#__PURE__*/_jsx(OverlayContents, {
        currentSearch: currentSearch,
        addKeyCommandListener: addKeyCommandListener,
        removeKeyCommandListener: removeKeyCommandListener,
        onSelect: onSelect,
        portalId: portalId,
        ResultsComponent: ResultsComponent,
        cancel: this.cancel,
        forceClose: this.forceClose,
        setForcedOverlayFocus: this.handleToggleForcedOverlayFocus,
        data: data,
        setSearchQuery: setSearchQuery,
        options: options,
        isLoading: isLoading
      });
    }
  }, {
    key: "renderTriggerAnchor",
    value: function renderTriggerAnchor(shouldBeOpen) {
      if (!shouldBeOpen) {
        return null;
      }

      var coordinates = this.state.forceOverlayFocus ? this.savedCoordinates : this.getVisibleSelectionRectAtTrigger(this.saveCoordinates) || this.savedCoordinates;

      if (!coordinates) {
        return null;
      }

      var top = coordinates.top,
          left = coordinates.left,
          height = coordinates.height,
          width = coordinates.width;
      return /*#__PURE__*/_jsx("div", {
        className: "trigger-anchor",
        style: {
          position: 'fixed',
          visibility: 'hidden',
          top: top + height,
          left: left + width / 2
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          onOpen = _this$props3.onOpen,
          onClose = _this$props3.onClose;
      var currentSearch = this.getCurrentSearch();
      var shouldBeOpen = currentSearch !== null;
      return /*#__PURE__*/_jsx(UIPopover, {
        open: shouldBeOpen,
        content: this.renderDropdown(currentSearch),
        placement: "bottom right",
        onOpenComplete: onOpen,
        onCloseComplete: onClose,
        children: this.renderTriggerAnchor(shouldBeOpen)
      });
    }
  }]);

  return Overlay;
}(Component);

Overlay.propTypes = {
  editorState: PropTypes.object,
  onChange: PropTypes.func,
  addKeyCommandListener: PropTypes.func,
  removeKeyCommandListener: PropTypes.func,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  portalId: PropTypes.number.isRequired,
  trigger: PropTypes.string,
  maximumSearch: PropTypes.number,
  ResultsComponent: PropTypes.func,
  data: PropTypes.instanceOf(ImmutableMap),
  setSearchQuery: PropTypes.func.isRequired,
  options: PropTypes.array,
  isLoading: PropTypes.bool
};
export default Overlay;