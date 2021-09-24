'use es6';

import { Map as ImmutableMap, List } from 'immutable';
import isNumber from 'transmute/isNumber';
import isEmpty from 'transmute/isEmpty';
import uniqueId from 'transmute/uniqueId';
import { getId, getProperty, setProperty } from 'customer-data-objects/model/ImmutableModel';
import LineItemRecord from 'customer-data-objects/lineItem/LineItemRecord';
import { ACV, getCurrencyPriceProperty, isCurrencyPriceProperty } from 'customer-data-objects/lineItem/PropertyNames';
import { CRM_UI } from 'customer-data-objects/property/PropertySourceTypes';
import * as Alerts from 'customer-data-ui-utilities/alerts/Alerts';
import * as LineItemsActions from 'crm_data/lineItems/LineItemsActions';
import { updateDealProperties } from 'crm_data/deals/DealsActions';
import { LineItemsLogger } from 'customer-data-tracking/loggers';
import { DEAL_AMOUNT_OPTIONS, DEAL_AMOUNT_PREFERENCES } from 'products-ui-components/constants/DealAmountOptions';
import { dealHasMismatchedLineItemCurrencies } from 'products-ui-components/utils/lineItemMulticurrency';
import calculateExchangeRatePrice from 'products-ui-components/utils/calculations/calculateExchangeRatePrice';
import { calculateSummaryTotals, calculateDealAmountByPreference } from 'products-ui-components/utils/calculations/totals';
import { setPropertiesOnRecord, setPropertyMapOnRecord } from 'products-ui-components/utils/properties/model';
export function getModifiedProperties(oldLineItem, newLineItem) {
  if (isEmpty(oldLineItem) || isEmpty(newLineItem)) {
    return List();
  }

  return newLineItem.properties.filterNot(function (property, key) {
    return property.equals(oldLineItem.getIn(['properties', key]));
  });
}
export function hasModifiedLineItems(editedLineItems) {
  if (!editedLineItems) {
    return false;
  }

  var _editedLineItems$toOb = editedLineItems.toObject(),
      lineItemsToUpdate = _editedLineItems$toOb.lineItemsToUpdate,
      lineItemsToAdd = _editedLineItems$toOb.lineItemsToAdd,
      lineItemsToRemove = _editedLineItems$toOb.lineItemsToRemove;

  return !lineItemsToUpdate.isEmpty() || !lineItemsToAdd.isEmpty() || !lineItemsToRemove.isEmpty();
}
export function getCalculatedDealAmountFromPreference(dealAmountPreference, lineItems) {
  if (!dealAmountPreference || dealAmountPreference === DEAL_AMOUNT_OPTIONS.CUSTOM) {
    return null;
  }

  var totals = calculateSummaryTotals(lineItems);
  return totals[dealAmountPreference];
}

var getEditedLineItemDiffs = function getEditedLineItemDiffs(lineItems, lineItemsToUpdate, lineItemEditedProperties) {
  var updatedLineItems = lineItems.filter(function (lineItem, lineItemId) {
    return lineItemsToUpdate.has(lineItemId);
  });
  return updatedLineItems.map(function (lineItem, lineItemId) {
    var editedPropertyList = lineItemEditedProperties.get(lineItemId);
    if (!editedPropertyList) return lineItem;
    return lineItem.update('properties', function (properties) {
      return properties.filter(function (__value, propertyKey) {
        return editedPropertyList.has(propertyKey);
      });
    });
  });
};
/**
 * Batch save line item changes via create, update, and delete API calls
 *
 * @param {string} associatedObjectType - The object type that line items
 * created and deleted are associated to. oneOf(['DEAL', 'QUOTE', undefined])
 * @param {string} associatedObjectId - The id of the object line items
 * created and deleted are be associated to.
 * @param {List} lineItemsToAdd - A list of line items objects to create. These
 * items will be created with the specified associatedObjectType and
 * associatedObjectId, if provided
 * @param {List} lineItemsToUpdate - A list of line items objects to update.
 * @param {List} lineItemsToRemove - A list of line items ids to delete.
 * @return {Promise} A promise that resolves when all API calls have fulfilled
 */


