'use es6';

import I18n from 'I18n';
import { PERCENT, FIXED } from 'products-ui-components/constants/Discounts';
import getLineItemProperties from 'products-ui-components/utils/properties/getLineItemProperties';

var isDefined = function isDefined(discountValue) {
  return I18n.parseNumber(discountValue) > 0;
};

export var getDiscountType = function getDiscountType(discount, discountPercentage) {
  if (isDefined(discount)) {
    return FIXED;
  } else if (isDefined(discountPercentage)) {
    return PERCENT;
  }

  return null;
};
export var getSelectedDiscountValue = function getSelectedDiscountValue(discount, discountPercentage, discountType) {
  if (discountType === FIXED) {
    return discount;
  } else if (discountType === PERCENT) {
    return discountPercentage;
  }

  return 0;
};
/**
 * Converts a per-unit, fixed discount to a percentage discount and vice versa
 * for a single line item.
 *
 * @param {number} discountValue - The discount that we want to convert into the
 * other type. If we want to convert fixed to percent, this is the fixed
 * discount (eg. 120 represents a $120 discount). If we want to convert percent
 * to fixed, this is the percent discount (eg. 15 represents 15% discount).
 * @param {number} price - The unit of price of the line item.
 * @param {string} from - The discount type we want to convert from. This should
 * match the type provided via discount param
 * @param {string} to - The discount type we want to conver to.
 *
 * @return {number} The converted discount value.
 *
 * @example convertDiscountValue({ discount: 1, price: 10, from: FIXED, to: PERCENT }) === 10
 * @example convertDiscountValue({ discount: 10, price: 10, from: PERCENT, to: FIXED }) === 1
 */

export var convertDiscountValue = function convertDiscountValue(_ref) {
  var discount = _ref.discount,
      price = _ref.price,
      from = _ref.from,
      to = _ref.to;

  if (!discount) {
    return 0;
  }

  if (from === to) {
    return discount;
  }

  if (from === FIXED && to === PERCENT) {
    return discount / price * 100;
  } else if (from === PERCENT && to === FIXED) {
    return discount / 100 * price;
  }

  throw new Error('convertDiscountValue: invalid from or to params', {
    from: from,
    to: to
  });
};
export var calculateTotalDiscount = function calculateTotalDiscount(quantity, price, discount) {
  var discountType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : FIXED;

  if (discountType === FIXED) {
    return discount * quantity;
  } else if (discountType === PERCENT) {
    var totalPrice = price * quantity;
    return totalPrice * discount / 100;
  }

  return 0;
};
export var calculateBaseDiscountedUnitPrice = function calculateBaseDiscountedUnitPrice(price, discount) {
  var discountType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : FIXED;

  if (!discount) {
    return price;
  }

  if (discountType === FIXED) {
    return price - discount;
  } else if (discountType === PERCENT) {
    return price - price * discount / 100;
  }

  return price;
};
export var calculateBaseDiscountedLineItemPrice = function calculateBaseDiscountedLineItemPrice(quantity, price, discount) {
  var discountType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : FIXED;
  var unitDiscountedPrice = calculateBaseDiscountedUnitPrice(price, discount, discountType);
  return quantity * unitDiscountedPrice;
};
export var calculateLineItemDiscount = function calculateLineItemDiscount(lineItem) {
  var _getLineItemPropertie = getLineItemProperties(lineItem),
      quantity = _getLineItemPropertie.quantity,
      price = _getLineItemPropertie.price,
      discount = _getLineItemPropertie.discount,
      discountPercentage = _getLineItemPropertie.discountPercentage;

  var discountType = getDiscountType(discount, discountPercentage);
  var discountValue = getSelectedDiscountValue(discount, discountPercentage, discountType);
  return calculateTotalDiscount(quantity, price, discountValue, discountType);
};