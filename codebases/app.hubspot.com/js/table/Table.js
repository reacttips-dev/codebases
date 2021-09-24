'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { connect } from 'general-store';
import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import BulkActionPropsRecord from '../crm_ui/grid/utils/BulkActionPropsRecord';
import BulkAssignToPrompt from '../crm_ui/prompts/grid/BulkAssignToPrompt';
import globalNavHeight from 'nav-meta/global-nav-height';
import GridUIStore from '../crm_ui/flux/grid/GridUIStore';
import GridViewSelectionEditableCountStore from '../crm_ui/flux/grid/GridViewSelectionEditableCountStore';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { AnyCrmObjectTypePropType } from 'customer-data-objects-ui-components/propTypes/CrmObjectTypes';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import BulkActionsContainer from './BulkActionsContainer';
import ViewDataGridContainer from '../crm_ui/grid/ViewDataGridContainer';
import ViewsStore from '../crm_ui/flux/views/ViewsStore';
import ViewType from 'customer-data-objects-ui-components/propTypes/ViewType';
import { NavMarker } from 'react-rhumb';
import { getBulkActionsByType, getMoreDropdownActionsByType } from './utils/getBulkActionsByType';
import UILoadingOverlay from 'UIComponents/loading/UILoadingOverlay';
var navHeight = parseInt(globalNavHeight, 10); //54

