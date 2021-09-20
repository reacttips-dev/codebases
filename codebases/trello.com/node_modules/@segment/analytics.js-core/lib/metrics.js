'use strict';

var bindAll = require('bind-all');
var send = require('@segment/send-json');
var debug = require('debug')('analytics.js:metrics');

function Metrics(options) {
  this.options(options);
}

/**
 * Set the metrics options.
 *
 * @param {Object} options
 *   @field {String} host
 *   @field {Number} sampleRate
 *   @field {Number} flushTimer
 */

Metrics.prototype.options = function(options) {
  options = options || {};

  this.host = options.host || 'api.segment.io/v1';
  this.sampleRate = options.sampleRate || 0; // disable metrics by default.
  this.flushTimer = options.flushTimer || 30 * 1000 /* 30s */;
  this.maxQueueSize = options.maxQueueSize || 20;

  this.queue = [];

  if (this.sampleRate > 0) {
    var self = this;
    setInterval(function() {
      self._flush();
    }, this.flushTimer);
  }
};

/**
 * Increments the counter identified by name and tags by one.
 *
 * @param {String} metric Name of the metric to increment.
 * @param {Object} tags Dimensions associated with the metric.
 */
Metrics.prototype.increment = function(metric, tags) {
  if (Math.random() > this.sampleRate) {
    return;
  }

  if (this.queue.length >= this.maxQueueSize) {
    return;
  }

  this.queue.push({ type: 'Counter', metric: metric, value: 1, tags: tags });

  // Trigger a flush if this is an error metric.
  if (metric.indexOf('error') > 0) {
    this._flush();
  }
};

/**
 * Flush all queued metrics.
 */
Metrics.prototype._flush = function() {
  var self = this;

  if (self.queue.length <= 0) {
    return;
  }

  var payload = { series: this.queue };
  var headers = { 'Content-Type': 'text/plain' };

  self.queue = [];

  // This endpoint does not support jsonp, so only proceed if the browser
  // supports xhr.
  if (send.type !== 'xhr') return;

  send('https://' + this.host + '/m', payload, headers, function(err, res) {
    debug('sent %O, received %O', payload, [err, res]);
  });
};

/**
 * Expose the metrics singleton.
 */

module.exports = bindAll(new Metrics());

/**
 * Expose the `Metrics` constructor.
 */

module.exports.Metrics = Metrics;
