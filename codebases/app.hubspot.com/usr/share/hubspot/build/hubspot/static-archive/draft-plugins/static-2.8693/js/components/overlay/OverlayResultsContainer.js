'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
export default (function (ResultsComponent) {
  return createReactClass({
    propTypes: {
      portalId: PropTypes.number.isRequired,
      search: PropTypes.string.isRequired,
      offset: PropTypes.number.isRequired,
      length: PropTypes.number.isRequired,
      results: PropTypes.array.isRequired,
      onCancel: PropTypes.func.isRequired,
      onSelect: PropTypes.func.isRequired,
      forceClose: PropTypes.func.isRequired,
      toggleForcedOverlayFocus: PropTypes.func.isRequired,
      addKeyCommandListener: PropTypes.func.isRequired,
      removeKeyCommandListener: PropTypes.func.isRequired
    },
    getInitialState: function getInitialState() {
      return {
        selection: 0
      };
    },
    componentDidMount: function componentDidMount() {
      this.props.addKeyCommandListener(this.handleKeyCommand);
    },
    componentWillUnmount: function componentWillUnmount() {
      this.props.removeKeyCommandListener(this.handleKeyCommand);
    },
    handleKeyCommand: function handleKeyCommand(editorState, command, keyboardEvent) {
      var _this$props = this.props,
          offset = _this$props.offset,
          onSelect = _this$props.onSelect,
          length = _this$props.length,
          results = _this$props.results;
      var selection = this.state.selection;
      var option = selection < results.length ? results[selection] : null;

      switch (command) {
        case 'return':
        case 'tab':
          keyboardEvent.preventDefault();
          keyboardEvent.stopPropagation();

          if (option !== null) {
            onSelect(option, {
              offset: offset,
              length: length
            });
            this.props.removeKeyCommandListener(this.handleKeyCommand);
            return true;
          }

          return null;

        case 'up-arrow':
          keyboardEvent.preventDefault();
          this.arrowUp();
          return true;

        case 'down-arrow':
          keyboardEvent.preventDefault();
          this.arrowDown();
          return true;

        case 'escape':
          {
            this.props.forceClose();
            return true;
          }

        default:
          return null;
      }
    },
    arrowUp: function arrowUp() {
      var selection = this.state.selection;

      if (selection > 0) {
        this.setState({
          selection: selection - 1
        });
      }
    },
    arrowDown: function arrowDown() {
      var results = this.props.results;
      var selection = this.state.selection;

      if (results.length > selection + 1) {
        this.setState({
          selection: selection + 1
        });
      }
    },
    render: function render() {
      var selection = this.state.selection;

      var _this$props2 = this.props,
          portalId = _this$props2.portalId,
          results = _this$props2.results,
          onSelect = _this$props2.onSelect,
          onCancel = _this$props2.onCancel,
          search = _this$props2.search,
          offset = _this$props2.offset,
          length = _this$props2.length,
          toggleForcedOverlayFocus = _this$props2.toggleForcedOverlayFocus,
          rest = _objectWithoutProperties(_this$props2, ["portalId", "results", "onSelect", "onCancel", "search", "offset", "length", "toggleForcedOverlayFocus"]);

      return /*#__PURE__*/_jsx(ResultsComponent, Object.assign({
        portalId: portalId,
        results: results,
        onSelect: onSelect,
        onCancel: onCancel,
        selection: selection,
        search: search,
        offset: offset,
        length: length,
        toggleForcedOverlayFocus: toggleForcedOverlayFocus
      }, rest));
    }
  });
});