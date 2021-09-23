'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { memo, Component, useCallback } from 'react';
import identity from 'transmute/identity';
import UIPopover from 'UIComponents/tooltip/UIPopover';
import { callIfPossible } from 'UIComponents/core/Functions';
import ContentTypeaheadContainer from './popover/ContentTypeaheadContainer';
export default (function (_ref) {
  var _ref$tracker = _ref.tracker,
      tracker = _ref$tracker === void 0 ? identity : _ref$tracker,
      onInsertContent = _ref.onInsertContent,
      portalId = _ref.portalId,
      Button = _ref.Button,
      PopoverErrorState = _ref.PopoverErrorState,
      PopoverEmptyState = _ref.PopoverEmptyState,
      _ref$PopoverComponent = _ref.PopoverComponent,
      PopoverComponent = _ref$PopoverComponent === void 0 ? UIPopover : _ref$PopoverComponent,
      popoverTestKey = _ref.popoverTestKey,
      onOpenPopover = _ref.onOpenPopover,
      Header = _ref.Header,
      searchPlaceHolder = _ref.searchPlaceHolder,
      search = _ref.search,
      _ref$transformData = _ref.transformData,
      transformData = _ref$transformData === void 0 ? identity : _ref$transformData,
      _ref$onlyRenderConten = _ref.onlyRenderContent,
      onlyRenderContent = _ref$onlyRenderConten === void 0 ? false : _ref$onlyRenderConten,
      _ref$popoverPlacement = _ref.popoverPlacement,
      popoverPlacement = _ref$popoverPlacement === void 0 ? 'bottom' : _ref$popoverPlacement,
      popoverClassName = _ref.popoverClassName,
      _ref$renderedContentC = _ref.renderedContentClassName,
      renderedContentClassName = _ref$renderedContentC === void 0 ? 'p-all-5' : _ref$renderedContentC;

  function ContentButtonContents(_ref2) {
    var open = _ref2.open,
        toggleOpen = _ref2.toggleOpen,
        onOpenChange = _ref2.onOpenChange,
        onContentChange = _ref2.onContentChange;
    var renderContent = useCallback(function () {
      return /*#__PURE__*/_jsxs("div", {
        className: renderedContentClassName,
        children: [Header && /*#__PURE__*/_jsx(Header, {
          portalId: portalId
        }), /*#__PURE__*/_jsx(ContentTypeaheadContainer, {
          ErrorState: PopoverErrorState,
          EmptyState: PopoverEmptyState,
          onChange: onContentChange,
          portalId: portalId,
          search: search,
          transformData: transformData,
          searchPlaceHolder: searchPlaceHolder
        })]
      });
    }, [onContentChange]);
    return /*#__PURE__*/_jsx(PopoverComponent, {
      open: open,
      closeOnOutsideClick: true,
      onOpenChange: onOpenChange,
      width: 460,
      Content: renderContent,
      placement: popoverPlacement,
      className: popoverClassName,
      "data-test-id": popoverTestKey,
      children: /*#__PURE__*/_jsx(Button, {
        active: open,
        onClick: toggleOpen
      })
    });
  }

  var MemoizedContentButtonContents = /*#__PURE__*/memo(ContentButtonContents);

  var ContentButton = /*#__PURE__*/function (_Component) {
    _inherits(ContentButton, _Component);

    function ContentButton(props) {
      var _this;

      _classCallCheck(this, ContentButton);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ContentButton).call(this, props));
      _this.handleContentChange = _this.handleContentChange.bind(_assertThisInitialized(_this));
      _this.handleOpenChange = _this.handleOpenChange.bind(_assertThisInitialized(_this));
      _this.renderContent = _this.renderContent.bind(_assertThisInitialized(_this));
      _this.setState = _this.setState.bind(_assertThisInitialized(_this));
      _this.toggleOpen = _this.toggleOpen.bind(_assertThisInitialized(_this));
      _this.state = {
        open: false
      };
      return _this;
    }

    _createClass(ContentButton, [{
      key: "toggleOpen",
      value: function toggleOpen() {
        this.setState(function (_ref3) {
          var open = _ref3.open;

          if (!open && typeof onOpenPopover === 'function') {
            onOpenPopover();
          }

          return {
            open: !open
          };
        });
      }
    }, {
      key: "handleContentChange",
      value: function handleContentChange(_ref4) {
        var id = _ref4.id,
            htmlBody = _ref4.htmlBody;
        var _this$props = this.props,
            editorState = _this$props.editorState,
            insertContent = _this$props.insertContent,
            onClose = _this$props.onClose,
            useProsemirror = _this$props.useProsemirror;
        onInsertContent({
          fromPopover: true
        });

        if (!useProsemirror) {
          var currentSelection = editorState.getSelection();
          tracker('inserted-content-from-popover');
          var start = currentSelection.getStartOffset();
          var length = currentSelection.getEndOffset() - start;
          insertContent({
            id: id,
            htmlBody: htmlBody,
            length: length,
            offset: start
          });
        } else {
          insertContent({
            id: id,
            htmlBody: htmlBody
          });
        }

        this.setState({
          open: false
        });
        callIfPossible(onClose);
      }
    }, {
      key: "handleOpenChange",
      value: function handleOpenChange(e) {
        this.setState({
          open: e.target.value
        });
      }
    }, {
      key: "renderContent",
      value: function renderContent() {
        return /*#__PURE__*/_jsxs("div", {
          className: "p-all-5",
          children: [Header && /*#__PURE__*/_jsx(Header, {
            portalId: portalId
          }), /*#__PURE__*/_jsx(ContentTypeaheadContainer, {
            ErrorState: PopoverErrorState,
            EmptyState: PopoverEmptyState,
            onChange: this.handleContentChange,
            portalId: portalId,
            search: search,
            transformData: transformData,
            searchPlaceHolder: searchPlaceHolder
          })]
        });
      }
    }, {
      key: "render",
      value: function render() {
        if (onlyRenderContent) {
          return this.renderContent();
        }

        var open = this.state.open;
        return /*#__PURE__*/_jsx(MemoizedContentButtonContents, {
          open: open,
          onOpenChange: this.handleOpenChange,
          toggleOpen: this.toggleOpen,
          onContentChange: this.handleContentChange
        });
      }
    }]);

    return ContentButton;
  }(Component);

  ContentButton.propTypes = {
    editorState: PropTypes.object.isRequired,
    insertContent: PropTypes.func.isRequired,
    onClose: PropTypes.func,
    useProsemirror: PropTypes.bool
  };
  return ContentButton;
});