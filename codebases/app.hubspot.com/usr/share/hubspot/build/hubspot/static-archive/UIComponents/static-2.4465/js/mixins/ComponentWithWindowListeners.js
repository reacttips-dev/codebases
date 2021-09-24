'use es6';

import invariant from 'react-utils/invariant';
var ComponentWithWindowListeners = {
  componentDidMount: function componentDidMount() {
    invariant(typeof this.getWindowListeners === 'function', 'ComponentWithWindowListeners: component must define' + ' a getWindowListeners function.');
    this._componentMountedWindowListener = true;
    this._windowListeners = this.getWindowListeners();

    if (this.shouldBindWindowListeners()) {
      this.bindWindowListeners();
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    this._componentMountedWindowListener = false;
    this.unbindWindowListeners();
  },
  componentDidUpdate: function componentDidUpdate() {
    if (this.shouldBindWindowListeners()) {
      this.bindWindowListeners();
    } else {
      this.unbindWindowListeners();
    }
  },
  bindWindowListeners: function bindWindowListeners() {
    if (this._windowListenersBound) {
      return;
    }

    var windowListeners = this._windowListeners;
    Object.keys(windowListeners).forEach(function (eventName) {
      addEventListener(eventName, windowListeners[eventName]);
    });
    this._windowListenersBound = true;
  },
  unbindWindowListeners: function unbindWindowListeners() {
    if (!this._windowListenersBound) {
      return;
    }

    var windowListeners = this._windowListeners;
    Object.keys(windowListeners).forEach(function (eventName) {
      removeEventListener(eventName, windowListeners[eventName]);
    });
    this._windowListenersBound = false;
  },
  shouldBindWindowListeners: function shouldBindWindowListeners() {
    if (!this._componentMountedWindowListener) {
      // It's apparently possible for componentDidUpdate() to be called after
      // componentWillUnmount(). See #2287
      return false;
    }

    var getWindowListenersActive = this.getWindowListenersActive;
    var hasActiveCondition = typeof getWindowListenersActive === 'function';
    return hasActiveCondition ? getWindowListenersActive() : true;
  }
};
export default ComponentWithWindowListeners;