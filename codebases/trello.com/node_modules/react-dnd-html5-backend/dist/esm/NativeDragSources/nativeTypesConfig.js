var _nativeTypesConfig;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import * as NativeTypes from '../NativeTypes';
import { getDataFromDataTransfer } from './getDataFromDataTransfer';
export var nativeTypesConfig = (_nativeTypesConfig = {}, _defineProperty(_nativeTypesConfig, NativeTypes.FILE, {
  exposeProperties: {
    files: function files(dataTransfer) {
      return Array.prototype.slice.call(dataTransfer.files);
    },
    items: function items(dataTransfer) {
      return dataTransfer.items;
    }
  },
  matchesTypes: ['Files']
}), _defineProperty(_nativeTypesConfig, NativeTypes.HTML, {
  exposeProperties: {
    html: function html(dataTransfer, matchesTypes) {
      return getDataFromDataTransfer(dataTransfer, matchesTypes, '');
    }
  },
  matchesTypes: ['Html', 'text/html']
}), _defineProperty(_nativeTypesConfig, NativeTypes.URL, {
  exposeProperties: {
    urls: function urls(dataTransfer, matchesTypes) {
      return getDataFromDataTransfer(dataTransfer, matchesTypes, '').split('\n');
    }
  },
  matchesTypes: ['Url', 'text/uri-list']
}), _defineProperty(_nativeTypesConfig, NativeTypes.TEXT, {
  exposeProperties: {
    text: function text(dataTransfer, matchesTypes) {
      return getDataFromDataTransfer(dataTransfer, matchesTypes, '');
    }
  },
  matchesTypes: ['Text', 'text/plain']
}), _nativeTypesConfig);