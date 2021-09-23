'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import filter from 'transmute/filter';
import merge from 'transmute/merge';
import { Stack } from 'immutable';
import UndoRedoMixin from 'crm_components/dialog/propertyListEditor/UndoRedoMixin';
import ImmutableRenderMixin from 'react-immutable-render-mixin';

var PropertyListHistory = function PropertyListHistory(BaseComponent) {
  return createReactClass({
    displayName: 'PropertyListHistory',
    mixins: [ImmutableRenderMixin, UndoRedoMixin],
    propTypes: {
      properties: PropTypes.array.isRequired
    },
    getInitialState: function getInitialState() {
      return {
        history: Stack.of(this.props.properties),
        future: Stack()
      };
    },
    handleChange: function handleChange(selection) {
      var _this$state = this.state,
          future = _this$state.future,
          history = _this$state.history;
      this.setState({
        future: future.clear(),
        history: history.push(selection)
      });
    },
    handleRedo: function handleRedo() {
      var _this$state2 = this.state,
          future = _this$state2.future,
          history = _this$state2.history;

      if (future.isEmpty()) {
        return;
      }

      this.setState({
        future: future.pop(),
        history: history.push(future.peek())
      });
    },
    handleUndo: function handleUndo() {
      var _this$state3 = this.state,
          future = _this$state3.future,
          history = _this$state3.history;

      if (history.size === 1) {
        return;
      }

      this.setState({
        future: future.push(history.peek()),
        history: history.pop()
      });
    },
    handleRemoveAll: function handleRemoveAll() {
      var history = this.state.history;
      var current = history.peek();
      var filtered = filter(function (_ref) {
        var readOnly = _ref.readOnly,
            disabled = _ref.disabled;
        return readOnly || disabled;
      }, current);
      this.handleChange(filtered);
    },
    handleRequiredChange: function handleRequiredChange(selected) {
      var _this$state4 = this.state,
          future = _this$state4.future,
          history = _this$state4.history;
      var updatedHistory = history.peek().reduce(function (list, item) {
        if (item.value === selected.value) {
          var updatedItem = merge({
            required: !item.required
          }, item);
          list.push(updatedItem);
        } else {
          list.push(item);
        }

        return list;
      }, []);
      return this.setState({
        future: future.clear(),
        history: history.push(updatedHistory)
      });
    },
    render: function render() {
      return /*#__PURE__*/_jsx(BaseComponent, Object.assign({}, this.props, {
        value: this.state.history.peek(),
        hasChanges: this.state.history.peek() !== this.props.properties,
        onChange: this.handleChange,
        onRequiredChange: this.handleRequiredChange
      }));
    }
  });
};

export default PropertyListHistory;