export function saveLineItems(_ref) {
  var _ref$associatedObject = _ref.associatedObjectType,
      associatedObjectType = _ref$associatedObject === void 0 ? null : _ref$associatedObject,
      _ref$associatedObject2 = _ref.associatedObjectId,
      associatedObjectId = _ref$associatedObject2 === void 0 ? null : _ref$associatedObject2,
      _ref$lineItemsToAdd = _ref.lineItemsToAdd,
      lineItemsToAdd = _ref$lineItemsToAdd === void 0 ? List() : _ref$lineItemsToAdd,
      _ref$lineItemsToUpdat = _ref.lineItemsToUpdate,
      lineItemsToUpdate = _ref$lineItemsToUpdat === void 0 ? List() : _ref$lineItemsToUpdat,
      _ref$lineItemsToRemov = _ref.lineItemsToRemove,
      lineItemsToRemove = _ref$lineItemsToRemov === void 0 ? List() : _ref$lineItemsToRemov;
  LineItemsLogger.log('bulkSaveLineItems', {
    action: 'Bulk save line items'
  });
  return LineItemsActions.saveChanges({
    associatedObjectType: associatedObjectType,
    associatedObjectId: associatedObjectId,
    lineItemsToRemove: lineItemsToRemove,
    lineItemsToAdd: lineItemsToAdd,
    lineItemsToUpdate: lineItemsToUpdate
  });
}
/**
 * @deprecated use totals/calculateDealAmountByPreference instead
 */

export function calculateDealAmountFromPreference(_ref2) {
  var dealAmountPreference = _ref2.dealAmountPreference,
      lineItems = _ref2.lineItems;

  if (!dealAmountPreference || dealAmountPreference === DEAL_AMOUNT_PREFERENCES['disabled']) {
    return 0;
  }

  return calculateDealAmountByPreference(lineItems, dealAmountPreference).total;
} // TODO convert to graphQL updater

export function saveDealAndTrackUsage(_ref3) {
  var deal = _ref3.deal,
      effectiveCurrencyCode = _ref3.effectiveCurrencyCode,
      lineItems = _ref3.lineItems,
      customDealAmount = _ref3.customDealAmount,
      dealAmountPreference = _ref3.dealAmountPreference;
  var preferenceIsManualEntry = dealAmountPreference === DEAL_AMOUNT_PREFERENCES.disabled;

  if (dealHasMismatchedLineItemCurrencies(effectiveCurrencyCode, lineItems) || // if customDealAmount is not provided, and preference is manual entry, we shouldn't save a deal amount
  preferenceIsManualEntry && customDealAmount === undefined) {
    return Promise.resolve();
  }

  var currentAmount = Number(getProperty(deal, 'amount'));
  var newAmount = preferenceIsManualEntry ? customDealAmount : calculateDealAmountFromPreference({
    dealAmountPreference: dealAmountPreference,
    lineItems: lineItems
  });

  if (newAmount === currentAmount) {
    return Promise.resolve();
  }

  LineItemsLogger.log('updateDealAmount', {
    action: 'Update deal amount'
  });
  return updateDealProperties(deal, ImmutableMap({
    amount: newAmount
  }));
}
/**
 * Batch save line item changes given line item data from LineItemEditorDecorator
 *
 * @param {Map} editedLineItems - Staged line item data from LineItemEditorDecorator
 * @param {string} associatedObjectType - The object type that line items
 * created and deleted are associated to. oneOf(['DEAL', 'QUOTE', undefined])
 * @param {string} associatedObjectId - The id of the object line items
 * created and deleted are be associated to
 * @return {Promise} Returns a Promise that always resolves. If the update API
 * calls are successful, promise resolves to a List of line item ids saved in
 * the editor HOC (eg. replaces `temp-line-item-id` with real ids from API).
 * If API calls failed, resolves to  list of line item ids before API calls
 * were executed.
 */

