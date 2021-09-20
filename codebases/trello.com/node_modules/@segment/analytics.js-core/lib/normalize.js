'use strict';

/**
 * Module Dependencies.
 */

var debug = require('debug')('analytics.js:normalize');
var defaults = require('@ndhoule/defaults');
var each = require('@ndhoule/each');
var includes = require('@ndhoule/includes');
var map = require('@ndhoule/map');
var type = require('component-type');
var uuid = require('uuid').v4;
var json = require('json3');
var md5 = require('spark-md5').hash;

/**
 * HOP.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Expose `normalize`
 */

module.exports = normalize;

/**
 * Toplevel properties.
 */

var toplevel = ['integrations', 'anonymousId', 'timestamp', 'context'];

/**
 * Normalize `msg` based on integrations `list`.
 *
 * @param {Object} msg
 * @param {Array} list
 * @return {Function}
 */

function normalize(msg, list) {
  var lower = map(function(s) {
    return s.toLowerCase();
  }, list);
  var opts = msg.options || {};
  var integrations = opts.integrations || {};
  var providers = opts.providers || {};
  var context = opts.context || {};
  var ret = {};
  debug('<-', msg);

  // integrations.
  each(function(value, key) {
    if (!integration(key)) return;
    if (!has.call(integrations, key)) integrations[key] = value;
    delete opts[key];
  }, opts);

  // providers.
  delete opts.providers;
  each(function(value, key) {
    if (!integration(key)) return;
    if (type(integrations[key]) === 'object') return;
    if (has.call(integrations, key) && typeof providers[key] === 'boolean')
      return;
    integrations[key] = value;
  }, providers);

  // move all toplevel options to msg
  // and the rest to context.
  each(function(value, key) {
    if (includes(key, toplevel)) {
      ret[key] = opts[key];
    } else {
      context[key] = opts[key];
    }
  }, opts);

  // generate and attach a messageId to msg
  msg.messageId = 'ajs-' + md5(json.stringify(msg) + uuid());

  // cleanup
  delete msg.options;
  ret.integrations = integrations;
  ret.context = context;
  ret = defaults(ret, msg);
  debug('->', ret);
  return ret;

  function integration(name) {
    return !!(
      includes(name, list) ||
      name.toLowerCase() === 'all' ||
      includes(name.toLowerCase(), lower)
    );
  }
}
