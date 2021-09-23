'use es6';

import { isReadOnly } from 'customer-data-objects/property/PropertyIdentifier';
import { AMOUNT, MARGIN, NAME, TERM, SKU, DISCOUNT, PRICE, QUANTITY, RECURRING_BILLING_FREQUENCY, UNIT_COST, ARR, MRR, ACV, TCV, ARR_MARGIN, MRR_MARGIN, ACV_MARGIN, TCV_MARGIN, TERM_IN_MONTHS, PRE_DISCOUNT_AMOUNT, TOTAL_DISCOUNT } from 'customer-data-objects/lineItem/PropertyNames';
import { DATE, DATE_TIME, ENUMERATION, NUMBER } from 'customer-data-objects/property/PropertyTypes';
var INPUT_CELL_PROPERTY_NAMES = [NAME, TERM]; // TEXT inputs are intentionally excluded below due to UI issues with spacing and content overflow

var INPUT_CELL_PROPERTY_TYPES = [DATE, DATE_TIME, ENUMERATION, NUMBER];
export var OEM_CALCULATION_PROPERTY_NAMES = [TERM_IN_MONTHS, AMOUNT, MARGIN, ARR, MRR, ACV, TCV, ARR_MARGIN, MRR_MARGIN, ACV_MARGIN, TCV_MARGIN, PRE_DISCOUNT_AMOUNT, TOTAL_DISCOUNT];
/**
 * Returns whether a given property should render as an input cell in LineItemEditorTable.
 * Input cells render LineItemInputCell in customer-data-table, otherwise we render
 * a standard read-only propertyColumn.
 *
 * We render inputs for all date, enums, and number properties, and for a few specific
 * properties by name.
 *
 * @param {PropertyRecord} property - The property to check for input
 * @return {Boolean} - True if property should render as input cell
 */

export function shouldRenderInputCell() {
  var property = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var isInputtable = INPUT_CELL_PROPERTY_NAMES.includes(property.name);
  var isInputtableType = !isReadOnly(property) && INPUT_CELL_PROPERTY_TYPES.includes(property.type);
  return isInputtable || isInputtableType;
}
export function isCalculationDependency(propertyName) {
  return [DISCOUNT, PRICE, QUANTITY, RECURRING_BILLING_FREQUENCY, TERM, UNIT_COST].includes(propertyName);
}
/**
 * @param {PropertyRecord} property - Property whose cell width to calculate
 * @return {number} - Cell width for given property
 */

export function getColumnWidth() {
  var property = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (property.name === NAME) {
    return 300;
  }

  if (property.name === DISCOUNT) {
    return 250;
  }

  if (property.name === SKU) {
    return 125;
  }

  if (property.name === TERM) {
    return 150;
  }

  switch (property.type) {
    case ENUMERATION:
      return 175;

    case NUMBER:
      return !isReadOnly(property) && property.showCurrencySymbol ? 175 : 125;

    case DATE:
      return 190;

    default:
      return 250;
  }
}