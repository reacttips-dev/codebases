'use es6';

var createBaseColumnFromProperty = function createBaseColumnFromProperty(property) {
  if (!property) {
    return {};
  }

  return {
    name: property.name,
    label: property.label,
    type: property.type,
    showCurrencySymbol: property.showCurrencySymbol,
    property: property
  };
};

var createColumnFromProperty = function createColumnFromProperty(columnData) {
  return createBaseColumnFromProperty(columnData);
};

var reorderColumns = function reorderColumns(columns) {
  var nextIndex = 0;
  return columns.map(function (column) {
    if (Math.abs(column.order) === Infinity) {
      return column;
    }

    return Object.assign({}, column, {
      order: ++nextIndex
    });
  });
};

var ColumnUtils = {
  createBaseColumnFromProperty: createBaseColumnFromProperty,
  createColumnFromProperty: createColumnFromProperty,
  reorderColumns: reorderColumns
};
export default ColumnUtils;