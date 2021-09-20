'use strict';

var Facade = require('segmentio-facade');

module.exports.SourceMiddlewareChain = function SourceMiddlewareChain() {
  var apply = middlewareChain(this);

  this.applyMiddlewares = function(facade, integrations, callback) {
    return apply(
      function(mw, payload, next) {
        mw({
          integrations: integrations,
          next: next,
          payload: payload
        });
      },
      facade,
      callback
    );
  };
};

module.exports.IntegrationMiddlewareChain = function IntegrationMiddlewareChain() {
  var apply = middlewareChain(this);

  this.applyMiddlewares = function(facade, integration, callback) {
    return apply(
      function(mw, payload, next) {
        mw(payload, integration, next);
      },
      facade,
      callback
    );
  };
};

// Chain is essentially a linked list of middlewares to run in order.
function middlewareChain(dest) {
  var middlewares = [];

  // Return a copy to prevent external mutations.
  dest.getMiddlewares = function() {
    return middlewares.slice();
  };

  dest.add = function(middleware) {
    if (typeof middleware !== 'function')
      throw new Error('attempted to add non-function middleware');

    // Check for identical object references - bug check.
    if (middlewares.indexOf(middleware) !== -1)
      throw new Error('middleware is already registered');
    middlewares.push(middleware);
  };

  // fn is the callback to be run once all middlewares have been applied.
  return function applyMiddlewares(run, facade, callback) {
    if (typeof facade !== 'object')
      throw new Error('applyMiddlewares requires a payload object');
    if (typeof callback !== 'function')
      throw new Error('applyMiddlewares requires a function callback');

    // Attach callback to the end of the chain.
    var middlewaresToApply = middlewares.slice();
    middlewaresToApply.push(callback);
    executeChain(run, facade, middlewaresToApply, 0);
  };
}

// Go over all middlewares until all have been applied.
function executeChain(run, payload, middlewares, index) {
  // If the facade has been nullified, immediately skip to the final middleware.
  if (payload === null) {
    middlewares[middlewares.length - 1](null);
    return;
  }

  // Check if the payload is still a Facade. If not, convert it to one.
  if (!(payload instanceof Facade)) {
    payload = new Facade(payload);
  }

  var mw = middlewares[index];
  if (mw) {
    // If there's another middleware, continue down the chain. Otherwise, call the final function.
    if (middlewares[index + 1]) {
      run(mw, payload, function(result) {
        executeChain(run, result, middlewares, ++index);
      });
    } else {
      mw(payload);
    }
  }
}

module.exports.middlewareChain = middlewareChain;
