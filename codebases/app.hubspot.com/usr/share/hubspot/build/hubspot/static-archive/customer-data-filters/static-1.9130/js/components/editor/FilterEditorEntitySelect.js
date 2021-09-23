'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import FilterEditorFieldSelect from './FilterEditorFieldSelect';

var FilterEditorEntitySelect = /*#__PURE__*/function (_FilterEditorFieldSel) {
  _inherits(FilterEditorEntitySelect, _FilterEditorFieldSel);

  function FilterEditorEntitySelect() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, FilterEditorEntitySelect);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(FilterEditorEntitySelect)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.handleFieldChange = function (field) {
      var onChange = _this.props.onChange;
      onChange(SyntheticEvent(field));
    };

    return _this;
  }

  return FilterEditorEntitySelect;
}(FilterEditorFieldSelect);

export { FilterEditorEntitySelect as default };