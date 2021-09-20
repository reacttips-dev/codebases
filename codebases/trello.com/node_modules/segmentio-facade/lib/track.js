'use strict';

var inherit = require('./utils').inherit;
var type = require('./utils').type;
var Facade = require('./facade');
var Identify = require('./identify');
var isEmail = require('is-email');
var get = require('obj-case');

/**
 * Initialize a new `Track` facade with a `dictionary` of arguments.
 *
 * @param {Object} dictionary - The object to wrap.
 * @param {string} [dictionary.event] - The name of the event being tracked.
 * @param {string} [dictionary.userId] - The ID of the user being tracked.
 * @param {string} [dictionary.anonymousId] - The anonymous ID of the user.
 * @param {string} [dictionary.properties] - Properties of the track event.
 * @param {Object} opts - Options about what kind of Facade to create.
 *
 * @augments Facade
 */
function Track(dictionary, opts) {
  Facade.call(this, dictionary, opts);
}

inherit(Track, Facade);

/**
 * Return the type of facade this is. This will always return `"track"`.
 *
 * @return {string}
 */
Track.prototype.action = function() {
  return 'track';
};

/**
 * An alias for {@link Track#action}.
 *
 * @function
 * @return {string}
 */
Track.prototype.type = Track.prototype.action;

/**
 * Get the event name from `event`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return {string}
 */
Track.prototype.event = Facade.field('event');

/**
 * Get the event value, usually the monetary value, from `properties.value`.
 *
 * This *should* be a number, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return {string}
 */
Track.prototype.value = Facade.proxy('properties.value');

/**
 * Get the event cateogry from `properties.category`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return {string}
 */
Track.prototype.category = Facade.proxy('properties.category');

/**
 * Get the event ID from `properties.id`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return {string}
 */
Track.prototype.id = Facade.proxy('properties.id');

/**
 * Get the product ID from `properties.productId`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @return {string}
 */
Track.prototype.productId = function() {
  return this.proxy('properties.product_id') || this.proxy('properties.productId');
};

/**
 * Get the promotion ID from `properties.promotionId`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @return {string}
 */
Track.prototype.promotionId = function() {
  return this.proxy('properties.promotion_id') || this.proxy('properties.promotionId');
};

/**
 * Get the cart ID from `properties.cartId`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @return {string}
 */
Track.prototype.cartId = function() {
  return this.proxy('properties.cart_id') || this.proxy('properties.cartId');
};

/**
 * Get the checkout ID from `properties.checkoutId`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @return {string}
 */
Track.prototype.checkoutId = function() {
  return this.proxy('properties.checkout_id') || this.proxy('properties.checkoutId');
};

/**
 * Get the payment ID from `properties.paymentId`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @return {string}
 */
Track.prototype.paymentId = function() {
  return this.proxy('properties.payment_id') || this.proxy('properties.paymentId');
};

/**
 * Get the coupon ID from `properties.couponId`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @return {string}
 */
Track.prototype.couponId = function() {
  return this.proxy('properties.coupon_id') || this.proxy('properties.couponId');
};

/**
 * Get the wishlist ID from `properties.wishlistId`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @return {string}
 */
Track.prototype.wishlistId = function() {
  return this.proxy('properties.wishlist_id') || this.proxy('properties.wishlistId');
};

/**
 * Get the review ID from `properties.reviewId`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @return {string}
 */
Track.prototype.reviewId = function() {
  return this.proxy('properties.review_id') || this.proxy('properties.reviewId');
};

/**
 * Get the order ID from `properties.id` or `properties.orderId`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @return {string}
 */
Track.prototype.orderId = function() {
  // doesn't follow above convention since this fallback order was how it used to be
  return this.proxy('properties.id')
    || this.proxy('properties.order_id')
    || this.proxy('properties.orderId');
};

/**
 * Get the SKU from `properties.sku`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return {string}
 */
Track.prototype.sku = Facade.proxy('properties.sku');

/**
 * Get the amount of tax for this purchase from `properties.tax`.
 *
 * This *should* be a number, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return {number}
 */
