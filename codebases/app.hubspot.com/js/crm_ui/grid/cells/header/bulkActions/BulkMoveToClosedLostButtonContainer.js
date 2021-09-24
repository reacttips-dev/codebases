'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { canMoveStage, getClosedLostStage } from 'crm_data/BET/permissions/DealPermissions';
import ScopesContainer from '../../../../../containers/ScopesContainer';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import BulkMoveToClosedLostButtonContainerAsync from './BulkMoveToClosedLostButtonContainerAsync';
import BulkActionPropsType from '../../../utils/BulkActionPropsType';
import { getAsSet } from '../../../../../containers/ScopeOperators';

var BulkMoveToClosedLostButtonContainer = /*#__PURE__*/function (_PureComponent) {
  _inherits(BulkMoveToClosedLostButtonContainer, _PureComponent);

  function BulkMoveToClosedLostButtonContainer() {
    _classCallCheck(this, BulkMoveToClosedLostButtonContainer);

    return _possibleConstructorReturn(this, _getPrototypeOf(BulkMoveToClosedLostButtonContainer).apply(this, arguments));
  }

  _createClass(BulkMoveToClosedLostButtonContainer, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          bulkActionProps = _this$props.bulkActionProps,
          options = _this$props.options;
      var scopes = getAsSet(ScopesContainer.get());

      var _bulkActionProps$toJS = bulkActionProps.toJS(),
          allSelected = _bulkActionProps$toJS.allSelected,
          checked = _bulkActionProps$toJS.checked,
          objectType = _bulkActionProps$toJS.objectType,
          selectedCount = _bulkActionProps$toJS.selectionCount,
          viewId = _bulkActionProps$toJS.viewId;

      var getCurrentSearchQuery = function getCurrentSearchQuery() {
        return bulkActionProps.get('query');
      };

      return /*#__PURE__*/_jsx(BulkMoveToClosedLostButtonContainerAsync, {
        allSelected: allSelected,
        canMoveStage: canMoveStage,
        checked: checked,
        getClosedLostStage: getClosedLostStage,
        getCurrentSearchQuery: getCurrentSearchQuery,
        objectType: objectType,
        options: options,
        scopes: scopes,
        selectedCount: selectedCount,
        viewId: viewId
      });
    }
  }]);

  return BulkMoveToClosedLostButtonContainer;
}(PureComponent);

BulkMoveToClosedLostButtonContainer.propTypes = {
  bulkActionProps: BulkActionPropsType.isRequired,
  options: PropTypes.object
};
export default BulkMoveToClosedLostButtonContainer;