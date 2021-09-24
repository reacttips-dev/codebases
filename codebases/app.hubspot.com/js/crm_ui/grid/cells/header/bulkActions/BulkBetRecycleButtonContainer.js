'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import ScopesContainer from '../../../../../containers/ScopesContainer';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import BulkBetRecycleButtonContainerAsync from './BulkBetRecycleButtonContainerAsync';
import BulkActionPropsType from '../../../utils/BulkActionPropsType';
import { getObjectTypeLabel } from '../../../utils/BulkActionPropsRecord';
import { isScoped } from '../../../../../containers/ScopeOperators';

var BulkBetRecycleButtonContainer = /*#__PURE__*/function (_PureComponent) {
  _inherits(BulkBetRecycleButtonContainer, _PureComponent);

  function BulkBetRecycleButtonContainer(props) {
    var _this;

    _classCallCheck(this, BulkBetRecycleButtonContainer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BulkBetRecycleButtonContainer).call(this, props));
    _this.getCurrentSearchQuery = _this.getCurrentSearchQuery.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(BulkBetRecycleButtonContainer, [{
    key: "getCurrentSearchQuery",
    value: function getCurrentSearchQuery() {
      var query = this.props.bulkActionProps.get('query');
      return query;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          bulkActionProps = _this$props.bulkActionProps,
          options = _this$props.options;

      var _bulkActionProps$toJS = bulkActionProps.toJS(),
          allSelected = _bulkActionProps$toJS.allSelected,
          canBulkEditAll = _bulkActionProps$toJS.canBulkEditAll,
          checked = _bulkActionProps$toJS.checked,
          objectType = _bulkActionProps$toJS.objectType,
          selectedCount = _bulkActionProps$toJS.selectionCount,
          viewId = _bulkActionProps$toJS.viewId;

      return /*#__PURE__*/_jsx(BulkBetRecycleButtonContainerAsync, {
        allSelected: allSelected,
        canBulkEditAll: canBulkEditAll,
        canRecycleWhenNotOwner: isScoped(ScopesContainer.get(), 'bet-recycle-all-domains'),
        checked: checked,
        getCurrentSearchQuery: this.getCurrentSearchQuery,
        objectType: objectType,
        objectTypeLabel: getObjectTypeLabel(bulkActionProps),
        options: options,
        selectedCount: selectedCount,
        viewId: viewId
      });
    }
  }]);

  return BulkBetRecycleButtonContainer;
}(PureComponent);

BulkBetRecycleButtonContainer.propTypes = {
  bulkActionProps: BulkActionPropsType.isRequired,
  options: PropTypes.object
};
export default BulkBetRecycleButtonContainer;