'use strict';

var _analytics = global.analytics;

/*
 * Module dependencies.
 */

var Alias = require('segmentio-facade').Alias;
var Emitter = require('component-emitter');
var Facade = require('segmentio-facade');
var Group = require('segmentio-facade').Group;
var Identify = require('segmentio-facade').Identify;
var SourceMiddlewareChain = require('./middleware').SourceMiddlewareChain;
var IntegrationMiddlewareChain = require('./middleware')
  .IntegrationMiddlewareChain;
var Page = require('segmentio-facade').Page;
var Track = require('segmentio-facade').Track;
var bindAll = require('bind-all');
var clone = require('@ndhoule/clone');
var extend = require('extend');
var cookie = require('./cookie');
var metrics = require('./metrics');
var debug = require('debug');
var defaults = require('@ndhoule/defaults');
var each = require('@ndhoule/each');
var foldl = require('@ndhoule/foldl');
var group = require('./group');
var is = require('is');
var isMeta = require('@segment/is-meta');
var keys = require('@ndhoule/keys');
var memory = require('./memory');
var nextTick = require('next-tick');
var normalize = require('./normalize');
var on = require('component-event').bind;
var pageDefaults = require('./pageDefaults');
var pick = require('@ndhoule/pick');
var prevent = require('@segment/prevent-default');
var querystring = require('component-querystring');
var store = require('./store');
var user = require('./user');
var type = require('component-type');

/**
 * Initialize a new `Analytics` instance.
 */

function Analytics() {
  this._options({});
  this.Integrations = {};
  this._sourceMiddlewares = new SourceMiddlewareChain();
  this._integrationMiddlewares = new IntegrationMiddlewareChain();
  this._integrations = {};
  this._readied = false;
  this._timeout = 300;
  // XXX: BACKWARDS COMPATIBILITY
  this._user = user;
  this.log = debug('analytics.js');
  bindAll(this);

  var self = this;
  this.on('initialize', function(settings, options) {
    if (options.initialPageview) self.page();
    self._parseQuery(window.location.search);
  });
}

/**
 * Mix in event emitter.
 */

Emitter(Analytics.prototype);

/**
 * Use a `plugin`.
 *
 * @param {Function} plugin
 * @return {Analytics}
 */

Analytics.prototype.use = function(plugin) {
  plugin(this);
  return this;
};

/**
 * Define a new `Integration`.
 *
 * @param {Function} Integration
 * @return {Analytics}
 */

Analytics.prototype.addIntegration = function(Integration) {
  var name = Integration.prototype.name;
  if (!name) throw new TypeError('attempted to add an invalid integration');
  this.Integrations[name] = Integration;
  return this;
};

/**
 * Define a new `SourceMiddleware`
 *
 * @param {Function} Middleware
 * @return {Analytics}
 */

Analytics.prototype.addSourceMiddleware = function(middleware) {
  if (this.initialized)
    throw new Error(
      'attempted to add a source middleware after initialization'
    );

  this._sourceMiddlewares.add(middleware);
  return this;
};

/**
 * Define a new `IntegrationMiddleware`
 *
 * @param {Function} Middleware
 * @return {Analytics}
 */

Analytics.prototype.addIntegrationMiddleware = function(middleware) {
  if (this.initialized)
    throw new Error(
      'attempted to add an integration middleware after initialization'
    );

  this._integrationMiddlewares.add(middleware);
  return this;
};

/**
 * Initialize with the given integration `settings` and `options`.
 *
 * Aliased to `init` for convenience.
 *
 * @param {Object} [settings={}]
 * @param {Object} [options={}]
 * @return {Analytics}
 */

