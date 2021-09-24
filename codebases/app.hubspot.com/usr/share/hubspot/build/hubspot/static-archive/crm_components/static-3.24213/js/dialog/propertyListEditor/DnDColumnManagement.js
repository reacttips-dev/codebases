'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import compose from 'transmute/compose';
import SharedDragDropContext from 'customer-data-ui-utilities/dnd/SharedDragDropContext';

var DnDColumnManagement = function DnDColumnManagement(BaseComponent) {
  return createReactClass({
    displayName: 'DnDColumnManagement',
    propTypes: {
      value: PropTypes.array.isRequired,
      onChange: PropTypes.func.isRequired
    },
    getValue: function getValue() {
      var value = this.props.value;
      return value;
    },
    handleAddOption: function handleAddOption(item, at) {
      var option = item.data && item.data.option || item;
      var value = this.getValue().slice();
      at = at === -1 ? value.length : at;
      value.splice(at || value.length, 0, option);
      this.props.onChange(value);
    },
    handleRemoveOption: function handleRemoveOption(option) {
      var currentValues = this.getValue();
      var newValues = currentValues.filter(function (_ref) {
        var value = _ref.value;
        return !(option.value === value);
      });
      this.props.onChange(newValues);
    },
    handleReorderOption: function handleReorderOption(from, to) {
      if (from === to) {
        return;
      }

      var value = this.getValue().slice(); // make sure we move it below the "sticky" disabled columns if it's going to the top (to===0)

      var toIdx = !to ? value.reduce(function (acc, cur, idx) {
        if (cur.disabled) return idx + 1;
        return acc;
      }, 0) : to;
      var removed = value.splice(from, 1)[0];
      value.splice(toIdx, 0, removed);
      this.props.onChange(value);
    },
    handleSave: function handleSave() {
      var value = this.props.value;
      var nextValue = this.getValue();

      if (nextValue !== value) {
        this.props.onChange(nextValue);
      }
    },
    // for a temp refactor we are making handle reset a no-op as it is vestigial but we do not have the time to remove refs in child components
    handleReset: function handleReset() {},
    render: function render() {
      return /*#__PURE__*/_jsx(BaseComponent, Object.assign({}, this.props, {
        value: this.getValue(),
        onAddOption: this.handleAddOption,
        onRemoveOption: this.handleRemoveOption,
        onReorderOption: this.handleReorderOption,
        onReset: this.handleReset,
        onSave: this.handleSave
      }));
    }
  });
};

export default compose(SharedDragDropContext(), DnDColumnManagement);