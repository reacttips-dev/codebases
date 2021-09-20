var initializeEventBus = require('./_event-bus');

/**
 * Initializes event bus on the global `pm` object. Does nothing if it is already initialized.
 */
module.exports = function () {
  if (global && global.pm && global.pm.eventBus) {
    return;
  }

  global.pm = global.pm || {};
  global.pm.eventBus = initializeEventBus();

  global.pm.logger.info('EventBus~initialize - Success');
};