Analytics.prototype.init = Analytics.prototype.initialize = function(
  settings,
  options
) {
  settings = settings || {};
  options = options || {};

  this._options(options);
  this._readied = false;

  // clean unknown integrations from settings
  var self = this;
  each(function(opts, name) {
    var Integration = self.Integrations[name];
    if (!Integration) delete settings[name];
  }, settings);

  // add integrations
  each(function(opts, name) {
    // Don't load disabled integrations
    if (options.integrations) {
      if (
        options.integrations[name] === false ||
        (options.integrations.All === false && !options.integrations[name])
      ) {
        return;
      }
    }

    var Integration = self.Integrations[name];
    var clonedOpts = {};
    extend(true, clonedOpts, opts); // deep clone opts
    var integration = new Integration(clonedOpts);
    self.log('initialize %o - %o', name, opts);
    self.add(integration);
  }, settings);

  var integrations = this._integrations;

  // load user now that options are set
  user.load();
  group.load();

  // make ready callback
  var readyCallCount = 0;
  var integrationCount = keys(integrations).length;
  var ready = function() {
    readyCallCount++;
    if (readyCallCount >= integrationCount) {
      self._readied = true;
      self.emit('ready');
    }
  };

  // init if no integrations
  if (integrationCount <= 0) {
    ready();
  }

  // initialize integrations, passing ready
  // create a list of any integrations that did not initialize - this will be passed with all events for replay support:
  this.failedInitializations = [];
  var initialPageSkipped = false;
  each(function(integration) {
    if (
      options.initialPageview &&
      integration.options.initialPageview === false
    ) {
      // We've assumed one initial pageview, so make sure we don't count the first page call.
      var page = integration.page;
      integration.page = function() {
        if (initialPageSkipped) {
          return page.apply(this, arguments);
        }
        initialPageSkipped = true;
        return;
      };
    }

    integration.analytics = self;

    integration.once('ready', ready);
    try {
      metrics.increment('analytics_js.integration.invoke', {
        method: 'initialize',
        integration_name: integration.name
      });
      integration.initialize();
    } catch (e) {
      var integrationName = integration.name;
      metrics.increment('analytics_js.integration.invoke.error', {
        method: 'initialize',
        integration_name: integration.name
      });
      self.failedInitializations.push(integrationName);
      self.log('Error initializing %s integration: %o', integrationName, e);
      // Mark integration as ready to prevent blocking of anyone listening to analytics.ready()

      integration.ready();
    }
  }, integrations);

  // backwards compat with angular plugin and used for init logic checks
  this.initialized = true;

  this.emit('initialize', settings, options);
  return this;
};

/**
 * Set the user's `id`.
 *
 * @param {Mixed} id
 */

Analytics.prototype.setAnonymousId = function(id) {
  this.user().anonymousId(id);
  return this;
};

/**
 * Add an integration.
 *
 * @param {Integration} integration
 */

Analytics.prototype.add = function(integration) {
  this._integrations[integration.name] = integration;
  return this;
};

/**
 * Identify a user by optional `id` and `traits`.
 *
 * @param {string} [id=user.id()] User ID.
 * @param {Object} [traits=null] User traits.
 * @param {Object} [options=null]
 * @param {Function} [fn]
 * @return {Analytics}
 */

Analytics.prototype.identify = function(id, traits, options, fn) {
  // Argument reshuffling.
  /* eslint-disable no-unused-expressions, no-sequences */
  if (is.fn(options)) (fn = options), (options = null);
  if (is.fn(traits)) (fn = traits), (options = null), (traits = null);
  if (is.object(id)) (options = traits), (traits = id), (id = user.id());
  /* eslint-enable no-unused-expressions, no-sequences */

  // clone traits before we manipulate so we don't do anything uncouth, and take
  // from `user` so that we carryover anonymous traits
  user.identify(id, traits);

  var msg = this.normalize({
    options: options,
    traits: user.traits(),
    userId: user.id()
  });

  // Add the initialize integrations so the server-side ones can be disabled too
  if (this.options.integrations) {
    defaults(msg.integrations, this.options.integrations);
  }

  this._invoke('identify', new Identify(msg));

  // emit
  this.emit('identify', id, traits, options);
  this._callback(fn);
  return this;
};

/**
 * Return the current user.
 *
 * @return {Object}
 */

Analytics.prototype.user = function() {
  return user;
};

