'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { List } from 'immutable';
import { NORMAL } from 'draft-smart-detections/rules/lib/suggestionDegrees';
import { onViewSuggestions } from 'SalesTemplateEditor/tracking/TrackingInterface';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIPopover from 'UIComponents/tooltip/UIPopover';
import Small from 'UIComponents/elements/Small';
import SuggestionList from 'draft-smart-detections/components/SuggestionsList';
import SuggestionsDot from 'draft-smart-detections/components/SuggestionsDot';
import SuggestionLoading from './SuggestionLoading';
export default createReactClass({
  displayName: "SuggestionsPopover",
  propTypes: {
    suggestions: PropTypes.instanceOf(List).isRequired,
    size: PropTypes.number.isRequired,
    isCheckingContent: PropTypes.bool.isRequired,
    handleDotClick: PropTypes.func
  },
  getInitialState: function getInitialState() {
    return {
      open: false
    };
  },
  handleDotClick: function handleDotClick() {
    var handleDotClick = this.props.handleDotClick;
    var open = this.state.open;
    var nextOpenState = !open;

    if (handleDotClick) {
      handleDotClick(nextOpenState);
    }

    if (open) {
      onViewSuggestions();
    }

    this.setState({
      open: nextOpenState
    });
  },
  renderDot: function renderDot() {
    var _this$props = this.props,
        size = _this$props.size,
        suggestions = _this$props.suggestions;
    var degree = NORMAL;

    if (size > 0) {
      degree = suggestions.first().get('degree');
    }

    return /*#__PURE__*/_jsx("div", {
      className: "pointer",
      onClick: this.handleDotClick,
      children: /*#__PURE__*/_jsx(SuggestionsDot, {
        use: "large",
        size: size,
        degree: degree
      })
    });
  },
  renderSuggestionCTA: function renderSuggestionCTA() {
    var _this = this;

    var open = this.state.open;
    var _this$props2 = this.props,
        size = _this$props2.size,
        suggestions = _this$props2.suggestions,
        isCheckingContent = _this$props2.isCheckingContent;
    var ctaCopy = size > 0 ? /*#__PURE__*/_jsx(FormattedMessage, {
      message: "templateEditor.suggestions.description"
    }) : /*#__PURE__*/_jsx(FormattedMessage, {
      message: "templateEditor.suggestions.success"
    });

    if (isCheckingContent) {
      return /*#__PURE__*/_jsx(SuggestionLoading, {});
    }

    return /*#__PURE__*/_jsxs(UIFlex, {
      align: "center",
      children: [/*#__PURE__*/_jsx(UIPopover, {
        open: open,
        placement: "top",
        content: /*#__PURE__*/_jsx(SuggestionList, {
          suggestions: suggestions,
          className: "suggestions-list p-top-6"
        }),
        onOpenChange: function onOpenChange(e) {
          return _this.setState({
            open: e.target.value
          });
        },
        children: this.renderDot()
      }), /*#__PURE__*/_jsx(Small, {
        use: "help",
        className: "m-left-2",
        children: ctaCopy
      })]
    });
  },
  render: function render() {
    return /*#__PURE__*/_jsx(UIFlex, {
      className: "m-left-6",
      align: "center",
      children: this.renderSuggestionCTA()
    });
  }
});