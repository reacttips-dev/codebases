import Backbone from 'backbone';

/**
 * @class Mediator
 * @extends {Backbone.Events}
 */
var Mediator = _.extend({}, Backbone.Events);
export default Mediator;

/**
 * Tells listener that new environment template has been added
 *
 * @event Mediator#environmentTemplateAdded
 */

/**
 * Tells listener to export Globals
 *
 * @event Mediator#downloadGlobals
 */

/**
 * Tells listener to set environment variable
 *
 * @event Mediator#setEnvironmentVariable
 */

/**
 * Tells listener to set global variable
 *
 * @event Mediator#setGlobalVariable
 */

/**
 * Tells listener to clear all variables of currently active environment
 *
 * @event Mediator#clearEnvironmentVariables
 */

/**
 * Tells listener to clear all global variables
 *
 * @event Mediator#clearGlobalVariables
 */

/**
 * Tells listener to clear a particular variable of currently active environment
 *
 * @event Mediator#clearEnvironmentVariable
 */

/**
 * Tells listener to clear a particular global variable
 *
 * @event Mediator#clearGlobalVariable
 */

/**
 * Tells listener to that a test run is finished
 *
 * @event Mediator#finishedTestRun
 */

/**
 * Tells listener to close the given requester window
 *
 * @event Mediator#closeRequesterWindow
 *
 * @param {UUID} windowId Id of the requester window to close
 */

/**
 * Tells listener to push local changes for a Collection to sync
 *
 * @event Mediator#commitTransaction
 *
 * @param {UUID} collectionId Id of the collection committed
 */

/**
 * Tells listener to add the given URL to cache. This cache is used for making suggestions in URL bar for new Requests.
 *
 * @event Mediator#addToURLCache
 *
 * @type {URL}
 *
 * @see URLCache
 */

/**
 * Tells listener to open a new Console Window
 *
 * @event Mediator#newConsoleWindow
 */

/**
 * Tells listener to open a new Requester Window
 *
 * @event Mediator#newRequesterWindow
 */

/**
 * Tells listener to toggle the layout of Builder. Switches between single column and two column layout.
 *
 * @event Mediator#toggleLayout
 */

/**
 * Tells listener a request in collection was updated.
 *
 * @event Mediator#updateCollectionRequest
 *
 * @param {Request~definition} request - The Collection request that was changed.
 * @param {Object} options - Meta information about the change
 * @param {String} options.source - The source where the request was updated from. (eg. sync, window or edit)
 */

 /**
 * Tells listener to close Import modal.
 *
 * @event Mediator#closeImportModal
 */

/**
 * Tells listener that import for a collection was unsuccessful.
 *
 * @event Mediator#failedCollectionImport
 *
 * @param {String} error - Error message while importing the collection
 */

/**
 * Tells listener that collections were loaded into memory during first load.
 *
 * @event Mediator#loadedCollections
 */

/**
 * Tells listener that collections were loaded from IndexedDB.
 *
 * @event Mediator#loadedCollectionsFromDB
 */

/**
 * Tells listener that one of the EntityManagers has finished loading.
 *
 * @event Mediator#modelsLoaded
 *
 * @param {String} model - The model that was loaded. eg. "collection", "environment"
 */

/**
 * Tells listener that one of the EntityManagers has finished loading.
 *
 * @event Mediator#itemLoaded
 *
 * @param {String} model - The model that was loaded. eg. "collection", "environment"
 */

/**
 * Tells listener to load a request in a tab.
 *
 * @event Mediator#loadRequest
 *
 * @param {Request~definition} request - Request to open
 * @param {Object} options - Options
 * @param {Boolean} options.isFromCollection - true if the request is loaded from a collection on sidebar
 * @param {Boolean} options.isPreview - If true opens the request in a "Preview Tab".
 * @param {Boolean} options.isAdjacent - If true the new tab will opened adjacent to the current active tab
 */

/**
 * Tells listener to open a request in a new tab.
 *
 * @event Mediator#loadRequestInNewTab
 *
 * @param {Request~definition} request - Request to open
 * @param {Object} options - Options
 * @param {Boolean} options.isFromCollection - true if the request is loaded from a collection on sidebar
 * @param {Boolean} options.isPreview - If true opens the request in a "Preview Tab".
 * @param {Boolean} options.isAdjacent - If true the new tab will opened adjacent to the current active tab
 */

/**
 * Indicates that there was an error when sharing a collection.
 *
 * @event Mediator#shareError
 *
 * @param {String} type - Type of share action, one of "share", "unshare"
 * @param {UUID} id - Collection Id for which share failed
 * @param {Object} meta - Meta information on the share error
 */

/**
 * This event is fired when a new changeset is received from Sync.
 *
 * @event Mediator#syncChangeReceived
 *
 * @param {String} action - Sync action
 * @param {Object} message - Sync data for changeset
 * @param {Function} callback - Callback to be invoked by listener to indicate the changeset was handled
 */

/**
 * Tells listener to fetch all shared collections for current user. Indicates a new collection was uploaded/shared.
 *
 * @event Mediator#refreshSharedCollections
 */

/**
 * Tells listener to add given requests to a collection
 *
 * @event Mediator#addRequestsToCollection
 *
 * @param {Request~definition[]} requestArray - List of requests to be added to collection
 * @param {Object} options - Options
 */

/**
 * This event is fired when a user tries to save a request on which he/she doesn't have edit role.
 *
 * @event Mediator#showForkRecommendationModal
 *
 * @param {Object} options - Options
 * @param {String} options.editorId - Id of the editor in which request is opened
 * @param {String} options.collectionId - Id of collection
 */