/**
 * Identify a group by optional `id` and `traits`. Or, if no arguments are
 * supplied, return the current group.
 *
 * @param {string} [id=group.id()] Group ID.
 * @param {Object} [traits=null] Group traits.
 * @param {Object} [options=null]
 * @param {Function} [fn]
 * @return {Analytics|Object}
 */

Analytics.prototype.group = function(id, traits, options, fn) {
  /* eslint-disable no-unused-expressions, no-sequences */
  if (!arguments.length) return group;
  if (is.fn(options)) (fn = options), (options = null);
  if (is.fn(traits)) (fn = traits), (options = null), (traits = null);
  if (is.object(id)) (options = traits), (traits = id), (id = group.id());
  /* eslint-enable no-unused-expressions, no-sequences */

  // grab from group again to make sure we're taking from the source
  group.identify(id, traits);

  var msg = this.normalize({
    options: options,
    traits: group.traits(),
    groupId: group.id()
  });

  // Add the initialize integrations so the server-side ones can be disabled too
  if (this.options.integrations) {
    defaults(msg.integrations, this.options.integrations);
  }

  this._invoke('group', new Group(msg));

  this.emit('group', id, traits, options);
  this._callback(fn);
  return this;
};

/**
 * Track an `event` that a user has triggered with optional `properties`.
 *
 * @param {string} event
 * @param {Object} [properties=null]
 * @param {Object} [options=null]
 * @param {Function} [fn]
 * @return {Analytics}
 */

Analytics.prototype.track = function(event, properties, options, fn) {
  // Argument reshuffling.
  /* eslint-disable no-unused-expressions, no-sequences */
  if (is.fn(options)) (fn = options), (options = null);
  if (is.fn(properties))
    (fn = properties), (options = null), (properties = null);
  /* eslint-enable no-unused-expressions, no-sequences */

  // figure out if the event is archived.
  var plan = this.options.plan || {};
  var events = plan.track || {};
  var planIntegrationOptions = {};

  // normalize
  var msg = this.normalize({
    properties: properties,
    options: options,
    event: event
  });

  // plan.
  plan = events[event];
  if (plan) {
    this.log('plan %o - %o', event, plan);
    if (plan.enabled === false) {
      // Disabled events should always be sent to Segment.
      planIntegrationOptions = { All: false, 'Segment.io': true };
    } else {
      planIntegrationOptions = plan.integrations || {};
    }
  } else {
    var defaultPlan = events.__default || { enabled: true };
    if (!defaultPlan.enabled) {
      // Disabled events should always be sent to Segment.
      planIntegrationOptions = { All: false, 'Segment.io': true };
    }
  }

  // Add the initialize integrations so the server-side ones can be disabled too
  defaults(
    msg.integrations,
    this._mergeInitializeAndPlanIntegrations(planIntegrationOptions)
  );

  this._invoke('track', new Track(msg));

  this.emit('track', event, properties, options);
  this._callback(fn);
  return this;
};

/**
 * Helper method to track an outbound link that would normally navigate away
 * from the page before the analytics calls were sent.
 *
 * BACKWARDS COMPATIBILITY: aliased to `trackClick`.
 *
 * @param {Element|Array} links
 * @param {string|Function} event
 * @param {Object|Function} properties (optional)
 * @return {Analytics}
 */

Analytics.prototype.trackClick = Analytics.prototype.trackLink = function(
  links,
  event,
  properties
) {
  if (!links) return this;
  // always arrays, handles jquery
  if (type(links) === 'element') links = [links];

  var self = this;
  each(function(el) {
    if (type(el) !== 'element') {
      throw new TypeError('Must pass HTMLElement to `analytics.trackLink`.');
    }
    on(el, 'click', function(e) {
      var ev = is.fn(event) ? event(el) : event;
      var props = is.fn(properties) ? properties(el) : properties;
      var href =
        el.getAttribute('href') ||
        el.getAttributeNS('http://www.w3.org/1999/xlink', 'href') ||
        el.getAttribute('xlink:href');

      self.track(ev, props);

      if (href && el.target !== '_blank' && !isMeta(e)) {
        prevent(e);
        self._callback(function() {
          window.location.href = href;
        });
      }
    });
  }, links);

  return this;
};

