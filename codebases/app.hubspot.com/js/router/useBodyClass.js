'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _typeToClassMap;

import { CONTACT, COMPANY, DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import { useEffect } from 'react';
var typeToClassMap = (_typeToClassMap = {}, _defineProperty(_typeToClassMap, CONTACT, 'contacts'), _defineProperty(_typeToClassMap, COMPANY, 'companies'), _defineProperty(_typeToClassMap, DEAL, 'deals'), _defineProperty(_typeToClassMap, TICKET, 'tickets'), _typeToClassMap);
export function useBodyClass(objectType) {
  useEffect(function () {
    document.body.classList.add(typeToClassMap[objectType]);
  }, [objectType]);
}