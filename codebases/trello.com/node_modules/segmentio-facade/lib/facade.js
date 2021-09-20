'use strict';

var address = require('./address');
var clone = require('./utils').clone;
var isEnabled = require('./is-enabled');
var newDate = require('new-date');
var objCase = require('obj-case');
var traverse = require('@segment/isodate-traverse');
var type = require('./utils').type;

/**
 * A *Facade* is an object meant for creating convience wrappers around
 * objects. When developing integrations, you probably want to look at its
 * subclasses, such as {@link Track} or {@link Identify}, rather than this
 * general-purpose class.
 *
 * This constructor will initialize a new `Facade` with an `obj` of arguments.
 *
 * If the inputted `obj` doesn't have a `timestamp` property, one will be added
 * with the value `new Date()`. Otherwise, the `timestamp` property will be
 * converted to a Date using the `new-date` package.
 *
 * By default, the inputted object will be defensively copied, and all ISO
 * strings present in the string will be converted into Dates.
 *
 * @param {Object} obj - The object to wrap.
 * @param {Object} opts - Options about what kind of Facade to create.
 * @param {boolean} [opts.clone=true] - Whether to make defensive clones. If enabled,
 * the inputted object will be cloned, and any objects derived from this facade
 * will be cloned before being returned.
 * @param {boolean} [opts.traverse=true] - Whether to perform ISODate-Traverse
 * on the inputted object.
 *
 * @see {@link https://github.com/segmentio/new-date|new-date}
 * @see {@link https://github.com/segmentio/isodate-traverse|isodate-traverse}
 */
function Facade(obj, opts) {
  opts = opts || {};
  if (!('clone' in opts)) opts.clone = true;
  if (opts.clone) obj = clone(obj);
  if (!('traverse' in opts)) opts.traverse = true;
  if (!('timestamp' in obj)) obj.timestamp = new Date();
  else obj.timestamp = newDate(obj.timestamp);
  if (opts.traverse) traverse(obj);
  this.opts = opts;
  this.obj = obj;
}

/**
 * Get a potentially-nested field in this facade. `field` should be a
 * period-separated sequence of properties.
 *
 * If the first field passed in points to a function (e.g. the `field` passed
 * in is `a.b.c` and this facade's `obj.a` is a function), then that function
 * will be called, and then the deeper fields will be fetched (using obj-case)
 * from what that function returns. If the first field isn't a function, then
 * this function works just like obj-case.
 *
 * Because this function uses obj-case, the camel- or snake-case of the input
 * is irrelevant.
 *
 * @example
 * YourClass.prototype.height = function() {
 *   return this.proxy('getDimensions.height') ||
 *     this.proxy('props.size.side_length');
 * }
 * @param {string} field - A sequence of properties, joined by periods (`.`).
 * @return {*} - A property of the inputted object.
 * @see {@link https://github.com/segmentio/obj-case|obj-case}
 */
Facade.prototype.proxy = function(field) {
  var fields = field.split('.');
  field = fields.shift();

  // Call a function at the beginning to take advantage of facaded fields
  var obj = this[field] || this.field(field);
  if (!obj) return obj;
  if (typeof obj === 'function') obj = obj.call(this) || {};
  if (fields.length === 0) return this.opts.clone ? transform(obj) : obj;

  obj = objCase(obj, fields.join('.'));
  return this.opts.clone ? transform(obj) : obj;
};

/**
 * Directly access a specific `field` from the underlying object. Only
 * "top-level" fields will work with this function. "Nested" fields *will not
 * work* with this function.
 *
 * @param {string} field
 * @return {*}
 */
Facade.prototype.field = function(field) {
  var obj = this.obj[field];
  return this.opts.clone ? transform(obj) : obj;
};

/**
 * Utility method to always proxy a particular `field`. In other words, it
 * returns a function that will always return `this.proxy(field)`.
 *
 * @example
 * MyClass.prototype.height = Facade.proxy('options.dimensions.height');
 *
 * @param {string} field
 * @return {Function}
 */
Facade.proxy = function(field) {
  return function() {
    return this.proxy(field);
  };
};

/**
 * Utility method to always access a `field`. In other words, it returns a
 * function that will always return `this.field(field)`.
 *
 * @param {string} field
 * @return {Function}
 */
Facade.field = function(field) {
  return function() {
    return this.field(field);
  };
};

/**
 * Create a helper function for fetching a "plural" thing.
 *
 * The generated method will take the inputted `path` and append an "s" to it
 * and calls `this.proxy` with this "pluralized" path. If that produces an
 * array, that will be returned. Otherwise, a one-element array containing
 * `this.proxy(path)` will be returned.
 *
 * @example
 * MyClass.prototype.birds = Facade.multi('animals.bird');
 *
 * @param {string} path
 * @return {Function}
 */
