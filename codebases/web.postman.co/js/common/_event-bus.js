var _ = require('lodash'),
    EventEmitter = require('events');

// INTERNAL CHANNEL INDENTIFIERS
var INTERNAL_CHANNEL_BROADCAST_MAIN = 'PM_EB_INT_BROADCAST_MAIN',
    INTERNAL_CHANNEL_BROADCAST_REND = 'PM_EB_INT_BROADCAST_REND';

let { isBrowser } = require('./utils/processUtils');

/**
 * utility function to decide if current context is renderer or main process
 *
 * @returns
 */
function _isRenderer () {
  // renderer with nodeIntegration turned off
  if (!process) {
    return true;
  }

  // hack for process race condition in renderer processes
  if (process.browser) {
    return true;
  }

  // checking process.type
  return (process.type === 'renderer');
}

/**
 * constructs webcontents id
 *
 * @param {any} webContents
 * @returns
 */
function getWebContentsId (webContents) {
  return 'renderer-' + webContents.id;
}

/**
 * broadcasts to bus (renderer)
 *
 * @param {any} message
 */
function _broadcastRenderer (message, options) {
  const ipcRenderer = pm.sdk && pm.sdk.IPC;

  ipcRenderer.send(INTERNAL_CHANNEL_BROADCAST_MAIN, message, options);
}

/**
 * broadcasts to bus (main)
 *
 * @param {any} message
 */
function _broadcastMain (message) {
  _sendToWebContents(message);
}

/**
 * broadcast the message to all renderers
 *
 * @param {any} message
 */
function _sendToWebContents (message) {
  var allWebContents = require('electron').webContents.getAllWebContents();
  _.chain(allWebContents)
    .filter(function (webContents) {
      let isWindowOrWebView = _.includes(['window', 'webview'], webContents.getType());

      // if not a window or webview we return false, as we cannot send event to it
      if (!isWindowOrWebView) {
        return false;
      }

      let sourceUrl = webContents.getURL(),
        isEmbeddedScratchpad = _isCurrentUrlScratchpadInPage(sourceUrl);

      if (isEmbeddedScratchpad) {
        // if the web content is a scratchpad webview in page and event is from
        // 'embedded-scratchpad' or 'main' zone, then we send it to the webview
        if ((_.includes(['embedded-scratchpad', 'main'], message.source.zone))) {
          return true;
        }
        return false;
      }

      // if the zone of the message is 'embedded-scratchpad' do not send it to
      // any window or webview other than embedded scratchpad webview
      if (message.source.zone === 'embedded-scratchpad') {
        return false;
      }

      // for all other cases
      return true;
    })
    .forEach(function (webContents) {
      try {
        webContents.send(INTERNAL_CHANNEL_BROADCAST_REND, message);
      }
      catch (e) {
        pm.logger.error('IPC Main: Bad usage of IPC', { channel: INTERNAL_CHANNEL_BROADCAST_REND, message, e });

        let newMessage;
        try {
          newMessage = JSON.parse(JSON.stringify(message));
          webContents.send(INTERNAL_CHANNEL_BROADCAST_REND, newMessage);
        }
        catch (err) {
          pm.logger.error('IPC Main: Bad usage of IPC, cannot stringify circular/BigInt referenced object', { channel: INTERNAL_CHANNEL_BROADCAST_REND, newMessage, err });
        }
      }
    })
    .value();
}

/**
 * check if the passed url is Scratch Pad in page
 * @param {*} url
 */
function _isCurrentUrlScratchpadInPage (url) {
  if (!url) {
    return false;
  }

  let queryParams = new URLSearchParams(url),
  isEmbeddedScratchpad = (url.indexOf('scratchpad.html') > -1 &&
      queryParams.get('isEmbedded'));
  return isEmbeddedScratchpad;
}

/**
 * constructs broadcast message payload
 *
 * @param {any} channel
 * @param {any} payload
 * @param {any} source
 * @param {any} target
 * @returns
 */
function _constructMessage (channel, payload, source, target) {
  return {
    channel: channel,
    payload: payload,
    source: source,
    target: target
  };
}

