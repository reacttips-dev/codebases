'use es6';

import { clientDependenciesSchema } from './schemas';
import * as eventPoolInterface from './eventPool';
import * as eventInterface from './event';
import * as dictionaryInterface from './dictionary';
import * as identifiersInterface from './identifiers';
import * as metaPropertiesInterface from './metaProperties';
import * as trackerInterface from './tracker';
import * as storageKeys from './storageKeys';
export var createClient = function createClient() {
  var dependencies = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  /*
   * Step 1: Normalize & validate client dependencies
   */
  var parsedDependencies = clientDependenciesSchema.normalize(dependencies);
  clientDependenciesSchema.validate(parsedDependencies, '"createClient"', function (err) {
    /* Rethrow to break execution thread */
    throw err;
  });
  /*
   * Step 2: Build the client with those dependencies
   */

  var clientName = parsedDependencies.clientName,
      getDebug = parsedDependencies.getDebug,
      getEmail = parsedDependencies.getEmail,
      getHubId = parsedDependencies.getHubId,
      getHstc = parsedDependencies.getHstc,
      getLang = parsedDependencies.getLang,
      getCurrentHref = parsedDependencies.getCurrentHref,
      getReferrer = parsedDependencies.getReferrer,
      getUserAgent = parsedDependencies.getUserAgent,
      getNetworkType = parsedDependencies.getNetworkType,
      getNetworkSpeed = parsedDependencies.getNetworkSpeed,
      getScreenWidth = parsedDependencies.getScreenWidth,
      getScreenHeight = parsedDependencies.getScreenHeight,
      getWindowWidth = parsedDependencies.getWindowWidth,
      getWindowHeight = parsedDependencies.getWindowHeight,
      getDeployableName = parsedDependencies.getDeployableName,
      getDeployableVersion = parsedDependencies.getDeployableVersion,
      getTempStorage = parsedDependencies.getTempStorage,
      logMessage = parsedDependencies.logMessage,
      logError = parsedDependencies.logError,
      reportError = parsedDependencies.reportError,
      send = parsedDependencies.send,
      setTempStorage = parsedDependencies.setTempStorage;
  var eventPool = eventPoolInterface.createEventPool({
    getTempStorage: getTempStorage,
    setTempStorage: setTempStorage
  });

  var sendToNetwork = function sendToNetwork(_ref, events) {
    var identifiers = _ref.identifiers,
        _ref$isBeforeUnload = _ref.isBeforeUnload,
        isBeforeUnload = _ref$isBeforeUnload === void 0 ? false : _ref$isBeforeUnload,
        _ref$isExternalHost = _ref.isExternalHost,
        isExternalHost = _ref$isExternalHost === void 0 ? false : _ref$isExternalHost;
    var isAuthed = !!(identifiers.raw.email && identifiers.raw.hubId);
    var query = "clientSendTimestamp=" + Date.now();

    if (isExternalHost) {
      query = query + "&dil=true";
    }

    send({
      events: events,
      isBeforeUnload: isBeforeUnload,
      isAuthed: isAuthed,
      query: query
    });
  };

  var flushPoolAndSendToNetwork = function flushPoolAndSendToNetwork(_ref2) {
    var identifiers = _ref2.identifiers;
    var events = eventPool.flush();

    if (events && events.length) {
      sendToNetwork({
        identifiers: identifiers
      }, events);
    }
  };

  var sendToPool = function sendToPool(_ref3, event) {
    var identifiers = _ref3.identifiers;

    if (!eventPool.getIsInitialized()) {
      eventPool.initialize({
        normalizeEvent: function normalizeEvent() {
          for (var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++) {
            rest[_key] = arguments[_key];
          }

          return eventInterface.normalizeIdentifiers.apply(eventInterface, [identifiers].concat(rest));
        }
      });
    }

    eventPool.push(event);
    eventPoolInterface.scheduleFlush(function () {
      return flushPoolAndSendToNetwork({
        identifiers: identifiers
      });
    });
  };

  var getShouldRecordEvents = function getShouldRecordEvents() {
    return getTempStorage(storageKeys.recorderEnabled) === 'true';
  };

  var safeRecordToStorage = function safeRecordToStorage(storageKey, data, limit) {
    try {
      var records = JSON.parse(getTempStorage(storageKey) || JSON.stringify([]));

      if (limit && records.length >= limit) {
        records.shift();
      }

      records.push(data);
      setTempStorage(storageKey, JSON.stringify(records));
    } catch (err) {
      /* NOOP */
    }
  };

  var getMetaProperties = function getMetaProperties() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return metaPropertiesInterface.getMetaProperties.apply(metaPropertiesInterface, [{
      clientName: clientName,
      getCurrentHref: getCurrentHref,
      getReferrer: getReferrer,
      getUserAgent: getUserAgent,
      getNetworkType: getNetworkType,
      getNetworkSpeed: getNetworkSpeed,
      getScreenWidth: getScreenWidth,
      getScreenHeight: getScreenHeight,
      getWindowWidth: getWindowWidth,
      getWindowHeight: getWindowHeight,
      getDeployableName: getDeployableName,
      getDeployableVersion: getDeployableVersion,
      getTempStorage: getTempStorage,
      setTempStorage: setTempStorage
    }].concat(args));
  };

  var scheduleEvent = function scheduleEvent(_ref4) {
    var bypassPool = _ref4.bypassPool,
        isBeforeUnload = _ref4.isBeforeUnload,
        isExternalHost = _ref4.isExternalHost;
    var identifiers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var eventKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var event = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var shouldPool = !bypassPool && !isBeforeUnload;

    if (shouldPool) {
      sendToPool({
        identifiers: identifiers
      }, event);
    } else {
      sendToNetwork({
        identifiers: identifiers,
        isBeforeUnload: isBeforeUnload,
        isExternalHost: isExternalHost
      }, [event]);
    }

    if (getShouldRecordEvents()) {
      safeRecordToStorage(storageKeys.recordedEventKeys, eventKey, 1000);
      safeRecordToStorage(storageKeys.recordedEvents, event, 25);
    }
  };

  return {
    createTracker: function createTracker() {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return trackerInterface.createLockedTracker.apply(trackerInterface, [{
        createIdentifiers: identifiersInterface.createIdentifiers,
        createEventPayload: eventInterface.createEventPayload,
        createDictionary: dictionaryInterface.createDictionary,
        dictionaryLookup: dictionaryInterface.dictionaryLookup,
        getMetaProperties: getMetaProperties,
        getDebug: getDebug,
        getEmail: getEmail,
        getHubId: getHubId,
        getHstc: getHstc,
        getLang: getLang,
        logError: logError,
        logMessage: logMessage,
        reportError: reportError,
        scheduleEvent: scheduleEvent
      }].concat(args));
    }
  };
};