const Backbone = require('backbone');
const _ = require('lodash');
const Logger = require('utils/logger');
const webappCore = require('@pipedrive/webapp-core');
const PipedriveCollection = webappCore.Collection;
const PipedriveView = webappCore.View;
const eventHandlers = webappCore.Events;
const PipedriveModel = webappCore.Model;

require('utils/widget');

/**
 * Pipedrive.Ready asynchronous flag-map controller
 *
 * Calling Pipedrive.Ready returns the control interface that enables
 * setting provided flags.
 *
 * @example
 * <pre>
 * const ready = Pipedrive.Ready(['a', 'b', 'c'], function() {
 *   console.log('Done!');
 * });
 * ready.set('a');
 * setTimeout(function() { ready.set('b'); }, 1000);
 * ready.set('c');
 * </pre>
 *
 * @param {Array} modules - Array of modules to check
 * @param {function} callback - Callback when all the modules are ready
 * @returns Object Returns interface
 */
const ReadyEvents = function(modules, callback) {
	const readyBits = {};

	let readyCallbacks = [];

	for (let i = 0; i < modules.length; i++) {
		readyBits[modules[i]] = false;
	}

	if (_.isFunction(callback)) {
		readyCallbacks.push(callback);
	}

	const isReady = function() {
		// eslint-disable-next-line no-unused-vars
		for (const i in readyBits) {
			if (readyBits[i]) {
				continue;
			}

			return false;
		}

		return true;
	};
	const readyCheck = function() {
		if (isReady()) {
			for (let i = 0; i < readyCallbacks.length; i++) {
				readyCallbacks[i]();
			}
			readyCallbacks = [];
		}
	};

	readyCheck();

	return {
		set: function(component, callback) {
			if (_.isFunction(callback)) {
				readyCallbacks.push(callback);
			}

			readyBits[component] = true;

			readyCheck();
		},
		onReady: function(callback) {
			if (_.isFunction(callback)) {
				if (isReady()) {
					return callback();
				}

				readyCallbacks.push(callback);
			}
		},
		isReady
	};
};
/**
 * A module named Pipedrive
 * @module Pipedrive
 */
const Pipedrive = {};

Pipedrive.View = PipedriveView;
Pipedrive.Model = PipedriveModel;
Pipedrive.Collection = PipedriveCollection;

/**
 * Pipedrive Router extends BackboneJS (see {@link http://backbonejs.org/#Router}).
 * @name     Router
 * @class    Pipedrive Router class
 * @extends  Backbone.Router
 * @memberOf module:Pipedrive
 */
Pipedrive.Router = Backbone.Router.extend(
	/** @lends module:Pipedrive.Router.prototype */ {
		bind: eventHandlers.bind,
		unbind: eventHandlers.unbind,
		fire: eventHandlers.fire,
		cancelNavigation: false,
		canceledNavigationCallback: null,
		lastCanceledNavigation: null,
		navigate: function(fragment, options) {
			if (this.cancelNavigation) {
				this.lastCanceledNavigation = {
					fragment,
					options,
					isHistoryBack: false
				};

				if (this.canceledNavigationCallback) {
					this.canceledNavigationCallback();
				}

				return;
			}

			let allowed = true;

			// fake event
			this.trigger('beforeNavigate', {
				details: fragment,
				preventDefault: function() {
					allowed = false;
				}
			});

			if (allowed) {
				this.trigger('navigate', fragment);

				return Backbone.Router.prototype.navigate.call(this, fragment, options);
			} else {
				return this;
			}
		},
		// disable navigation logic
		blockNavigation: function(cb) {
			if (this.cancelNavigation) {
				return;
			}

			this.cancelNavigation = true;
			this.canceledNavigationCallback = cb;

			this.recreateLastHistoryRecord = this.recreateLastHistoryRecord.bind(this);
			this.displayNativeWarning = this.displayNativeWarning.bind(this);

			this.lastCanceledNavigation = null;
			window.addEventListener('popstate', this.recreateLastHistoryRecord);
			window.addEventListener('beforeunload', this.displayNativeWarning);
		},
		unblockNavigation: function() {
			if (!this.cancelNavigation) {
				return;
			}

			this.cancelNavigation = false;
			this.canceledNavigationCallback = null;
			window.removeEventListener('popstate', this.recreateLastHistoryRecord);
			window.removeEventListener('beforeunload', this.displayNativeWarning);
		},
		restoreBlockedNavigation: function() {
			this.unblockNavigation();

			if (this.lastCanceledNavigation) {
				if (this.lastCanceledNavigation.isHistoryBack) {
					window.history.back();
				} else {
					this.navigate(
						this.lastCanceledNavigation.fragment,
						this.lastCanceledNavigation.options
					);
				}
			}
		},
		execute: function(callback, args) {
			if (this.cancelNavigation) {
				this.canceledNavigationCallback();

				return false;
			}

			if (callback) {
				// this must be called to pass to next route
				callback.apply(this, args);
			}
		},
		recreateLastHistoryRecord: function() {
			this.lastCanceledNavigation = {
				fragment: null,
				options: null,
				isHistoryBack: true
			};
			window.history.forward();
		},
		displayNativeWarning: function(event) {
			// Cancel the event as stated by the standard.
			event.preventDefault();
			// Chrome requires returnValue to be set.
			event.returnValue = '';
		}
	}
);

/**
 * Pipedrive Events extends BackboneJS (see {@link http://backbonejs.org/#Events}).
 * @name     Events
 * @class    Pipedrive Events class
 * @extends  Backbone.Events
 * @memberOf module:Pipedrive
 */

Pipedrive.Events = eventHandlers;

Pipedrive.common = {
	keyCodes: function() {
		return {
			enter: 13,
			escape: 27,
			left: 37,
			up: 38,
			right: 39,
			down: 40,
			f: 70,
			pgup: 33,
			pgdn: 34,
			backspace: 8,
			tab: 9,
			shift: 16,
			delete: 46
		};
	},

	isEnterClickedForNewLine: function(ev) {
		const lineBreakOn = [ev.shiftKey, ev.ctrlKey, ev.altKey];

		return ev.keyCode === this.keyCodes().enter && _.includes(lineBreakOn, true);
	}
};

Pipedrive.Logger = Logger;
Pipedrive.Ready = ReadyEvents;

Pipedrive.CollectionException = function(message) {
	this.name = 'CollectionException';
	this.message = message || 'Pipedrive.Collection Exception';
};
Pipedrive.ModelException = function(message) {
	this.name = 'ModelException';
	this.message = message || 'Pipedrive.Model Exception';
};
Pipedrive.ViewException = function(message) {
	this.name = 'ViewException';
	this.message = message || 'Pipedrive.View Exception';
};

Pipedrive.CollectionException.prototype = Error.prototype;
Pipedrive.ModelException.prototype = Error.prototype;
Pipedrive.ViewException.prototype = Error.prototype;

module.exports = Pipedrive;