export function saveStagedLineItems(_ref4) {
  var editedLineItems = _ref4.editedLineItems,
      associatedObjectType = _ref4.associatedObjectType,
      associatedObjectId = _ref4.associatedObjectId;
  var lineItemIds = editedLineItems.get('lineItems').keySeq().toList();

  var _editedLineItems$toOb2 = editedLineItems.toObject(),
      lineItems = _editedLineItems$toOb2.lineItems,
      lineItemsToAdd = _editedLineItems$toOb2.lineItemsToAdd,
      lineItemsToRemove = _editedLineItems$toOb2.lineItemsToRemove,
      lineItemsToUpdate = _editedLineItems$toOb2.lineItemsToUpdate,
      lineItemEditedProperties = _editedLineItems$toOb2.lineItemEditedProperties;

  if (hasModifiedLineItems(editedLineItems)) {
    var lineItemsToSave = {
      associatedObjectType: associatedObjectType,
      associatedObjectId: associatedObjectId,
      lineItemsToAdd: lineItems.filter(function (lineItem, lineItemId) {
        return lineItemsToAdd.has(lineItemId);
      }),
      lineItemsToUpdate: getEditedLineItemDiffs(lineItems, lineItemsToUpdate, lineItemEditedProperties),
      lineItemsToRemove: lineItemsToRemove
    };
    return saveLineItems(lineItemsToSave).then(function (result) {
      Alerts.addSuccess('lineItems.saveChanges.success'); // Apply the changes from API calls if they were successful

      return editedLineItems.get('lineItems').filter(function (lineItem) {
        return !lineItem.get('isNew') && !result.lineItemsRemoved.includes(getId(lineItem));
      }).keySeq().toList().concat(result.lineItemsAdded.map(function (lineItem) {
        return getId(lineItem);
      }));
    }).catch(function () {
      Alerts.addError('lineItems.saveChanges.error'); // Return the line item ids before API calls executed

      return lineItemIds;
    });
  } else {
    return Promise.resolve(lineItemIds);
  }
}
export function convertProductToLineItem(product, currency, userEmail, multiCurrencies, defaultCurrencyCode, globalTerms) {
  var productId = product.get('objectId');
  var productWithoutCurrencyPrices = product.update('properties', function (properties) {
    return properties.filterNot(function (property, name) {
      return isCurrencyPriceProperty(name);
    });
  });
  var lineItem = LineItemRecord(productWithoutCurrencyPrices).merge({
    objectId: uniqueId('line-item-temp-id-'),
    isNew: true
  });
  lineItem = setPropertyMapOnRecord({
    subject: lineItem,
    propertyMap: globalTerms
  });
  lineItem = setProperty(lineItem, 'hs_product_id', String(productId), CRM_UI, userEmail);
  lineItem = setProperty(lineItem, 'quantity', 1, CRM_UI, userEmail);

  if (currency) {
    lineItem = setProperty(lineItem, 'price', getProperty(product, getCurrencyPriceProperty(currency)), CRM_UI, userEmail); // if the product has a unit cost, convert it to deal currency

    var unitCost = Number(getProperty(lineItem, 'hs_cost_of_goods_sold'));

    if (isNumber(unitCost)) {
      var unitCostInDealCurrency = calculateExchangeRatePrice(multiCurrencies, defaultCurrencyCode, currency, unitCost);
      lineItem = setProperty(lineItem, 'hs_cost_of_goods_sold', unitCostInDealCurrency, CRM_UI, userEmail);
    }
  }

  return setProperty(lineItem, 'hs_line_item_currency_code', currency, CRM_UI, userEmail);
}
export function convertProductsToLineItems(products, currency, userEmail, multiCurrencies, defaultCurrencyCode, globalTerms) {
  return products.map(function (product) {
    return convertProductToLineItem(product, currency, userEmail, multiCurrencies, defaultCurrencyCode, globalTerms);
  });
}
export function createGreenfieldLineItem(_ref5) {
  var currency = _ref5.currency,
      userEmail = _ref5.userEmail,
      globalTerms = _ref5.globalTerms;
  var lineItem = new LineItemRecord();
  lineItem = lineItem.merge({
    isNew: true
  });
  lineItem = setPropertyMapOnRecord({
    subject: lineItem,
    propertyMap: globalTerms
  });

  if (currency) {
    lineItem = setProperty(lineItem, 'hs_line_item_currency_code', currency, CRM_UI, userEmail);
  }

  return setProperty(lineItem, 'quantity', 1, CRM_UI, userEmail);
}
/**
 *
 * @param {List<LineItemRecord>} lineItems whose values to update based on calculations
 * @param {Map<lineItemId: PropertyValueRecord[]>} calculations arrays of propertyValue objects keyed by line item id
 * @returns line items with calculated properties set
 *
 */

export function setCalculatedPropertyValues(_ref6) {
  var lineItems = _ref6.lineItems,
      calculations = _ref6.calculations;
  return lineItems.map(function (lineItem) {
    // update line item properties with calculations from previewer
    var calculationsForLineItem = calculations.get(getId(lineItem));
    return calculationsForLineItem ? setPropertiesOnRecord(lineItem, calculationsForLineItem) : lineItem;
  });
}
/**
 * @param {string} dealAmountCalculationPreference selected calculation preference
 * @param {boolean} hasLegacyDealAmountCalculation is customer scoped for legacy calculation
 * @returns {string} deal amount preference or legacy fallback
 */

export function getDealAmountPreference(_ref7) {
  var dealAmountCalculationPreference = _ref7.dealAmountCalculationPreference,
      hasLegacyDealAmountCalculation = _ref7.hasLegacyDealAmountCalculation;
  var fallbackPreference = hasLegacyDealAmountCalculation ? DEAL_AMOUNT_PREFERENCES.legacy : DEAL_AMOUNT_PREFERENCES[ACV];
  return DEAL_AMOUNT_PREFERENCES[dealAmountCalculationPreference] || fallbackPreference;
}