Track.prototype.tax = Facade.proxy('properties.tax');

/**
 * Get the name of this event from `properties.name`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return {string}
 */
Track.prototype.name = Facade.proxy('properties.name');

/**
 * Get the price of this purchase from `properties.price`.
 *
 * This *should* be a number, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return {number}
 */
Track.prototype.price = Facade.proxy('properties.price');

/**
 * Get the total for this purchase from `properties.total`.
 *
 * This *should* be a number, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return {number}
 */
Track.prototype.total = Facade.proxy('properties.total');

/**
 * Whether this is a repeat purchase from `properties.repeat`.
 *
 * This *should* be a boolean, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return {boolean}
 */
Track.prototype.repeat = Facade.proxy('properties.repeat');

/**
 * Get the coupon for this purchase from `properties.coupon`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return {string}
 */
Track.prototype.coupon = Facade.proxy('properties.coupon');

/**
 * Get the shipping for this purchase from `properties.shipping`.
 *
 * This *should* be a number, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return {number}
 */
Track.prototype.shipping = Facade.proxy('properties.shipping');

/**
 * Get the discount for this purchase from `properties.discount`.
 *
 * This *should* be a number, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return {number}
 */
Track.prototype.discount = Facade.proxy('properties.discount');

/**
 * Get the shipping method for this purchase from `properties.shippingMethod`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @return {string}
 */
Track.prototype.shippingMethod = function() {
  return this.proxy('properties.shipping_method') || this.proxy('properties.shippingMethod');
};

/**
 * Get the payment method for this purchase from `properties.paymentMethod`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @return {string}
 */
Track.prototype.paymentMethod = function() {
  return this.proxy('properties.payment_method') || this.proxy('properties.paymentMethod');
};

/**
 * Get a description for this event from `properties.description`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return {string}
 */
Track.prototype.description = Facade.proxy('properties.description');

/**
 * Get a plan, as in the plan the user is on, for this event from
 * `properties.plan`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return {string}
 */
Track.prototype.plan = Facade.proxy('properties.plan');

/**
 * Get the subtotal for this purchase from `properties.subtotal`.
 *
 * If `properties.subtotal` isn't available, then fall back to computing the
 * total from `properties.total` or `properties.revenue`, and then subtracting
 * tax, shipping, and discounts.
 *
 * If neither subtotal, total, nor revenue are available, then return 0.
 *
 * @return {number}
 */
Track.prototype.subtotal = function() {
  var subtotal = get(this.properties(), 'subtotal');
  var total = this.total() || this.revenue();

  if (subtotal) return subtotal;
  if (!total) return 0;

  if (this.total()) {
    var n = this.tax();
    if (n) total -= n;
    n = this.shipping();
    if (n) total -= n;
    n = this.discount();
    if (n) total += n;
  }

  return total;
};

/**
 * Get the products for this event from `properties.products` if it's an
 * array, falling back to an empty array.
 *
 * @return {Array}
 */
Track.prototype.products = function() {
  var props = this.properties();
  var products = get(props, 'products');
  return type(products) === 'array' ? products : [];
};

/**
 * Get the quantity for this event from `properties.quantity`, falling back to
 * a quantity of one.
 *
 * @return {number}
 */
Track.prototype.quantity = function() {
  var props = this.obj.properties || {};
  return props.quantity || 1;
};

/**
 * Get the currency for this event from `properties.currency`, falling back to
 * "USD".
 *
 * @return {string}
 */
Track.prototype.currency = function() {
  var props = this.obj.properties || {};
  return props.currency || 'USD';
};

/**
 * Get the referrer for this event from `context.referrer.url`,
 * `context.page.referrer`, or `properties.referrer`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @return {string}
 */
Track.prototype.referrer = function() {
  // TODO re-examine whether this function is necessary
  return this.proxy('context.referrer.url')
    || this.proxy('context.page.referrer')
    || this.proxy('properties.referrer');
};

/**
 * Get the query for this event from `options.query`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return {string|object}
 */
Track.prototype.query = Facade.proxy('options.query');

