/**
 * Flux Application Dispatcher.
 * Create an instance for using with a new Flux app.
 */
import _ from 'lodash';

import Dispatcher from 'js/vendor/Dispatcher';

const AppDispatcher = function () {
  Dispatcher.call(this);
};

_.extend(AppDispatcher.prototype, Dispatcher.prototype);

AppDispatcher.prototype.handleServerAction = function (action) {
  this.dispatch({
    action,
    source: 'server',
  });
};

AppDispatcher.prototype.handleViewAction = function (action) {
  this.dispatch({
    action,
    source: 'view',
  });
};

export default AppDispatcher;
