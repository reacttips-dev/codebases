'use strict';

var each = require('@ndhoule/each');

var CLOCK_LATE_FACTOR = 2;

var defaultClock = {
  setTimeout: function(fn, ms) {
    return window.setTimeout(fn, ms);
  },
  clearTimeout: function(id) {
    return window.clearTimeout(id);
  },
  Date: window.Date
};

var clock = defaultClock;

var modes = {
  ASAP: 1,
  RESCHEDULE: 2,
  ABANDON: 3
};

function Schedule() {
  this.tasks = {};
  this.nextId = 1;
}

Schedule.prototype.now = function() {
  return +new clock.Date();
};

Schedule.prototype.run = function(task, timeout, mode) {
  var id = this.nextId++;

  this.tasks[id] = clock.setTimeout(this._handle(id, task, timeout, mode || modes.ASAP), timeout);
  return id;
};

Schedule.prototype.cancel = function(id) {
  if (this.tasks[id]) {
    clock.clearTimeout(this.tasks[id]);
    delete this.tasks[id];
  }
};

Schedule.prototype.cancelAll = function() {
  each(clock.clearTimeout, this.tasks);
  this.tasks = {};
};

Schedule.prototype._handle = function(id, callback, timeout, mode) {
  var self = this;
  var start = self.now();
  return function() {
    delete self.tasks[id];
    if (mode >= modes.RESCHEDULE && start + timeout * CLOCK_LATE_FACTOR < self.now()) {
      if (mode === modes.RESCHEDULE) {
        self.run(callback, timeout, mode);
      }
      return;
    }
    return callback();
  };
};

Schedule.setClock = function(newClock) {
  clock = newClock;
};

Schedule.resetClock = function() {
  clock = defaultClock;
};

Schedule.Modes = modes;

module.exports = Schedule;