/**
 * Helper method to track an outbound form that would normally navigate away
 * from the page before the analytics calls were sent.
 *
 * BACKWARDS COMPATIBILITY: aliased to `trackSubmit`.
 *
 * @param {Element|Array} forms
 * @param {string|Function} event
 * @param {Object|Function} properties (optional)
 * @return {Analytics}
 */

Analytics.prototype.trackSubmit = Analytics.prototype.trackForm = function(
  forms,
  event,
  properties
) {
  if (!forms) return this;
  // always arrays, handles jquery
  if (type(forms) === 'element') forms = [forms];

  var self = this;
  each(function(el) {
    if (type(el) !== 'element')
      throw new TypeError('Must pass HTMLElement to `analytics.trackForm`.');
    function handler(e) {
      prevent(e);

      var ev = is.fn(event) ? event(el) : event;
      var props = is.fn(properties) ? properties(el) : properties;
      self.track(ev, props);

      self._callback(function() {
        el.submit();
      });
    }

    // Support the events happening through jQuery or Zepto instead of through
    // the normal DOM API, because `el.submit` doesn't bubble up events...
    var $ = window.jQuery || window.Zepto;
    if ($) {
      $(el).submit(handler);
    } else {
      on(el, 'submit', handler);
    }
  }, forms);

  return this;
};

/**
 * Trigger a pageview, labeling the current page with an optional `category`,
 * `name` and `properties`.
 *
 * @param {string} [category]
 * @param {string} [name]
 * @param {Object|string} [properties] (or path)
 * @param {Object} [options]
 * @param {Function} [fn]
 * @return {Analytics}
 */

Analytics.prototype.page = function(category, name, properties, options, fn) {
  // Argument reshuffling.
  /* eslint-disable no-unused-expressions, no-sequences */
  if (is.fn(options)) (fn = options), (options = null);
  if (is.fn(properties)) (fn = properties), (options = properties = null);
  if (is.fn(name)) (fn = name), (options = properties = name = null);
  if (type(category) === 'object')
    (options = name), (properties = category), (name = category = null);
  if (type(name) === 'object')
    (options = properties), (properties = name), (name = null);
  if (type(category) === 'string' && type(name) !== 'string')
    (name = category), (category = null);
  /* eslint-enable no-unused-expressions, no-sequences */

  properties = clone(properties) || {};
  if (name) properties.name = name;
  if (category) properties.category = category;

  // Ensure properties has baseline spec properties.
  // TODO: Eventually move these entirely to `options.context.page`
  var defs = pageDefaults();
  defaults(properties, defs);

  // Mirror user overrides to `options.context.page` (but exclude custom properties)
  // (Any page defaults get applied in `this.normalize` for consistency.)
  // Weird, yeah--moving special props to `context.page` will fix this in the long term.
  var overrides = pick(keys(defs), properties);
  if (!is.empty(overrides)) {
    options = options || {};
    options.context = options.context || {};
    options.context.page = overrides;
  }

  var msg = this.normalize({
    properties: properties,
    category: category,
    options: options,
    name: name
  });

  // Add the initialize integrations so the server-side ones can be disabled too
  if (this.options.integrations) {
    defaults(msg.integrations, this.options.integrations);
  }

  this._invoke('page', new Page(msg));

  this.emit('page', category, name, properties, options);
  this._callback(fn);
  return this;
};

/**
 * FIXME: BACKWARDS COMPATIBILITY: convert an old `pageview` to a `page` call.
 *
 * @param {string} [url]
 * @return {Analytics}
 * @api private
 */

Analytics.prototype.pageview = function(url) {
  var properties = {};
  if (url) properties.path = url;
  this.page(properties);
  return this;
};

/**
 * Merge two previously unassociated user identities.
 *
 * @param {string} to
 * @param {string} from (optional)
 * @param {Object} options (optional)
 * @param {Function} fn (optional)
 * @return {Analytics}
 */