/**
 * gets current context
 *
 * @returns
 */
function _getCurrentContext () {
  // renderer process - window or webview
  if (_isRenderer()) {
    var currentWebContents = require('electron').remote.getCurrentWebContents(),
      sourceUrl = currentWebContents.getURL(),
      isEmbeddedScratchpad = _isCurrentUrlScratchpadInPage(sourceUrl);

    return {
      type: isBrowser() ? 'renderer' : currentWebContents.getType(),
      id: isBrowser() ? 'renderer-0' : getWebContentsId(currentWebContents),
      zone: isEmbeddedScratchpad ? 'embedded-scratchpad' : 'requester'
    };
  }

  // node process
  return {
    type: 'main',
    id: 'main-0',
    zone: 'main'
  };
}

/**
 * Context specific node
 *
 * @param       {[type]} node [description]
 * @constructor
 */
function EventBus (_context) {
  var _emitter = new EventEmitter();

  // @todo use this to get around max listeners warning
  // _emitter.setMaxListeners();

  /**
   * publish to channel
   *
   * @param {String} channel
   * @param {any} payload
   */
  function _publish (channel, payload, options = {}) {
    var message = _constructMessage(channel, payload, _context);

    if (isBrowser()) {
      _dispatch(message);
      return;
    } else {
      if (_isRenderer()) {
        _broadcastRenderer(message, options);
      }
      else {
        // We need to dispatch event to the calling process as well.
        _dispatch(message);

        // If we specified only to main, then don't broadCastToRenders
        if (!options.onlyToMain) {
          _broadcastMain(message);
        }
      }
    }
  }

  /**
   * subscribe to channel
   *
   * @param {String} channel
   * @param {any} payload
   * @param {any} opts
   */
  function _subscribe (channel, listener, opts) {
    if (opts && opts.once) {
      _emitter.once(channel, listener);
    }
    else {
      _emitter.addListener(channel, listener);
    }
    return _unsubscribe.bind(this, channel, listener);
  }

  /**
   * unsubscribe to listener from channel
   *
   * @param {String} channel
   * @param {any} listener
   */
  function _unsubscribe (channel, listener) {
    _emitter.removeListener(channel, listener);
  }

  /**
   * dispatch internal event to the channel
   *
   * @param {any} message
   */
  function _dispatch (message) {
    // As a performance improvement from Electron 9, there is a IPC API change which now throws exception
    // over sending functions, promises or objects containing any such values through ipc.
    // Read more about this here https://www.electronjs.org/docs/breaking-changes#behavior-changed-values-sent-over-ipc-are-now-serialized-with-structured-clone-algorithm
    // This _dispatch is used to emit the message within the same process [Main-> Main] and [Renderer-> Renderer] and being called before sending data over IPC.
    // Since sometimes the consumer of this eventemitter is updating the data (`message.payload`) value and adding a unsafe function to it which on send over IPC throws error.
    // Hence sending the copy of (message.payload) such that it doesn't get modified by the listeners of these event.
    _emitter.emit(message.channel, _.cloneDeep(message.payload));
  }

  /**
   * Attach internal listeners
   */
  (function _attachInternalEvents () {
    if (_isRenderer()) {
      const ipcRenderer = pm.sdk && pm.sdk.IPC;

      ipcRenderer.subscribe(INTERNAL_CHANNEL_BROADCAST_REND, function (event, message) {
        _dispatch(message);
      });
    }
    else {
      const ipcMain = pm.sdk.IPC;

      ipcMain.subscribe(INTERNAL_CHANNEL_BROADCAST_MAIN, function (event, message, options) {
          _dispatch(message);
          if (!options.onlyToMain) {
            _broadcastMain(message);
          }
        });
    }
  })();

  this.channel = function (channel) {
    return {
      subscribe: _subscribe.bind(this, channel),
      publish: _publish.bind(this, channel)
    };
  };
}

module.exports = function initialize () {
  return (new EventBus(_getCurrentContext()));
};
