
import Backbone from 'backbone';
const initializeEventBus = require('../../common/initializeEventBus');
import Mediator from '../../models/Mediator';
import EventEmitter from 'events';

/**
 *
 * @param {*} cb
 */
function bootMessaging (cb) {

  _.assign(window.pm, {
    mediator: Mediator,

    // Event emitter to listen for events for the current window
    windowEvents: new EventEmitter()
  });

  // attaches event bus to pm
  initializeEventBus();

  pm.logger.info('Messaging~boot - Success');
  cb && cb(null);
}

export default bootMessaging;