Facade.multi = function(path) {
  return function() {
    var multi = this.proxy(path + 's');
    if (type(multi) === 'array') return multi;
    var one = this.proxy(path);
    if (one) one = [this.opts.clone ? clone(one) : one];
    return one || [];
  };
};

/**
 * Create a helper function for getting a "singular" thing.
 *
 * The generated method will take the inputted path and call
 * `this.proxy(path)`. If a truthy thing is produced, it will be returned.
 * Otherwise, `this.proxy(path + 's')` will be called, and if that produces an
 * array the first element of that array will be returned. Otherwise,
 * `undefined` is returned.
 *
 * @example
 * MyClass.prototype.bird = Facade.one('animals.bird');
 *
 * @param {string} path
 * @return {Function}
 */
Facade.one = function(path) {
  return function() {
    var one = this.proxy(path);
    if (one) return one;
    var multi = this.proxy(path + 's');
    if (type(multi) === 'array') return multi[0];
  };
};

/**
 * Gets the underlying object this facade wraps around.
 *
 * If this facade has a property `type`, it will be invoked as a function and
 * will be assigned as the property `type` of the outputted object.
 *
 * @return {Object}
 */
Facade.prototype.json = function() {
  var ret = this.opts.clone ? clone(this.obj) : this.obj;
  if (this.type) ret.type = this.type();
  return ret;
};

/**
 * Get the options of a call. If an integration is passed, only the options for
 * that integration are included. If the integration is not enabled, then
 * `undefined` is returned.
 *
 * Options are taken from the `options` property of the underlying object,
 * falling back to the object's `context` or simply `{}`.
 *
 * @param {string} integration - The name of the integration to get settings
 * for. Casing does not matter.
 * @return {Object|undefined}
 */
Facade.prototype.options = function(integration) {
  var obj = this.obj.options || this.obj.context || {};
  var options = this.opts.clone ? clone(obj) : obj;
  if (!integration) return options;
  if (!this.enabled(integration)) return;
  var integrations = this.integrations();
  var value = integrations[integration] || objCase(integrations, integration);
  if (typeof value !== 'object') value = objCase(this.options(), integration);
  return typeof value === 'object' ? value : {};
};

/**
 * An alias for {@link Facade#options}.
 */
Facade.prototype.context = Facade.prototype.options;

/**
 * Check whether an integration is enabled.
 *
 * Basically, this method checks whether this integration is explicitly
 * enabled. If it isn'texplicitly mentioned, it checks whether it has been
 * enabled at the global level. Some integrations (e.g. Salesforce), cannot
 * enabled by these global event settings.
 *
 * More concretely, the deciding factors here are:
 *
 * 1. If `this.integrations()` has the integration set to `true`, return `true`.
 * 2. If `this.integrations().providers` has the integration set to `true`, return `true`.
 * 3. If integrations are set to default-disabled via global parameters (i.e.
 * `options.providers.all`, `options.all`, or `integrations.all`), then return
 * false.
 * 4. If the integration is one of the special default-deny integrations
 * (currently, only Salesforce), then return false.
 * 5. Else, return true.
 *
 * @param {string} integration
 * @return {boolean}
 */
Facade.prototype.enabled = function(integration) {
  var allEnabled = this.proxy('options.providers.all');
  if (typeof allEnabled !== 'boolean') allEnabled = this.proxy('options.all');
  if (typeof allEnabled !== 'boolean') allEnabled = this.proxy('integrations.all');
  if (typeof allEnabled !== 'boolean') allEnabled = true;

  var enabled = allEnabled && isEnabled(integration);
  var options = this.integrations();

  // If the integration is explicitly enabled or disabled, use that
  // First, check options.providers for backwards compatibility
  if (options.providers && options.providers.hasOwnProperty(integration)) {
    enabled = options.providers[integration];
  }

  // Next, check for the integration's existence in 'options' to enable it.
  // If the settings are a boolean, use that, otherwise it should be enabled.
  if (options.hasOwnProperty(integration)) {
    var settings = options[integration];
    if (typeof settings === 'boolean') {
      enabled = settings;
    } else {
      enabled = true;
    }
  }

  return !!enabled;
};

/**
 * Get all `integration` options.
 *
 * @ignore
 * @param {string} integration
 * @return {Object}
 */
Facade.prototype.integrations = function() {
  return this.obj.integrations || this.proxy('options.providers') || this.options();
};

/**
 * Check whether the user is active.
 *
 * @return {boolean}
 */
Facade.prototype.active = function() {
  var active = this.proxy('options.active');
  if (active === null || active === undefined) active = true;
  return active;
};

/**
 * Get `sessionId / anonymousId`.
 *
 * @return {*}
 */
Facade.prototype.anonymousId = function() {
  return this.field('anonymousId') || this.field('sessionId');
};

/**
 * An alias for {@link Facade#anonymousId}.
 *
 * @function
 * @return {string}
 */