Analytics.prototype.alias = function(to, from, options, fn) {
  // Argument reshuffling.
  /* eslint-disable no-unused-expressions, no-sequences */
  if (is.fn(options)) (fn = options), (options = null);
  if (is.fn(from)) (fn = from), (options = null), (from = null);
  if (is.object(from)) (options = from), (from = null);
  /* eslint-enable no-unused-expressions, no-sequences */

  var msg = this.normalize({
    options: options,
    previousId: from,
    userId: to
  });

  // Add the initialize integrations so the server-side ones can be disabled too
  if (this.options.integrations) {
    defaults(msg.integrations, this.options.integrations);
  }

  this._invoke('alias', new Alias(msg));

  this.emit('alias', to, from, options);
  this._callback(fn);
  return this;
};

/**
 * Register a `fn` to be fired when all the analytics services are ready.
 *
 * @param {Function} fn
 * @return {Analytics}
 */

Analytics.prototype.ready = function(fn) {
  if (is.fn(fn)) {
    if (this._readied) {
      nextTick(fn);
    } else {
      this.once('ready', fn);
    }
  }
  return this;
};

/**
 * Set the `timeout` (in milliseconds) used for callbacks.
 *
 * @param {Number} timeout
 */

Analytics.prototype.timeout = function(timeout) {
  this._timeout = timeout;
};

/**
 * Enable or disable debug.
 *
 * @param {string|boolean} str
 */

Analytics.prototype.debug = function(str) {
  if (!arguments.length || str) {
    debug.enable('analytics:' + (str || '*'));
  } else {
    debug.disable();
  }
};

/**
 * Apply options.
 *
 * @param {Object} options
 * @return {Analytics}
 * @api private
 */

Analytics.prototype._options = function(options) {
  options = options || {};
  this.options = options;
  cookie.options(options.cookie);
  metrics.options(options.metrics);
  store.options(options.localStorage);
  user.options(options.user);
  group.options(options.group);
  return this;
};

/**
 * Callback a `fn` after our defined timeout period.
 *
 * @param {Function} fn
 * @return {Analytics}
 * @api private
 */

Analytics.prototype._callback = function(fn) {
  if (is.fn(fn)) {
    this._timeout ? setTimeout(fn, this._timeout) : nextTick(fn);
  }
  return this;
};

/**
 * Call `method` with `facade` on all enabled integrations.
 *
 * @param {string} method
 * @param {Facade} facade
 * @return {Analytics}
 * @api private
 */

Analytics.prototype._invoke = function(method, facade) {
  var self = this;

  try {
    this._sourceMiddlewares.applyMiddlewares(
      extend(true, new Facade({}), facade),
      this._integrations,
      function(result) {
        // A nullified payload should not be sent.
        if (result === null) {
          self.log(
            'Payload with method "%s" was null and dropped by source a middleware.',
            method
          );
          return;
        }

        // Check if the payload is still a Facade. If not, convert it to one.
        if (!(result instanceof Facade)) {
          result = new Facade(result);
        }

        self.emit('invoke', result);
        metrics.increment('analytics_js.invoke', {
          method: method
        });

        applyIntegrationMiddlewares(result);
      }
    );
  } catch (e) {
    metrics.increment('analytics_js.invoke.error', {
      method: method
    });
    self.log(
      'Error invoking .%s method of %s integration: %o',
      method,
      name,
      e
    );
  }

  return this;

  function applyIntegrationMiddlewares(facade) {
    var failedInitializations = self.failedInitializations || [];
    each(function(integration, name) {
      var facadeCopy = extend(true, new Facade({}), facade);

      if (!facadeCopy.enabled(name)) return;
      // Check if an integration failed to initialize.
      // If so, do not process the message as the integration is in an unstable state.
      if (failedInitializations.indexOf(name) >= 0) {
        self.log(
          'Skipping invocation of .%s method of %s integration. Integration failed to initialize properly.',
          method,
          name
        );
      } else {
        try {
          // Apply any integration middlewares that exist, then invoke the integration with the result.
          self._integrationMiddlewares.applyMiddlewares(
            facadeCopy,
            integration.name,
            function(result) {
              // A nullified payload should not be sent to an integration.
              if (result === null) {
                self.log(
                  'Payload to integration "%s" was null and dropped by a middleware.',
                  name
                );
                return;
              }

              // Check if the payload is still a Facade. If not, convert it to one.
              if (!(result instanceof Facade)) {
                result = new Facade(result);
              }

              metrics.increment('analytics_js.integration.invoke', {
                method: method,
                integration_name: integration.name
              });

              integration.invoke.call(integration, method, result);
            }
          );
        } catch (e) {
          metrics.increment('analytics_js.integration.invoke.error', {
            method: method,
            integration_name: integration.name
          });
          self.log(
            'Error invoking .%s method of %s integration: %o',
            method,
            name,
            e
          );
        }
      }
    }, self._integrations);
  }
};

