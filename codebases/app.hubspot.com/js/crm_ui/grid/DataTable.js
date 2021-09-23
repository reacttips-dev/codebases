'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import * as ObjectRecordAccessors from 'customer-data-objects/record/ObjectRecordAccessors';
import { CONTACT, COMPANY, DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import { CrmLogger } from 'customer-data-tracking/loggers';
import { DEMO_FILTER_LIST, hasUnmodifiedFilter } from './filterMessageHelpers';
import { INDEX } from 'customer-data-objects/view/PageTypes';
import { Map as ImmutableMap, fromJS } from 'immutable';
import { OWNER } from 'customer-data-objects/property/ExternalOptionTypes';
import { canEdit } from '../utils/SubjectPermissions';
import { connect } from 'general-store';
import CustomerDataTable from 'customer-data-table';
import DataTableFooterContent from './DataTableFooterContent';
import DataTablePaginator from './DataTablePaginator';
import ElasticSearchErrorMessage, { getErrorMessageType } from '../error/ElasticSearchErrorMessage';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { AnyCrmObjectTypePropType } from 'customer-data-objects-ui-components/propTypes/CrmObjectTypes';
import QueryEmptyStateMessage from '../messaging/QueryEmptyStateMessage';
import QueryErrorStateMessage from '../messaging/QueryErrorStateMessage';
import PropTypes from 'prop-types';
import { Fragment, PureComponent } from 'react';
import UIColumnSpreads from 'UIComponents/column/UIColumnSpreads';
import always from 'transmute/always';
import debounce from 'transmute/debounce';
import emptyFunction from 'react-utils/emptyFunction';
import get from 'transmute/get';
import getIn from 'transmute/getIn';
import isNumber from 'transmute/isNumber';
import logGridRenderTiming from '../utils/logGridRenderTiming';
import { isWordPress } from 'hubspot-plugin-common';
import IsUngatedStore from 'crm_data/gates/IsUngatedStore';
import withGateOverride from 'crm_data/gates/withGateOverride';
import { getPropertyPermissionDependency, isEditable } from '../property/fieldLevelPermissionsUIDependencies';
import { MARKETING_EVENT_TYPE_ID, CALL_TYPE_ID, INVOICE_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import Raven from 'Raven';
import memoize from 'transmute/memoize';
import enviro from 'enviro';
import { isBETPortal as getIsBETPortal } from 'crm_data/BET/permissions/DealPermissions';
import ScopesContainer from '../../containers/ScopesContainer';
import { getAsSet } from '../../containers/ScopeOperators';
export var checkCanEditOwnerProperty = function checkCanEditOwnerProperty(_ref) {
  var getPropertyPermission = _ref.getPropertyPermission,
      subject = _ref.subject,
      isBETPortal = _ref.isBETPortal;
  // TODO: This breaks for custom objects, which do not always have a hubspot_owner_id property. We should
  // fix this to consume the property being tested.
  var canEditOwnerProperty = isEditable(getPropertyPermission('hubspot_owner_id')); // TODO: When everything is on the rewrite, we should derive these permissions from graphql as the FE-only
  // permission calculation is wrong and outdated.

  var canEditObject = canEdit(subject);
  return canEditOwnerProperty && canEditObject && !isBETPortal;
};
var sendEmptyColumnSentry = memoize(function (objectType) {
  Raven.captureMessage('Table columns were empty', {
    extra: {
      objectType: objectType
    }
  });
});
var sendClickhandlerSentry = memoize(function (objectType) {
  if (enviro.isQa()) {
    console.error("A clickhandler was defined for legacy standard object " + objectType + ".\nThis object must not have a clickhandler defined in this code.\nSee https://git.hubteam.com/HubSpot/Critsit/issues/1704\n      ");
  }

  Raven.captureMessage("Clickhandler was defined for legacy standard object", {
    extra: {
      objectType: objectType
    }
  });
});
var SIZES = [25, 50, 100];
export var isAssignContactAvailable = function isAssignContactAvailable(onAssignContact, objectType) {
  return Boolean(onAssignContact && typeof onAssignContact === 'function' && [CONTACT, COMPANY, DEAL, TICKET].includes(objectType));
}; // This is only for logging what size columns are being used so it only runs after 30 seconds

export var _logColumnSizes = function _logColumnSizes(objectType, sizes) {
  sizes.map(function (column) {
    return CrmLogger.logIndexInteraction(objectType, {
      action: 'table-column-widths',
      subAction: column.id,
      count: column.value
    });
  });
};
var logColumnSizes = debounce(30000, _logColumnSizes);
export var DataTable = /*#__PURE__*/function (_PureComponent) {
  _inherits(DataTable, _PureComponent);

  function DataTable(props) {
    var _this;

    _classCallCheck(this, DataTable);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DataTable).call(this, props));

    _this.handlePageChange = function (pageIndex) {
      _this.props.onPageChange({
        target: {
          value: Number(pageIndex) + 1
        }
      });
    };

    _this.handleSortedChange = function (newSorted, column
    /* , shiftKey */
    ) {
      var id = get('id', column);
      var desc = fromJS(newSorted).find(function (x) {
        return get('id', x) === id;
      }).get('desc');
      CrmLogger.log('indexInteractions', {
        action: 'sorted table by column',
        property: id,
        subAction: desc ? 'DESCENDING' : 'ASCENDING'
      });

      _this.props.onChangeSort({
        direction: desc ? 1 : -1,
        sortColumnName: id,
        sortKey: id
      });
    };

    _this.handlePageSizeChange = function (pageSize) {
      _this.props.onChangeRows(pageSize);

      _this.handlePageChange(0);
    };

    _this.handleEmptyState = function () {
      var _this$props = _this.props,
          RhumbMarkerEmpty = _this$props.RhumbMarkerEmpty,
          objectType = _this$props.objectType,
          hasFilters = _this$props.hasFilters,
          query = _this$props.query,
          viewId = _this$props.viewId;

      if (hasUnmodifiedFilter(_this.props) && Array.from(DEMO_FILTER_LIST).includes(viewId)) {
        return null;
      }

      return /*#__PURE__*/_jsxs(UIColumnSpreads, {
        className: "overflow-x-hidden",
        children: [RhumbMarkerEmpty, /*#__PURE__*/_jsx(QueryEmptyStateMessage, {
          hasFilters: hasFilters,
          objectType: objectType,
          pageType: INDEX,
          query: query,
          viewId: viewId
        })]
      }, "grid");
    };

    _this.handlePreviewClick = function (id) {
      var onToggleSidebar = getIn(['actions', 'onToggleSidebar'], _this.props);

      if (id) {
        onToggleSidebar(id);
      }
    };

    _this.handleAssignContact = function (id) {
      var onAssignContact = getIn(['actions', 'onAssignContact'], _this.props);
      onAssignContact(_this.props.objectType, id);
      CrmLogger.log('indexInteractions', {
        action: 'clicked on owner to assign'
      });
    };

    _this.handleMoveItem = function (item) {
      var objectType = _this.props.objectType;
      CrmLogger.logIndexInteraction(objectType, {
        action: 'reordered table columns',
        subAction: item
      });
    };

    _this.handleResize = function (sizes) {
      var objectType = _this.props.objectType; // "resized table columns" logs when a user resizes any column and only captures the usage of resizing
      // "logColumnSizes" logs each column and the width

      CrmLogger.log('indexInteractions', {
        action: 'resized table columns'
      });
      logColumnSizes(objectType, sizes);
    };

    _this.getCanEditOwnerProperty = function (subject) {
      var getPropertyPermission = _this.props.getPropertyPermission;
      var isBETPortal = _this.state.isBETPortal;
      return checkCanEditOwnerProperty({
        getPropertyPermission: getPropertyPermission,
        isBETPortal: isBETPortal,
        subject: subject
      });
    };

    _this.getCustomCellClickHandler = function () {
      var objectType = _this.props.objectType;

      switch (objectType) {
        // These object types don't support a record page yet, so they can only be previewed
        case INVOICE_TYPE_ID:
        case MARKETING_EVENT_TYPE_ID:
          {
            return _this.handlePreviewClick;
          }
        // HACK: Explicitly return undefined to not override callback
        // for legacy standard objects

        case CALL_TYPE_ID:
        case CONTACT:
        case COMPANY:
        case DEAL:
        case TICKET:
        default:
          {
            return undefined;
          }
      }
    };

    _this.state = {
      isBETPortal: getIsBETPortal(getAsSet(ScopesContainer.get()))
    };
    _this.getColumnProps = _this.getColumnProps.bind(_assertThisInitialized(_this));
    _this.getTdProps = _this.getTdProps.bind(_assertThisInitialized(_this));
    _this.getTheadThPropsForColumn = _this.getTheadThPropsForColumn.bind(_assertThisInitialized(_this));
    _this.getTrProps = _this.getTrProps.bind(_assertThisInitialized(_this));
    _this.logSentryIfColumnsEmpty = _this.logSentryIfColumnsEmpty.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(DataTable, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var objectType = this.props.objectType;
      CrmLogger.log('indexUsage', {
        action: 'use DataTable',
        objectType: objectType
      });
      logGridRenderTiming();
      this.logSentryIfColumnsEmpty();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.logSentryIfColumnsEmpty();
    }
  }, {
    key: "logSentryIfColumnsEmpty",
    value: function logSentryIfColumnsEmpty() {
      var _this$props2 = this.props,
          objectType = _this$props2.objectType,
          viewColumns = _this$props2.viewColumns;

      if (viewColumns.isEmpty()) {
        sendEmptyColumnSentry(objectType);
      }
    }
  }, {
    key: "getColumnProps",
    value: function getColumnProps(columnName) {
      var _propsByName;

      var _this$props3 = this.props,
          objectType = _this$props3.objectType,
          actions = _this$props3.actions; // HACK: Clickhandler MUST be undefined for legacy standard objects

      var handleLabelClick = this.getCustomCellClickHandler();

      if ([CONTACT, COMPANY, DEAL, TICKET].includes(objectType) && handleLabelClick) {
        sendClickhandlerSentry(objectType);
      }

      var propsByName = (_propsByName = {
        email: {
          extraCellProps: {
            external: isWordPress
          }
        },
        label: {
          onPreviewClick: this.handlePreviewClick,
          onAssignContact: this.handleAssignContact,
          showPreviewButton: true,
          // moving these to extraCellProps to reflect changes to the getColumnProps API in customer-data-table
          // these props are not used on the column, only in the cell, so they should be in extraCellProps
          // leaving the above in place for now to make sure the transition is smooth
          extraCellProps: {
            onPreviewClick: this.handlePreviewClick,
            onAssignContact: this.handleAssignContact,
            onCellClick: this.getCustomCellClickHandler(),
            showPreviewButton: true
          }
        }
      }, _defineProperty(_propsByName, OWNER, {
        canEdit: this.getCanEditOwnerProperty,
        onAssignContact: isAssignContactAvailable(get('onAssignContact', actions), this.props.objectType) ? this.handleAssignContact : emptyFunction,
        extraCellProps: {
          canEdit: canEdit,
          onAssignContact: isAssignContactAvailable(get('onAssignContact', actions), this.props.objectType) ? this.handleAssignContact : emptyFunction
        }
      }), _defineProperty(_propsByName, "hubspot_owner_id", {
        extraCellProps: {
          canEdit: this.getCanEditOwnerProperty,
          onAssignContact: isAssignContactAvailable(get('onAssignContact', actions), this.props.objectType) ? this.handleAssignContact : emptyFunction
        }
      }), _propsByName);
      return propsByName[columnName];
    }
  }, {
    key: "getTdProps",
    value: function getTdProps(__state, __rowInfo, column) {
      var objectType = this.props.objectType;
      return {
        'data-onboarding': objectType === CONTACT && column.id === 'name' ? 'contact-name-cell' : undefined
      };
    }
  }, {
    key: "getTheadThPropsForColumn",
    value: function getTheadThPropsForColumn(column) {
      var _this$props4 = this.props,
          objectType = _this$props4.objectType,
          viewSortKey = _this$props4.viewSortKey,
          viewSortDirection = _this$props4.viewSortDirection; // Adding conditionally data attribute for coaching tips
      // Only adds if it's contact page and the header name

      var dataCoachingTips = Object.assign({}, objectType === CONTACT && column.id === 'name' && {
        'data-coaching-tips': 'header-name'
      });
      var isSortedColumn = viewSortKey === column.id;
      return Object.assign({
        'data-onboarding': objectType === CONTACT ? "crm-table-header-cell-" + column.id : undefined,
        'data-selenium-id': "crm-table-header-cell-" + column.id,
        'data-test-sorted': isSortedColumn,
        'data-test-sort-direction': viewSortDirection
      }, dataCoachingTips);
    }
  }, {
    key: "getTrProps",
    value: function getTrProps(__state, rowInfo, __column) {
      var objectId = ObjectRecordAccessors.getId(rowInfo.original);
      return {
        'data-selenium-id': objectId
      };
    }
  }, {
    key: "renderError",
    value: function renderError() {
      var _this$props5 = this.props,
          objectType = _this$props5.objectType,
          error = _this$props5.error;
      var errorMessageType = getErrorMessageType(error) || objectType;

      var _ref2 = error.status === 400 ? ElasticSearchErrorMessage(error) : {},
          subtext = _ref2.subtext;

      return /*#__PURE__*/_jsx(QueryErrorStateMessage, {
        errorMessageType: errorMessageType,
        objectType: objectType,
        translatedSubtext: subtext
      });
    }
  }, {
    key: "renderEmptyPagination",
    value: function renderEmptyPagination() {
      return null;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props6 = this.props,
          actions = _this$props6.actions,
          allSelected = _this$props6.allSelected,
          currentPage = _this$props6.currentPage,
          data = _this$props6.data,
          error = _this$props6.error,
          hidePagination = _this$props6.hidePagination,
          isLoading = _this$props6.isLoading,
          getIsUngated = _this$props6.getIsUngated,
          getTableBulkActions = _this$props6.getTableBulkActions,
          hasFilters = _this$props6.hasFilters,
          maxHeight = _this$props6.maxHeight,
          objectType = _this$props6.objectType,
          onSelectAllChange = _this$props6.onSelectAllChange,
          pageSize = _this$props6.pageSize,
          properties = _this$props6.properties,
          RhumbMarkerSuccess = _this$props6.RhumbMarkerSuccess,
          query = _this$props6.query,
          totalResults = _this$props6.totalResults,
          viewColumns = _this$props6.viewColumns,
          viewId = _this$props6.viewId,
          viewSortDirection = _this$props6.viewSortDirection,
          viewSortKey = _this$props6.viewSortKey,
          getPropertyPermission = _this$props6.getPropertyPermission;
      var loading = isLoading || !isNumber(totalResults);
      var pageCount = Math.ceil(totalResults / pageSize);

      if (error) {
        return this.renderError();
      }

      return /*#__PURE__*/_jsxs(Fragment, {
        children: [!loading && data && data.size ? RhumbMarkerSuccess : null, /*#__PURE__*/_jsx(CustomerDataTable, {
          getIsUngated: getIsUngated,
          objectProperties: properties,
          objectType: objectType,
          allSelected: allSelected,
          data: data,
          defaultSortDesc: true,
          draggable: true,
          getBulkActions: getTableBulkActions,
          getColumnProps: this.getColumnProps,
          getTheadThPropsForColumn: this.getTheadThPropsForColumn,
          getTableProps: always({
            'data-onboarding': 'grid-table',
            'data-selenium-info': loading ? 'loading' : 'loaded',
            'data-selenium-test': 'data-table',
            condensed: true,
            moreCondensed: true,
            condensedFooter: true,
            maxHeight: maxHeight
          }),
          getTdProps: this.getTdProps,
          getTrProps: this.getTrProps,
          id: "data-table-" + objectType + "-" + viewId,
          loading: loading,
          manual: true,
          onMoveItem: this.handleMoveItem,
          onPageChange: this.handlePageChange,
          onPageSizeChange: this.handlePageSizeChange,
          onReorder: get('onReorder', actions),
          onResize: this.handleResize,
          onSelectAllChange: onSelectAllChange,
          onSortedChange: this.handleSortedChange,
          page: currentPage,
          pages: pageCount,
          pageSize: Number(pageSize),
          pageSizeOptions: SIZES,
          propertyColumns: viewColumns,
          query: query,
          renderEmptyState: this.handleEmptyState,
          resizable: true,
          sortDirection: viewSortDirection,
          sortKey: viewSortKey,
          totalResults: totalResults,
          useSelection: true,
          PaginationComponent: hidePagination ? this.renderEmptyPagination : DataTablePaginator // HACK: This prop is explicitly passed to trigger a rerender when getPropertyPermission updates.
          // Removing this *will* introduce a race condition between the FLP fetch and the table's initial render.
          // It is not required in the table, and can be removed when we switch to GQL to fetch property defs.
          ,
          getPropertyPermission: getPropertyPermission
        }, "data-table"), /*#__PURE__*/_jsx(DataTableFooterContent, {
          data: data,
          hasFilters: hasFilters,
          objectType: objectType,
          totalResults: totalResults
        })]
      });
    }
  }]);

  return DataTable;
}(PureComponent);
export var dependencies = {
  getPropertyPermission: getPropertyPermissionDependency,
  getIsUngated: {
    stores: [IsUngatedStore],
    deref: function deref() {
      return function (gate) {
        return withGateOverride(gate, IsUngatedStore.get(gate));
      };
    }
  }
};
DataTable.propTypes = {
  actions: ImmutablePropTypes.mapContains({
    onAssignContact: PropTypes.func.isRequired,
    onReorder: PropTypes.func.isRequired,
    onToggleSidebar: PropTypes.func.isRequired
  }).isRequired,
  allSelected: PropTypes.bool.isRequired,
  currentPage: PropTypes.number.isRequired,
  data: ImmutablePropTypes.list,
  error: PropTypes.shape({
    error: PropTypes.string,
    message: PropTypes.string,
    value: PropTypes.any,
    status: PropTypes.number
  }),
  getIsUngated: PropTypes.func.isRequired,
  getTableBulkActions: PropTypes.func.isRequired,
  getPropertyPermission: PropTypes.func.isRequired,
  hasFilters: PropTypes.bool,
  hidePagination: PropTypes.bool,
  isLoading: PropTypes.bool,
  maxHeight: PropTypes.string,
  objectType: AnyCrmObjectTypePropType.isRequired,
  onChangeRows: PropTypes.func.isRequired,
  onChangeSort: PropTypes.func.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onSelectAllChange: PropTypes.func,
  pageSize: PropTypes.number.isRequired,
  properties: ImmutablePropTypes.map.isRequired,
  RhumbMarkerEmpty: PropTypes.node,
  RhumbMarkerSuccess: PropTypes.node,
  query: PropTypes.string,
  totalResults: PropTypes.number,
  viewColumns: ImmutablePropTypes.listOf(ImmutablePropTypes.contains({
    name: PropTypes.string,
    order: PropTypes.number
  })),
  viewId: PropTypes.string.isRequired,
  viewSortDirection: PropTypes.oneOf([-1, 1]),
  viewSortKey: PropTypes.string
};
DataTable.defaultProps = {
  actions: ImmutableMap(),
  currentPage: 0,
  isLoading: false
};
export default connect(dependencies)(DataTable);