Facade.prototype.sessionId = Facade.prototype.anonymousId;

/**
 * Get `groupId` from `context.groupId`.
 *
 * @function
 * @return {string}
 */
Facade.prototype.groupId = Facade.proxy('options.groupId');

/**
 * Get the call's "traits". All event types can pass in traits, though {@link
 * Identify} and {@link Group} override this implementation.
 *
 * Traits are gotten from `options.traits`, augmented with a property `id` with
 * the event's `userId`.
 *
 * The parameter `aliases` is meant to transform keys in `options.traits` into
 * new keys. Each alias like `{ "xxx": "yyy" }` will take whatever is at `xxx`
 * in the traits, and move it to `yyy`. If `xxx` is a method of this facade,
 * it'll be called as a function instead of treated as a key into the traits.
 *
 * @example
 * var obj = { options: { traits: { foo: "bar" } }, anonymousId: "xxx" }
 * var facade = new Facade(obj)
 *
 * facade.traits() // { "foo": "bar" }
 * facade.traits({ "foo": "asdf" }) // { "asdf": "bar" }
 * facade.traits({ "sessionId": "rofl" }) // { "rofl": "xxx" }
 *
 * @param {Object} aliases - A mapping from keys to the new keys they should be
 * transformed to.
 * @return {Object}
 */
Facade.prototype.traits = function(aliases) {
  var ret = this.proxy('options.traits') || {};
  var id = this.userId();
  aliases = aliases || {};

  if (id) ret.id = id;

  for (var alias in aliases) {
    var value = this[alias] == null ? this.proxy('options.traits.' + alias) : this[alias]();
    if (value == null) continue;
    ret[aliases[alias]] = value;
    delete ret[alias];
  }

  return ret;
};

/**
 * The library and version of the client used to produce the message.
 *
 * If the library name cannot be determined, it is set to `"unknown"`. If the
 * version cannot be determined, it is set to `null`.
 *
 * @return {{name: string, version: string}}
 */
Facade.prototype.library = function() {
  var library = this.proxy('options.library');
  if (!library) return { name: 'unknown', version: null };
  if (typeof library === 'string') return { name: library, version: null };
  return library;
};

/**
 * Return the device information, falling back to an empty object.
 *
 * Interesting values of `type` are `"ios"` and `"android"`, but other values
 * are possible if the client is doing something unusual with `context.device`.
 *
 * @return {{type: string}}
 */
Facade.prototype.device = function() {
  var device = this.proxy('context.device');
  if (type(device) !== 'object') device = {};
  var library = this.library().name;
  if (device.type) return device;

  if (library.indexOf('ios') > -1) device.type = 'ios';
  if (library.indexOf('android') > -1) device.type = 'android';
  return device;
};

/**
 * Get the User-Agent from `context.userAgent`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return string
 */
Facade.prototype.userAgent = Facade.proxy('context.userAgent');

/**
 * Get the timezone from `context.timezone`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return string
 */
Facade.prototype.timezone = Facade.proxy('context.timezone');

/**
 * Get the timestamp from `context.timestamp`.
 *
 * @function
 * @return string
 */
Facade.prototype.timestamp = Facade.field('timestamp');

/**
 * Get the channel from `channel`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return string
 */
Facade.prototype.channel = Facade.field('channel');

/**
 * Get the IP address from `context.ip`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return string
 */
Facade.prototype.ip = Facade.proxy('context.ip');

/**
 * Get the user ID from `userId`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return string
 */
Facade.prototype.userId = Facade.field('userId');

/**
 * Get the ZIP/Postal code from `traits`, `traits.address`, `properties`, or
 * `properties.address`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @name zip
 * @function
 * @memberof Facade.prototype
 * @return {string}
 */

/**
 * Get the country from `traits`, `traits.address`, `properties`, or
 * `properties.address`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @name country
 * @function
 * @memberof Facade.prototype
 * @return {string}
 */

/**
 * Get the street from `traits`, `traits.address`, `properties`, or
 * `properties.address`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @name street
 * @function
 * @memberof Facade.prototype
 * @return {string}
 */

/**
 * Get the state from `traits`, `traits.address`, `properties`, or
 * `properties.address`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @name state
 * @function
 * @memberof Facade.prototype
 * @return {string}
 */

/**
 * Get the city from `traits`, `traits.address`, `properties`, or
 * `properties.address`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @name city
 * @function
 * @memberof Facade.prototype
 * @return {string}
 */

/**
 * Get the region from `traits`, `traits.address`, `properties`, or
 * `properties.address`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @name region
 * @function
 * @memberof Facade.prototype
 * @return {string}
 */

address(Facade.prototype);

/**
 * Return the cloned and traversed object
 *
 * @ignore
 * @param {*} obj
 * @return {*}
 */
function transform(obj) {
  return clone(obj);
}

module.exports = Facade;
