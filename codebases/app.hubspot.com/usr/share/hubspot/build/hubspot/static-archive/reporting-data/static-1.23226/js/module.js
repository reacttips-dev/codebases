'use es6';

import * as DataSources from './constants/dataSources';
import * as DataTypes from './constants/dataTypes';
import * as checked from './lib/checked';
var DataSource = checked.symbol(DataSources, 'DataSource');
var DataType = checked.symbol(DataTypes, 'DataType');
export var Module = checked.record({
  dataSource: DataSource,
  dataType: DataType.optional(),
  use: checked.any(),
  references: checked.any().fromJS(),
  handleError: checked.any(),
  // unified spec
  getUnifiedSpecForConfig: checked.func().optional(),
  // Specific to inbounddb as of now
  getInboundSpec: checked.func().optional(),
  referenceProperties: checked.any().optional(),
  search: checked.any().optional(),
  hydrate: checked.any().optional()
}, 'Module');
export var InboundDbModule = function InboundDbModule(object) {
  return Module(Object.assign({
    dataSource: DataSources.INBOUNDDB
  }, object));
};
export var UnifiedModule = function UnifiedModule(object) {
  return Module(Object.assign({
    dataSource: DataSources.UNIFIED
  }, object));
};
export var CustomModule = function CustomModule(object) {
  return Module(Object.assign({
    dataSource: DataSources.CUSTOM
  }, object));
};