/**
 * Get the page's properties. This is identical to how {@link Facade#traits}
 * works, except it looks at `properties.*` instead of `options.traits.*`.
 *
 * Properties are gotten from `properties`.
 *
 * The parameter `aliases` is meant to transform keys in `properties` into new
 * keys. Each alias like `{ "xxx": "yyy" }` will take whatever is at `xxx` in
 * the traits, and move it to `yyy`. If `xxx` is a method of this facade, it'll
 * be called as a function instead of treated as a key into the traits.
 *
 * @example
 * var obj = { properties: { foo: "bar" }, anonymousId: "xxx" }
 * var track = new Track(obj)
 *
 * track.traits() // { "foo": "bar" }
 * track.traits({ "foo": "asdf" }) // { "asdf": "bar" }
 * track.traits({ "sessionId": "rofl" }) // { "rofl": "xxx" }
 *
 * @param {Object} aliases - A mapping from keys to the new keys they should be
 * transformed to.
 * @return {Object}
 */
Track.prototype.properties = function(aliases) {
  var ret = this.field('properties') || {};
  aliases = aliases || {};

  for (var alias in aliases) {
    var value = this[alias] == null ? this.proxy('properties.' + alias) : this[alias]();
    if (value == null) continue;
    ret[aliases[alias]] = value;
    delete ret[alias];
  }

  return ret;
};

/**
 * Get the username of the user for this event from `traits.username`,
 * `properties.username`, `userId`, or `anonymousId`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @return {string|undefined}
 */
Track.prototype.username = function() {
  return this.proxy('traits.username')
    || this.proxy('properties.username')
    || this.userId()
    || this.sessionId();
};

/**
 * Get the email of the user for this event from `trais.email`,
 * `properties.email`, or `options.traits.email`, falling back to `userId` if
 * it looks like a valid email.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @return {string|undefined}
 */
Track.prototype.email = function() {
  var email = this.proxy('traits.email')
    || this.proxy('properties.email')
    || this.proxy('options.traits.email');
  if (email) return email;

  var userId = this.userId();
  if (isEmail(userId)) return userId;
};

/**
 * Get the revenue for this event.
 *
 * If this is an "Order Completed" event, this will be the `properties.total`
 * falling back to the `properties.revenue`. For all other events, this is
 * simply taken from `properties.revenue`.
 *
 * If there are dollar signs in these properties, they will be removed. The
 * result will be parsed into a number.
 *
 * @return {number}
 */
Track.prototype.revenue = function() {
  var revenue = this.proxy('properties.revenue');
  var event = this.event();
  var orderCompletedRegExp = /^[ _]?completed[ _]?order[ _]?|^[ _]?order[ _]?completed[ _]?$/i;

  // it's always revenue, unless it's called during an order completion.
  if (!revenue && event && event.match(orderCompletedRegExp)) {
    revenue = this.proxy('properties.total');
  }

  return currency(revenue);
};

/**
 * Get the revenue for this event in "cents" -- in other words, multiply the
 * {@link Track#revenue} by 100, or return 0 if there isn't a numerical revenue
 * for this event.
 *
 * @return {number}
 */
Track.prototype.cents = function() {
  var revenue = this.revenue();
  return typeof revenue !== 'number' ? this.value() || 0 : revenue * 100;
};

/**
 * Convert this event into an {@link Identify} facade.
 *
 * This works by taking this event's underlying object and creating an Identify
 * from it. This event's traits, taken from `options.traits`, will be used as
 * the Identify's traits.
 *
 * @return {Identify}
 */
Track.prototype.identify = function() {
  // TODO: remove me.
  var json = this.json();
  json.traits = this.traits();
  return new Identify(json, this.opts);
};

/**
 * Get float from currency value.
 *
 * @ignore
 * @param {*} val
 * @return {number}
 */
function currency(val) {
  if (!val) return;
  if (typeof val === 'number') {
    return val;
  }
  if (typeof val !== 'string') {
    return;
  }

  val = val.replace(/\$/g, '');
  val = parseFloat(val);

  if (!isNaN(val)) {
    return val;
  }
}

module.exports = Track;