/**
 * Push `args`.
 *
 * @param {Array} args
 * @api private
 */

Analytics.prototype.push = function(args) {
  var method = args.shift();
  if (!this[method]) return;
  this[method].apply(this, args);
};

/**
 * Reset group and user traits and id's.
 *
 * @api public
 */

Analytics.prototype.reset = function() {
  this.user().logout();
  this.group().logout();
};

/**
 * Parse the query string for callable methods.
 *
 * @param {String} query
 * @return {Analytics}
 * @api private
 */

Analytics.prototype._parseQuery = function(query) {
  // Parse querystring to an object
  var q = querystring.parse(query);
  // Create traits and properties objects, populate from querysting params
  var traits = pickPrefix('ajs_trait_', q);
  var props = pickPrefix('ajs_prop_', q);
  // Trigger based on callable parameters in the URL
  if (q.ajs_uid) this.identify(q.ajs_uid, traits);
  if (q.ajs_event) this.track(q.ajs_event, props);
  if (q.ajs_aid) user.anonymousId(q.ajs_aid);
  return this;

  /**
   * Create a shallow copy of an input object containing only the properties
   * whose keys are specified by a prefix, stripped of that prefix
   *
   * @param {String} prefix
   * @param {Object} object
   * @return {Object}
   * @api private
   */

  function pickPrefix(prefix, object) {
    var length = prefix.length;
    var sub;
    return foldl(
      function(acc, val, key) {
        if (key.substr(0, length) === prefix) {
          sub = key.substr(length);
          acc[sub] = val;
        }
        return acc;
      },
      {},
      object
    );
  }
};

/**
 * Normalize the given `msg`.
 *
 * @param {Object} msg
 * @return {Object}
 */

Analytics.prototype.normalize = function(msg) {
  msg = normalize(msg, keys(this._integrations));
  if (msg.anonymousId) user.anonymousId(msg.anonymousId);
  msg.anonymousId = user.anonymousId();

  // Ensure all outgoing requests include page data in their contexts.
  msg.context.page = defaults(msg.context.page || {}, pageDefaults());

  return msg;
};

/**
 * Merges the tracking plan and initialization integration options.
 *
 * @param  {Object} planIntegrations Tracking plan integrations.
 * @return {Object}                  The merged integrations.
 */
Analytics.prototype._mergeInitializeAndPlanIntegrations = function(
  planIntegrations
) {
  // Do nothing if there are no initialization integrations
  if (!this.options.integrations) {
    return planIntegrations;
  }

  // Clone the initialization integrations
  var integrations = extend({}, this.options.integrations);
  var integrationName;

  // Allow the tracking plan to disable integrations that were explicitly
  // enabled on initialization
  if (planIntegrations.All === false) {
    integrations = { All: false };
  }

  for (integrationName in planIntegrations) {
    if (planIntegrations.hasOwnProperty(integrationName)) {
      // Don't allow the tracking plan to re-enable disabled integrations
      if (this.options.integrations[integrationName] !== false) {
        integrations[integrationName] = planIntegrations[integrationName];
      }
    }
  }

  return integrations;
};

/**
 * No conflict support.
 */

Analytics.prototype.noConflict = function() {
  window.analytics = _analytics;
  return this;
};

/*
 * Exports.
 */

module.exports = Analytics;
module.exports.cookie = cookie;
module.exports.memory = memory;
module.exports.store = store;
module.exports.metrics = metrics;
