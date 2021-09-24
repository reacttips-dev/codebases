'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { DEFAULT_COLUMN_WIDTH } from 'customer-data-table/constants/ColumnConstants';
import { Map as ImmutableMap } from 'immutable';
import { getObjectType } from 'customer-data-objects/model/ImmutableModel';
import { getProperty } from 'customer-data-objects/record/ObjectRecordAccessors';
import { propertyLabelTranslator } from 'property-translator/propertyTranslator';
import ColumnRecord from './ColumnRecord';
import ResolvedCurrencyCell from 'customer-data-table/cells/ResolvedCurrencyCell';
import get from 'transmute/get';
export default (function () {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _params$UNSAFE_flexWi = params.UNSAFE_flexWidth,
      UNSAFE_flexWidth = _params$UNSAFE_flexWi === void 0 ? false : _params$UNSAFE_flexWi,
      property = params.property,
      order = params.order,
      _params$width = params.width,
      width = _params$width === void 0 ? DEFAULT_COLUMN_WIDTH : _params$width,
      Cell = params.Cell,
      Header = params.Header,
      accessor = params.accessor,
      rest = _objectWithoutProperties(params, ["UNSAFE_flexWidth", "property", "order", "width", "Cell", "Header", "accessor"]);

  var name = get('name', property);
  var label = get('label', property) || '--';
  var hubspotDefined = get('hubspotDefined', property);

  var getCurrencyProperty = function getCurrencyProperty(record) {
    return getProperty(record, get('currencyPropertyName', property));
  };

  var defaultAccessor = function defaultAccessor(record) {
    return ImmutableMap({
      amount: getProperty(record, name),
      recordCurrency: getCurrencyProperty(record),
      objectType: getObjectType(record)
    });
  };

  var CellComponent = Cell || ResolvedCurrencyCell;
  return ColumnRecord(Object.assign({}, rest, {
    Header: Header || (hubspotDefined ? propertyLabelTranslator(label) : label),
    id: name,
    order: order,
    width: UNSAFE_flexWidth ? undefined : width,
    accessor: accessor || defaultAccessor,
    style: {
      justifyContent: 'flex-end'
    },
    Cell: CellComponent
  }));
});