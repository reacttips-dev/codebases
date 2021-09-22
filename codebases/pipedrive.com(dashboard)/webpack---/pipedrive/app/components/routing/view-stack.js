'use strict';

const _ = require('lodash');
const $ = require('jquery');

/**
 * Default options for view stack. Can be overriden.
 * - container is the jQuery element to where the stack items will be appended.
 * - timeout is the time a view can remain hidden and not removed from DOM.
 * - limit is the amount of items that can be in the stack. The older ones will be removed if limit is reached.
 * @type {Object}
 */

const defaultOptions = {
	containerIdPrefix: 'mainview',
	containerClass: 'viewContainer',
	timeout: 15 * 60 * 1000,
	limit: 20
};

/**
 * A class that helps to remember Views.
 * Is used by {@Router}.
 * If timeout is defined then views will be removed from the stack when they have been inactive for a certain amount of time.
 * If limit is defined then items are removed from the end of the stack when limit is reached.
 *
 * @class components/routing/ViewStack
 *
 * @param {Object} options
 */

const ViewStack = function(options) {
	this.options = _.defaults({}, options, defaultOptions);

	this.container = this.options.container;

	if (!this.container) {
		this.container = $(document.createDocumentFragment());
	}

	this.stack = [];
};

_.assignIn(
	ViewStack.prototype,
	/** @lends components/routing/ViewStack.prototype */ {
		setContainer: function(container) {
			const currentContainer = this.container;

			this.container = container;

			if (currentContainer.get(0) instanceof DocumentFragment) {
				this.container.append(currentContainer);
			} else {
				this.container.append(currentContainer.children());
			}
		},

		/**
		 * Gets a cached view from the stack or returns null, if view is not in stack.
		 * @param  {String} key 	Examples: "deal/17", "mail/inbox/1484"
		 * @return {Object}    		Object containing view data or null
		 */
		get: function(key) {
			return _.find(this.stack, { key });
		},

		/**
		 * Creates a new view to the stack and renders it.
		 * @param  {Text}      key  Key of the view to determine uniqueness.
		 * @param  {Function}  View View class to be rendered.
		 * @param  {Object}    options Options passed to the view.
		 * @return {Object}    Object containing view data
		 */
		create: function(key, View, options) {
			options = options || {};

			const viewContainerId = this.options.containerIdPrefix + _.uniqueId();
			const viewContainer = $('<div/>')
				.attr('id', viewContainerId)
				.addClass(this.options.containerClass);

			this.container.append(viewContainer);

			options.el = `#${viewContainer.attr('id')}`;

			const view = {
				instance: new View(options),
				container: viewContainer,
				key
			};

			this.stack.unshift(view);

			this.checkLimit();

			return view;
		},

		/**
		 * Remove a view from the stack.
		 * Also destroy the instance and remove it's container.
		 * @param {Object}  Object containing view data
		 * @void
		 */
		remove: function(view) {
			_.remove(this.stack, view);

			if (view.timeout) {
				clearTimeout(view.timeout);
			}

			view.instance.destroy();
			view.container.remove();
		},

		/**
		 * Remove view from the stack by view key string
		 * @param  {String} viewKey
		 * @void
		 */
		removeByKey: function(viewKey) {
			const stackedView = this.get(viewKey);

			if (stackedView) {
				this.remove(stackedView);
			}
		},

		/**
		 * Show a view and focus it.
		 * Also triggers resize on window because many listeners in views act on this to calculate sizes and positions.
		 * @param {Object}  Object containing view data
		 * @void
		 */
		show: function(view) {
			view.container.show();
			$(window).trigger('resize');

			view.instance.focus();
			clearTimeout(view.timeout);
		},

		/**
		 * Hide a view and blur it.
		 * If timeout is defined then initiate a removal with timeout.
		 * @param {Object}  Object containing view data
		 * @void
		 */
		hide: function(view) {
			if (_.isFunction(view.instance.blur)) {
				view.instance.blur();
			}

			view.container.hide();

			if (this.options.timeout) {
				view.timeout = setTimeout(_.bind(this.remove, this, view), this.options.timeout);
			}
		},

		/**
		 * Gets the current view
		 * @return {Object}  Object containing view data
		 */
		getCurrent: function() {
			return _.head(this.stack);
		},

		/**
		 * Set the current view
		 * @param {Object}  Object containing view data
		 * @void
		 */
		setCurrent: function(view) {
			this.stack.splice(this.stack.indexOf(view), 1);
			this.stack.unshift(view);
		},

		/**
		 * Checks the stack limit.
		 * If it's exceeded then remove one item from the stack.
		 * @void
		 */
		checkLimit: function() {
			if (this.options.limit && this.stack.length > this.options.limit) {
				this.remove(this.stack.pop());
			}
		},

		empty: function() {
			const viewsToDestroy = _.clone(this.stack);

			_.forEach(viewsToDestroy, _.bind(this.remove, this));
		},

		destroy: function() {
			this.empty();
		}
	}
);

module.exports = ViewStack;
