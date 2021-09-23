'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { COMPANY, CONTACT } from 'customer-data-objects/constants/ObjectTypes';
import { List } from 'immutable';
import { TABLE_ACTIONS } from './tableReducer';
import { isGenericAssociation } from '../associations/utils/isGenericAssociation';
import { getColumnForProperty } from '../tableFunctions';
import { objectRecords } from 'customer-data-table/constants/ObjectTypes';
import { propertyLabelTranslator } from 'property-translator/propertyTranslator';
import { useCallback, useEffect, useState } from 'react';
import AssociationCell from 'customer-data-table/cells/AssociationCell';
import CompanyRecord from 'customer-data-objects/company/CompanyRecord';
import ContactRecord from 'customer-data-objects/contact/ContactRecord';
import DealRecord from 'customer-data-objects/deal/DealRecord';
import QuoteRecord from 'customer-data-objects/quote/QuoteRecord';
import Raven from 'Raven';
import TaskRecord from 'customer-data-objects/task/TaskRecord';
import TicketRecord from 'customer-data-objects/ticket/TicketRecord';
import always from 'transmute/always';
import associationColumn from 'customer-data-table/columns/associationColumn';
import avatarColumn from '../columns/avatarColumn';
import devLogger from 'react-utils/devLogger';
import emptyFunction from 'react-utils/emptyFunction';
import get from 'transmute/get';
import isEmpty from 'transmute/isEmpty';
import memoize from 'transmute/memoize';
import protocol from 'transmute/protocol';
import genericAssociationColumn from '../columns/genericAssociationColumn';
export var getLabelColumnFromObjectType = memoize(function (objectType, props) {
  var noColumn = always(undefined);
  var objectRecord = objectRecords[objectType];
  var getLabelColumn = protocol({
    name: 'getLabelColumn',
    args: [protocol.TYPE],
    fallback: function fallback() {
      devLogger.warn({
        message: "Missing column for objectType: " + objectType
      });
      return noColumn();
    }
  });
  getLabelColumn.implement(CompanyRecord, function () {
    return avatarColumn(Object.assign({}, props, {
      order: 0,
      draggable: false,
      objectType: COMPANY
    }));
  });
  getLabelColumn.implement(ContactRecord, function () {
    return avatarColumn(Object.assign({}, props, {
      order: 0,
      draggable: false,
      objectType: CONTACT
    }));
  });
  getLabelColumn.implement(DealRecord, noColumn);
  getLabelColumn.implement(TicketRecord, noColumn);
  getLabelColumn.implement(QuoteRecord, noColumn);
  getLabelColumn.implement(TaskRecord, noColumn);
  var labelColumn = getLabelColumn(objectRecord);
  return labelColumn;
});
export var getColumnRecord = memoize(function (column, objectProperties) {
  var getColumnProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : emptyFunction;
  var objectType = arguments.length > 3 ? arguments[3] : undefined;
  var getIsUngated = arguments.length > 4 ? arguments[4] : undefined;
  var restrictedProperties = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : new List();
  var columnName = get('name', column);
  var order = get('order', column);
  var sortable = get('sortable', column);
  var property = get(columnName, objectProperties); // HACK: For more info see: https://git.hubteam.com/HubSpot/customer-data-table/pull/341

  var UNSAFE_flexWidth = get('UNSAFE_flexWidth', column);
  var width = get('width', column);
  var isRestrictedProperty = restrictedProperties.includes(columnName);
  var options = {
    UNSAFE_flexWidth: UNSAFE_flexWidth,
    getColumnProps: getColumnProps,
    name: columnName,
    objectType: objectType,
    order: order,
    property: property,
    sortable: sortable,
    width: width,
    getIsUngated: getIsUngated,
    isRestrictedProperty: isRestrictedProperty
  };

  if (property) {
    return getColumnForProperty(options);
  }

  if (isGenericAssociation(columnName)) {
    return genericAssociationColumn(Object.assign({
      associationDefinition: get('associationDefinition', column),
      label: get('label', column)
    }, options));
  }

  if (columnName === 'relatesTo') {
    return associationColumn(Object.assign({}, options, {
      Cell: AssociationCell,
      Header: propertyLabelTranslator('Associated With'),
      // hard-coded, HubSpot-defined
      accessor: function accessor(record) {
        return get('associations', record);
      },
      id: 'relatesTo',
      sortable: false
    }));
  }

  if (columnName === 'relatesToCompany') {
    return associationColumn(Object.assign({}, options, {
      Cell: AssociationCell,
      Header: propertyLabelTranslator('Associated Company'),
      // hard-coded, HubSpot-defined
      accessor: function accessor(record) {
        return get('associations', record);
      },
      id: 'relatesToCompany',
      objectType: COMPANY,
      sortable: false
    }));
  }

  if (columnName === 'relatesToContact') {
    return associationColumn(Object.assign({}, options, {
      Cell: AssociationCell,
      Header: propertyLabelTranslator('Associated Contacts'),
      // hard-coded, HubSpot-defined
      accessor: function accessor(record) {
        return get('associations', record);
      },
      id: 'relatesToContact',
      objectType: CONTACT,
      sortable: false
    }));
  }

  return null;
});
export var usePropertyColumns = function usePropertyColumns(_ref) {
  var objectProperties = _ref.objectProperties,
      objectType = _ref.objectType,
      dispatcher = _ref.dispatcher,
      columns = _ref.columns,
      _ref$getColumnProps = _ref.getColumnProps,
      getColumnProps = _ref$getColumnProps === void 0 ? emptyFunction : _ref$getColumnProps,
      propertyColumnNamesList = _ref.propertyColumns,
      restrictedProperties = _ref.restrictedProperties,
      columnWidths = _ref.columnWidths,
      minColumnWidth = _ref.minColumnWidth,
      columnsProp = _ref.columnsProp,
      _labelColumn = _ref.labelColumn,
      getIsUngated = _ref.getIsUngated;

  if (!objectProperties) {
    devLogger.warn('usePropertyColumns requires objectProperties');
    Raven.captureException('usePropertyColumns requires objectProperties', {
      extra: {
        columns: columns,
        propertyColumns: propertyColumnNamesList
      }
    });
  }

  var _useState = useState(function () {
    return function (column) {
      return getColumnRecord(column, objectProperties, getColumnProps, objectType, getIsUngated, restrictedProperties);
    };
  }),
      _useState2 = _slicedToArray(_useState, 2),
      createColumnRecord = _useState2[0],
      setCreateColumnRecord = _useState2[1];

  useEffect(function () {
    return setCreateColumnRecord(function () {
      return function (column) {
        return getColumnRecord(column, objectProperties, getColumnProps, objectType, getIsUngated, restrictedProperties);
      };
    });
  }, [objectProperties, objectType, getColumnProps, getIsUngated, restrictedProperties]);

  var _useState3 = useState(List(propertyColumnNamesList.map(createColumnRecord)).filter(Boolean)),
      _useState4 = _slicedToArray(_useState3, 1),
      propertyColumns = _useState4[0];

  useEffect(function () {
    if (!isEmpty(columns) && propertyColumnNamesList) {
      var uniqueColumnNames = [];
      var changedColumns = propertyColumnNamesList.reduce(function (acc, _propertyColumn) {
        var name = _propertyColumn.get('name'); // HACK: https://git.hubteam.com/HubSpot/customer-data-table/pull/233


        if (uniqueColumnNames.includes(name)) {
          return acc;
        } else {
          uniqueColumnNames.push(name);
        }

        var existingColumn = columns.find(function (c) {
          return c && c.get('id') === name;
        });
        var hasNewColumnOrder = existingColumn && _propertyColumn.get('order') !== existingColumn.get('order');

        if ((!existingColumn || hasNewColumnOrder) && name !== 'name') {
          var newColumn = createColumnRecord(_propertyColumn);

          if (existingColumn) {
            newColumn = newColumn.set('width', existingColumn.get('width'));
          }

          if (newColumn) {
            return acc.push(newColumn);
          }
        }

        return acc;
      }, List());

      if (changedColumns.count() > 0) {
        dispatcher({
          type: TABLE_ACTIONS.UPDATE,
          value: changedColumns
        });
      }
    }
  }, [columns, createColumnRecord, dispatcher, propertyColumnNamesList]);
  var labelColumnFromObjectType = useCallback(getLabelColumnFromObjectType(objectType, getColumnProps('label')), [objectType]);
  var labelColumn = _labelColumn === undefined ? labelColumnFromObjectType : _labelColumn;
  useEffect(function () {
    dispatcher({
      type: TABLE_ACTIONS.INITIALIZE,
      value: {
        widths: columnWidths,
        minColumnWidth: minColumnWidth,
        columns: propertyColumns,
        labelColumn: labelColumn
      }
    });
  }, [minColumnWidth, columnWidths, dispatcher, labelColumn, propertyColumns]);
  useEffect(function () {
    if (propertyColumnNamesList && (propertyColumnNamesList.size || !columnsProp.isEmpty()) && !columns.isEmpty()) {
      var columnsToRemove = columns.reduce(function (acc, column) {
        var id = column.get('id');

        if (id !== '_selector' && id !== 'name' && !propertyColumnNamesList.find(function (x) {
          return x.get('name') === id;
        }) && !columnsProp.find(function (x) {
          return x.get('id') === id;
        })) {
          return acc.push(id);
        }

        return acc;
      }, List());

      if (!columnsToRemove.isEmpty()) {
        dispatcher({
          type: TABLE_ACTIONS.REMOVE,
          value: columnsToRemove
        });
      }
    }
  }, [columnWidths, columns, columnsProp, dispatcher, labelColumn, propertyColumnNamesList, propertyColumns]);
};