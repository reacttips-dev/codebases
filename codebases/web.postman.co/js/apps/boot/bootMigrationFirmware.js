import { start } from 'waterline';
import { getIndexedDbName, getIndexedVersion } from '../../modules/initialize-db/indexeddb-helpers';
import partitionUtils from '../../shell/partitionUtils';
const wlRemoteIndexedDB = require('../../common/adapters/waterline-remote-indexeddb');

const allPmModels = require('../../modules/models');

let pmModels = {};


_.forEach(allPmModels, function (model, key) {
  pmModels[key] = _.cloneDeep(model);
  pmModels[key].datastore = 'remote-indexeddb';
});

const uuidV4 = require('uuid/v4'),
  { createEvent, getEventData } = require('./../../modules/model-event.js');

/**
 * List of pending callback for requests
 */
let pendingPromises = new Map();

/**
 * Initialize the webview and setup the listeners for the migrator
 */
export default function initializeMigrationFirmware (cb) {

  pm.logger.info('bootMigrationFirmware~initializeMigrationFirmware : started');

  if (window.pm.migrator) {
    pm.logger.info('bootMigrationFirmware~initializeMigrationFirmware : pm.migrator already set. bailing out');
    return cb();
  }

  let appRoot = document.querySelector('body'),

  newWebview = getFirmwareWebview();

  newWebview && appRoot.appendChild(newWebview);

  window.pm = window.pm || {};

  // Adapters for the different APIs that need to be exposed
  window.pm.migrator = {
    localStorage: getLocalStorageAdapter(newWebview),
    models: {}
  };

  /**
   *
   * @param {*} webView
   * @param {*} event
   */
  function broadCastIDBMessage (event) {
    newWebview.send('waterline-remote-indexeddb-internal', event);
  }

  /**
   *
   */
  function getRemoteIndexedDbConfig () {
    return {
      adapter: 'waterline-remote-indexeddb',
      master: false,
      database: getIndexedDbName(),
      version: getIndexedVersion(),
      send: function (data) {
        broadCastIDBMessage(data);
      },
      listen: function (cb) {
        newWebview.addEventListener('ipc-message', (message) => {
          if (message.channel !== 'waterline-remote-indexeddb-internal') {
            return;
          }

          let event = _.get(message, 'args[0]');

          if (!event) {
            return;
          }

          cb(event);
        });
      }
    };
  }


  /**
   *
   * Initializes waterline models and returns orm instance
   * @export
   * @param {function} done
   */
  function bootstrapORM (done) {

    pm.logger.info('bootMigrationFirmware~bootstrapORM : started');

    start({
      models: pmModels,

      // waterline adds a model called archive to store all records for `model.archive()`
      // `archiveModelIdentity: false` will disable the `archive` functionality
      // see https://github.com/balderdashy/waterline/blob/cc758f44c9dd2a771233a7acf3f34dd641407c5b/lib/waterline.js#L397-L400
      // to avoid setting this in each of the model we set this property as the default setting
      // for all models
      // see https://github.com/balderdashy/waterline/blob/cc758f44c9dd2a771233a7acf3f34dd641407c5b/lib/waterline.js#L850-L854
      defaultModelSettings: { archiveModelIdentity: false },
      adapters: {
        'waterline-remote-indexeddb': wlRemoteIndexedDB
      },
      datastores: {
        'remote-indexeddb': getRemoteIndexedDbConfig()
      }
    }, function (err, orm) {
      if (err) {
        pm.logger.error('bootMigrationFirmware~bootstrapORM - Failed', err);
        return done(err);
      }
      pm.logger.info('bootMigrationFirmware~bootstrapORM- Success');
      return done(null, orm);
    });
  }

  newWebview.addEventListener('dom-ready', function () {

    pm.logger.info('bootMigrationFirmware~bootstrapORM : webview dom-ready');

    bootstrapORM((err, orm) => {
      if (err) {
        pm.logger.error('bootMigrationFirmware~webview(dom-ready callback) - Failed', err);
        cb && cb(err);
        return;
      }

      _.set(window, 'pm.migrator.models', orm.collections);

      cb && cb();
    });
  });
}

/**
 * Get the webview for the migrator
 */
function getFirmwareWebview () {
  let webView = document.createElement('webview'),
    partition = getSourcePartition();

  pm.logger.info('bootMigrationFirmware~getFirmwareWebview : partition string created', partition);

  webView.setAttribute('style', 'display: none');
  webView.setAttribute('nodeintegration', true);
  webView.setAttribute('src', new URL('migration-firmware.html', window.location.href).href);
  webView.setAttribute('partition', partition);

  setupListenersForWebview(webView);

  // NOTE: AUTOMATICALLY OPENING DEV-TOOLS FOR DEBUGGING
  webView.addEventListener('dom-ready', () => {
    // webView.openDevTools();
  });

  pm.logger.info('bootMigrationFirmware~getFirmwareWebview : webview created');

  return webView;
}

/**
 * Listen for IPC messages coming from the webview
 */
function setupListenersForWebview (webView) {
  webView.addEventListener('ipc-message', (message) => {
    if (message.channel !== 'migrator-response') {
      return;
    }

    let event = _.get(message, 'args[0]');

    if (!event) {
      return;
    }

    let eventData = getEventData(event),
      eventId = eventData && eventData.id;

    if (!eventId || !eventData) {
      return;
    }

    let { resolve, reject } = pendingPromises.get(eventId);

    // Delete the callbacks from the list of pending promises
    pendingPromises.delete(eventId);

    return resolve(eventData);
  });
}

/**
 * Get the partition
 */
function getSourcePartition () {
  let currentURL = new URL(location.href),
    partitionId = currentURL.searchParams.get('scratchpadPartitionId');

  return partitionUtils.getPersistedPartitionString(partitionId);
}

/**
 * Send a message to the webview
 *
 * @param {*} webView
 * @param {*} message
 */
function sendMessageToWebview (webView, event) {
  return new Promise((resolve, reject) => {
    let id = uuidV4(),
      data = getEventData(event);

    event.data = {
      ...data,
      id
    };

    pendingPromises.set(id, { resolve, reject });

    webView.send('migrator-message', event);
  });
}

/**
 * Adapter to enable interaction with localStorage
 */
function getLocalStorageAdapter (webview) {

  pm.logger.info('bootMigrationFirmware~getLocalStorageAdapter : getting local storage adapter');

  return {
    getItem: (key) => {
      let event = createEvent('getItem', 'localStorage', { key });

      return sendMessageToWebview(webview, event)
        .then((payload) => {
          return payload.value;
        });
    },

    setItem: (key, value) => {
      let event = createEvent('setItem', 'localStorage', { key, value });

      return sendMessageToWebview(webview, event);
    },

    removeItem: (key) => {
      let event = createEvent('removeItem', 'localStorage', { key });

      return sendMessageToWebview(webview, event);
    }
  };
}
