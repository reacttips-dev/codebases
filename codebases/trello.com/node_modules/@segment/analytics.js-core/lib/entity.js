'use strict';

/*
 * Module dependencies.
 */

var clone = require('@ndhoule/clone');
var cookie = require('./cookie');
var debug = require('debug')('analytics:entity');
var defaults = require('@ndhoule/defaults');
var extend = require('@ndhoule/extend');
var memory = require('./memory');
var store = require('./store');
var isodateTraverse = require('@segment/isodate-traverse');

/**
 * Expose `Entity`
 */

module.exports = Entity;

/**
 * Initialize new `Entity` with `options`.
 *
 * @param {Object} options
 */

function Entity(options) {
  this.options(options);
  this.initialize();
}

/**
 * Initialize picks the storage.
 *
 * Checks to see if cookies can be set
 * otherwise fallsback to localStorage.
 */

Entity.prototype.initialize = function() {
  cookie.set('ajs:cookies', true);

  // cookies are enabled.
  if (cookie.get('ajs:cookies')) {
    cookie.remove('ajs:cookies');
    this._storage = cookie;
    return;
  }

  // localStorage is enabled.
  if (store.enabled) {
    this._storage = store;
    return;
  }

  // fallback to memory storage.
  debug(
    'warning using memory store both cookies and localStorage are disabled'
  );
  this._storage = memory;
};

/**
 * Get the storage.
 */

Entity.prototype.storage = function() {
  return this._storage;
};

/**
 * Get or set storage `options`.
 *
 * @param {Object} options
 *   @property {Object} cookie
 *   @property {Object} localStorage
 *   @property {Boolean} persist (default: `true`)
 */

Entity.prototype.options = function(options) {
  if (arguments.length === 0) return this._options;
  this._options = defaults(options || {}, this.defaults || {});
};

/**
 * Get or set the entity's `id`.
 *
 * @param {String} id
 */

Entity.prototype.id = function(id) {
  switch (arguments.length) {
    case 0:
      return this._getId();
    case 1:
      return this._setId(id);
    default:
    // No default case
  }
};

/**
 * Get the entity's id.
 *
 * @return {String}
 */

Entity.prototype._getId = function() {
  if (!this._options.persist) {
    return this._id === undefined ? null : this._id;
  }

  // Check cookies.
  var cookieId = this._getIdFromCookie();
  if (cookieId) {
    return cookieId;
  }

  // Check localStorage.
  var lsId = this._getIdFromLocalStorage();
  if (lsId) {
    // Copy the id to cookies so we can read it directly from cookies next time.
    this._setIdInCookies(lsId);
    return lsId;
  }

  return null;
};

/**
 * Get the entity's id from cookies.
 *
 * @return {String}
 */

Entity.prototype._getIdFromCookie = function() {
  return this.storage().get(this._options.cookie.key);
};

/**
 * Get the entity's id from cookies.
 *
 * @return {String}
 */

Entity.prototype._getIdFromLocalStorage = function() {
  if (!this._options.localStorageFallbackDisabled) {
    return store.get(this._options.cookie.key);
  }
  return null;
};

/**
 * Set the entity's `id`.
 *
 * @param {String} id
 */

Entity.prototype._setId = function(id) {
  if (this._options.persist) {
    this._setIdInCookies(id);
    this._setIdInLocalStorage(id);
  } else {
    this._id = id;
  }
};

/**
 * Set the entity's `id` in cookies.
 *
 * @param {String} id
 */

Entity.prototype._setIdInCookies = function(id) {
  this.storage().set(this._options.cookie.key, id);
};

/**
 * Set the entity's `id` in local storage.
 *
 * @param {String} id
 */

Entity.prototype._setIdInLocalStorage = function(id) {
  if (!this._options.localStorageFallbackDisabled) {
    store.set(this._options.cookie.key, id);
  }
};

/**
 * Get or set the entity's `traits`.
 *
 * BACKWARDS COMPATIBILITY: aliased to `properties`
 *
 * @param {Object} traits
 */

Entity.prototype.properties = Entity.prototype.traits = function(traits) {
  switch (arguments.length) {
    case 0:
      return this._getTraits();
    case 1:
      return this._setTraits(traits);
    default:
    // No default case
  }
};

/**
 * Get the entity's traits. Always convert ISO date strings into real dates,
 * since they aren't parsed back from local storage.
 *
 * @return {Object}
 */

Entity.prototype._getTraits = function() {
  var ret = this._options.persist
    ? store.get(this._options.localStorage.key)
    : this._traits;
  return ret ? isodateTraverse(clone(ret)) : {};
};

/**
 * Set the entity's `traits`.
 *
 * @param {Object} traits
 */

Entity.prototype._setTraits = function(traits) {
  traits = traits || {};
  if (this._options.persist) {
    store.set(this._options.localStorage.key, traits);
  } else {
    this._traits = traits;
  }
};

/**
 * Identify the entity with an `id` and `traits`. If we it's the same entity,
 * extend the existing `traits` instead of overwriting.
 *
 * @param {String} id
 * @param {Object} traits
 */

Entity.prototype.identify = function(id, traits) {
  traits = traits || {};
  var current = this.id();
  if (current === null || current === id)
    traits = extend(this.traits(), traits);
  if (id) this.id(id);
  this.debug('identify %o, %o', id, traits);
  this.traits(traits);
  this.save();
};

/**
 * Save the entity to local storage and the cookie.
 *
 * @return {Boolean}
 */

Entity.prototype.save = function() {
  if (!this._options.persist) return false;
  this._setId(this.id());
  this._setTraits(this.traits());
  return true;
};

/**
 * Log the entity out, reseting `id` and `traits` to defaults.
 */

Entity.prototype.logout = function() {
  this.id(null);
  this.traits({});
  this.storage().remove(this._options.cookie.key);
  store.remove(this._options.cookie.key);
  store.remove(this._options.localStorage.key);
};

/**
 * Reset all entity state, logging out and returning options to defaults.
 */

Entity.prototype.reset = function() {
  this.logout();
  this.options({});
};

/**
 * Load saved entity `id` or `traits` from storage.
 */

Entity.prototype.load = function() {
  this.id(this.id());
  this.traits(this.traits());
};
