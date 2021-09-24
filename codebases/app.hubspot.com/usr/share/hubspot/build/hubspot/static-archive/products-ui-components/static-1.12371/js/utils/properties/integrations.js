'use es6';

import { getProperty, hasProperty } from 'customer-data-objects/model/ImmutableModel';
import { DESCRIPTION, PRICE } from 'customer-data-objects/lineItem/PropertyNames';
import { INTEGRATION_SOURCES, INTEGRATION_IDENTIFIERS, PRODUCT_SHOPIFY_IDENTIFIER_PROPERTY, LINE_ITEM_SHOPIFY_IDENTIFIER_PROPERTY, DEAL_SHOPIFY_IDENTIFIER_PROPERTY } from 'products-ui-components/constants/Integrations';
import { ECOMM_SYNCED, EXTERNAL_ACCOUNT_ID, EXTERNAL_APP_ID } from 'customer-data-objects/product/ProductProperties';
import LineItemRecord from 'customer-data-objects/lineItem/LineItemRecord';
import ProductRecord from 'customer-data-objects/product/ProductRecord';
import DealRecord from 'customer-data-objects/deal/DealRecord';
import enviro from 'enviro';
import { QUICKBOOKS_APP_IDS, SHOPIFY_APP_IDS } from '../../constants/Integrations';
export function sourceIsHubSpot(subject) {
  return !getProperty(subject, EXTERNAL_ACCOUNT_ID) && // keeping for backward compatibility until quick followup to prevent bugs
  !getProperty(subject, ECOMM_SYNCED);
}
export function sourceIsShopify(subject) {
  if (subject instanceof ProductRecord) {
    return hasProperty(subject, PRODUCT_SHOPIFY_IDENTIFIER_PROPERTY);
  }

  if (subject instanceof LineItemRecord) {
    return hasProperty(subject, LINE_ITEM_SHOPIFY_IDENTIFIER_PROPERTY);
  }

  if (subject instanceof DealRecord) {
    return hasProperty(subject, DEAL_SHOPIFY_IDENTIFIER_PROPERTY);
  }

  return false;
}
/**
 * For ecomm tracking: https://zenhub.hubteam.com/workspaces/cpq-5c5875806b243f914638f898/issues/hubspotprotected/settings-ui-products/698
 * Shopify or QBO are considered native integrations; other externally synced
 * objects must be from ecomm developers
 *
 * @param {ProductRecord | LineItemRecord | DealRecord} subject
 * @returns {boolean} whether the object was synced from a non-native integration
 */

export function sourceIsEcommBridge(subject) {
  var env = enviro.isQa() ? 'QA' : 'PROD';
  var appId = getProperty(subject, EXTERNAL_APP_ID);
  return !sourceIsHubSpot(subject) && appId !== SHOPIFY_APP_IDS[env] && appId !== QUICKBOOKS_APP_IDS[env];
}
/**
 * @deprecated
 * used thoroughly in crm_ui to determine the editability of deals and cards
 * will be removable when we start unlocking synced objects
 * first we'll be able to unlock ecomm, then shopify objects
 */

export function getDealSource(deal) {
  if (deal.properties.has(DEAL_SHOPIFY_IDENTIFIER_PROPERTY)) {
    return INTEGRATION_SOURCES.SHOPIFY;
  } else if (deal.properties.has(INTEGRATION_IDENTIFIERS.ECOMM)) {
    return INTEGRATION_SOURCES.ECOMM_API;
  }

  return INTEGRATION_SOURCES.HUBSPOT;
}
/**
 * @deprecated
 * Keeping this getter around until issues with price can be resolved https://hubspot.slack.com/archives/C014ZCZ8H45/p1599672070034200?thread_ts=1595856593.006300&cid=C014ZCZ8H45
 */

export function getProductDescriptionProperty(product) {
  return sourceIsShopify(product) ? 'ip__shopify__body_html' : DESCRIPTION;
}
export function getProductTagsProperty(product) {
  return sourceIsShopify(product) ? 'ip__shopify__tags' : null;
}
/**
 * @deprecated
 * Keeping this getter around until issues with price can be resolved https://hubspot.slack.com/archives/C014ZCZ8H45/p1599672070034200?thread_ts=1595856593.006300&cid=C014ZCZ8H45
 */

export function getPriceProperty(lineItem) {
  if (sourceIsShopify(lineItem)) {
    return lineItem.properties.has('amount') ? 'amount' : PRICE;
  }

  return PRICE;
}
export function getDealDiscountProperty(deal) {
  return sourceIsShopify(deal) ? 'ip__ecomm_bridge__discount_amount' : null;
}
export function getDealSubtotalProperty(deal) {
  return sourceIsShopify(deal) ? 'ip__shopify__subtotal_price' : null;
}
export function getDealTaxProperty(deal) {
  return sourceIsShopify(deal) ? 'ip__ecomm_bridge__tax_amount' : null;
}