var headerHeight = 121;
var filterBarHeight = 80;
var paginatorHeight = 54;
var paddingAtBottom = 4;
var TOTAL_HEIGHT_OFFSET = navHeight + headerHeight + filterBarHeight + paginatorHeight + paddingAtBottom;
export var MAX_TABLE_HEIGHT = "calc(100vh - " + TOTAL_HEIGHT_OFFSET + "px)";
export var Table = /*#__PURE__*/function (_PureComponent) {
  _inherits(Table, _PureComponent);

  function Table() {
    var _this;

    _classCallCheck(this, Table);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Table).call(this));

    _this.handleGetTableBulkActions = function (_ref) {
      var allSelected = _ref.allSelected,
          checked = _ref.checked,
          clearSelection = _ref.clearSelection,
          pageSize = _ref.pageSize,
          query = _ref.query,
          selectedCount = _ref.selectedCount,
          selection = _ref.selection,
          totalResults = _ref.totalResults;
      var _this$props = _this.props,
          editableCount = _this$props.editableCount,
          isCrmObject = _this$props.isCrmObject,
          objectType = _this$props.objectType,
          view = _this$props.view,
          pipelineId = _this$props.pipelineId;
      var selectionCount = allSelected ? totalResults : selectedCount;
      var viewWithPipeline = view.updateIn(['state', 'pipelineId'], function (currentPipeline) {
        return currentPipeline || pipelineId;
      });
      var tableBulkActionProps = BulkActionPropsRecord({
        allSelected: allSelected,
        checked: checked,
        clearSelection: clearSelection,
        numEditable: editableCount,
        objectType: objectType,
        pageSize: pageSize,
        query: query,
        selection: selection,
        selectionCount: selectionCount,
        totalRecords: totalResults,
        view: viewWithPipeline,
        viewId: view.id,
        pipelineId: pipelineId
      });
      var bulkActions = getBulkActionsByType(objectType);
      var bulkMoreDropdownActions = getMoreDropdownActionsByType(objectType);
      return /*#__PURE__*/_jsx(BulkActionsContainer, {
        bulkActionProps: tableBulkActionProps,
        bulkActions: bulkActions,
        bulkMoreDropdownActions: bulkMoreDropdownActions,
        isCrmObject: isCrmObject
      });
    };

    _this.handleReorderColumns = function (newColumns) {
      var onUpdateColumns = _this.props.onUpdateColumns;
      return onUpdateColumns(newColumns);
    };

    _this.handleAssignContact = function (objectType, subjectId, _prompt, _callback) {
      var bulkActionProps = BulkActionPropsRecord({
        objectType: objectType,
        checked: ImmutableSet([subjectId]),
        allSelected: false,
        selectionCount: 1
      });
      return BulkAssignToPrompt({
        bulkActionProps: bulkActionProps
      }, _prompt, _callback);
    };

    _this.handleTogglePreviewSidebar = function (subjectId) {
      var _this$props2 = _this.props,
          objectType = _this$props2.objectType,
          onTogglePreviewSidebar = _this$props2.onTogglePreviewSidebar;
      return onTogglePreviewSidebar(subjectId, objectType);
    };

    _this.handleLoadingFinish = function () {
      var setSearching = _this.props.setSearching;
      setSearching(false);
    };

    _this.state = {
      draftState: null
    };
    _this.actions = ImmutableMap({
      onAssignContact: _this.handleAssignContact,
      onReorder: _this.handleReorderColumns,
      onToggleSidebar: _this.handleTogglePreviewSidebar
    });
    return _this;
  }

  _createClass(Table, [{
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          checked = _this$props3.checked,
          isCrmObject = _this$props3.isCrmObject,
          isSearching = _this$props3.isSearching,
          objectType = _this$props3.objectType,
          pipelineId = _this$props3.pipelineId,
          query = _this$props3.query,
          view = _this$props3.view;
      return /*#__PURE__*/_jsxs(_Fragment, {
        children: [isSearching && /*#__PURE__*/_jsx(UILoadingOverlay, {
          contextual: true,
          "data-reason": "Table: searching"
        }), /*#__PURE__*/_jsx(ViewDataGridContainer, {
          actions: this.actions,
          bulkActionProps: BulkActionPropsRecord({
            checked: checked,
            objectType: objectType,
            query: query,
            view: view,
            viewId: view.id
          }),
          getTableBulkActions: this.handleGetTableBulkActions,
          ignoreViewPipeline: true,
          isCrmObject: isCrmObject // HACK: This key is required to prevent stale columns from persisting
          // when the object type is switched.
          // PR with more info: https://git.hubteam.com/HubSpot/CRM/pull/19656
          ,
          maxHeight: MAX_TABLE_HEIGHT,
          objectType: objectType,
          onLoadingFinish: this.handleLoadingFinish,
          pipelineId: pipelineId,
          queryParams: query,
          RhumbMarkerSuccess: /*#__PURE__*/_jsx(NavMarker, {
            name: "DATA_TABLE_LOADED"
          }),
          RhumbMarkerEmpty: /*#__PURE__*/_jsx(NavMarker, {
            name: "GRID_EMPTY_STATE"
          }),
          RhumbMarkerError: /*#__PURE__*/_jsx(NavMarker, {
            name: "TABLE_ERROR"
          }),
          viewId: "" + view.id
        }, objectType)]
      });
    }
  }]);

  return Table;
}(PureComponent);
var dependencies = {
  checked: {
    stores: [GridUIStore],
    deref: function deref(_ref2) {
      var objectId = _ref2.objectId;
      return GridUIStore.get('checked', objectId);
    }
  },
  editableCount: {
    stores: [GridUIStore, GridViewSelectionEditableCountStore, ViewsStore],
    deref: function deref(props) {
      var objectType = props.objectType,
          view = props.view;
      var allSelected = GridUIStore.get('allSelected');
      var key = ImmutableMap({
        objectType: objectType,
        filters: view.filters
      });
      return allSelected && view ? GridViewSelectionEditableCountStore.get(key) : undefined;
    }
  }
};
Table.propTypes = {
  checked: ImmutablePropTypes.set,
  editableCount: PropTypes.number,
  isCrmObject: PropTypes.bool.isRequired,
  isSearching: PropTypes.bool,
  objectType: AnyCrmObjectTypePropType.isRequired,
  onTogglePreviewSidebar: PropTypes.func.isRequired,
  onUpdateColumns: PropTypes.func.isRequired,
  pipelineId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  query: PropTypes.object,
  setSearching: PropTypes.func,
  view: ViewType.isRequired
};
Table.defaultProps = {
  query: {}
};
export default connect(dependencies)(Table);