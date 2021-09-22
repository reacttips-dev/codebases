const Pipedrive = require('pipedrive');
const _ = require('lodash');
const helper = require('utils/helpers');
const $ = require('jquery');
const logger = new Pipedrive.Logger('collectionview');

let local;

const CollectionView = Pipedrive.View.extend(
	/** @lends views/CollectionView.prototype */ {
		/**
		 * Collection view that handles the relationship between a view,
		 * collection and models and subviews in them.
		 *
		 * @class Collection view class
		 * @constructs
		 * @augments module:Pipedrive.View
		 *
		 * @example
		 * <caption>Example of how table rows are populated with TableRow views
		 * within tbody for each model of the collection.</caption>
		 *
		 * var collectionView = new CollectionView({
		 *     // Options for creating CollectionView
		 *     collection: this.collection,
		 *     childView: TableRowView,
		 *     tagName: 'tbody'
		 * }, {
		 *     // Options to be passed to each TableRowView
		 *     columns: _.keys(this.data.columns),
		 *     tagName: 'tr'
		 * });
		 * collectionView.render();
		 *
		 * @param {Object} options     Options to set for the Collection View.
		 *                             See {@link views/CollectionView.defaultOptions defaultOptions},
		 *                             {@link views/CollectionView.options this.options}.
		 * @param {Object} viewOptions Options to use for the Child Views.
		 *                             See {@link views/CollectionView.defaultViewOptions defaultViewOptions},
		 *                             {@link views/CollectionView.viewOptions this.viewOptions}.
		 * @param {Object} callbacks
		 * @returns {views/CollectionView} Returns itself for chaining
		 */
		initialize: function(options, viewOptions, callbacks) {
			/**
			 * Options used in the Collection View. collection and childView
			 * are required for this to work.
			 *
			 * @type {Object}
			 * @prop {module:Pipedrive.Collection} collection Collection to use
			 * @prop {module:Pipedrive.View} childView Child View to render for
			 *       each model
			 */
			this.options = _.assignIn({}, CollectionView.defaultOptions, options);
			/**
			 * Options for child views
			 * @type {Object}
			 */
			this.viewOptions = _.assignIn({}, CollectionView.defaultViewOptions, viewOptions);

			this.callbacks = callbacks;

			if (!helper.isCollection(this.options.collection)) {
				throw new Pipedrive.CollectionException('CollectionView: Missing collection');
			}

			if (!helper.isView(this.options.childView)) {
				throw new Pipedrive.ViewException('CollectionView: Missing child view');
			}

			/**
			 * Sub views of the CollectionView. Each item is a View that
			 * renders a model from the collection.
			 * @type {Object}
			 */
			this.views = {};

			// Init child views
			this.initChildViews();

			// Bind methods to this by default
			this.collection.on('add', local.handleCollectionAdd, this);
			this.collection.on('remove', local.handleCollectionRemove, this);
			this.collection.on('sort', local.handleCollectionSort, this);
			this.collection.on('reset', local.handleCollectionReset, this);

			// If comparator is missing in a collection, default sort by ‘id’
			// this.collection.comparator = this.sortBy;
			if (_.isUndefined(this.collection.comparator)) {
				this.collection.comparator = 'id';
			}

			// Handle options provided to CollectionView
			local.handleInitOptions.call(this);

			return this;
		},

		/**
		 * Initialize existing child views from a provided collection
		 * @void
		 */
		initChildViews: function() {
			logger.log('Init child views');
			this.collectionNotLoaded = this.collection.length === 0 && !this.collection.isPulled();

			if (this.options.placeholderView) {
				if (this.collectionNotLoaded) {
					local.loadPlaceholderView.call(this);
				} else {
					local.removePlaceholderView.call(this);
				}
			}

			this.collection.each(_.bind(local.handleCollectionAdd, this));
		},

		/**
		 * Update columns
		 * @param {Array} fields customView fields
		 * @void
		 */
		updateColumns: function(fields) {
			this.viewOptions.columns = _.keys(fields);
		},

		/**
		 * Renders collection view
		 *
		 * @description Renders the view with subviews
		 */
		selfRender: function() {
			this.collectionNotLoaded = this.collection.length === 0 && !this.collection.isPulled();

			const container = document.createDocumentFragment();

			if (this.options.placeholderView && this.collectionNotLoaded) {
				const $viewContainer = $(`<${this.viewOptions.tagName}>`).attr(
					'data-cid',
					'placeholder'
				);

				$viewContainer.prependTo(container);
			}

			this.collection.each(
				_.bind(function(model, i) {
					if (!this.options.limit || this.options.limit > i) {
						const $viewContainer = $(`<${this.viewOptions.tagName}>`).attr(
							'data-cid',
							model.cid
						);

						$viewContainer.appendTo(container);
					}
				}, this)
			);

			this.$el.html('').append(container);
		},

		/**
		 * Finds a collection item view by its model
		 * @param  {module:Pipedrive.Model} model Collection model to find
		 * @return {module:Pipedrive.View} view   Returns View that uses the
		 *                                        model
		 */
		findViewByModel: function(model) {
			const selector = `${this.viewOptions.tagName}[data-cid=${model.cid}]`;
			const itemView = this.getView(selector);

			return itemView;
		}
	},
	/**
	 * Static members of {@link views/CollectionView CollectionView}
	 * @lends views/CollectionView
	 */
	{
		/**
		 * Default options for CollectionViews
		 * @memberOf views/CollectionView
		 * @enum {String}
		 */
		defaultOptions: {
			/**
			 * Whether to call render on child views or children render
			 * themselves
			 * @type {Boolean}
			 * @default
			 */
			callViewRender: true,
			/**
			 * Whether to call collection pull on construct
			 * @type {Boolean}
			 * @default
			 */
			callCollectionPull: true,
			/**
			 * Limit number of items that get rendered to dom
			 * @type {Number}
			 * @default
			 */
			limit: 0
		},
		/**
		 * Default view options to pass to childrens view constructor
		 * @memberOf views/CollectionView
		 * @enum {String}
		 */
		defaultViewOptions: {
			/**
			 * Default element type used for collection view items
			 * @type {String}
			 * @default
			 */
			tagName: 'div',
			/**
			 * Default class used for collection view items
			 * @type {String}
			 * @default
			 */
			className: 'viewItem'
		}
	}
);

/**
 * Private methods of {@link views/CollectionView}
 * @memberOf views/CollectionView.prototype
 * @type {Object}
 * @enum {function}
 * @private
 */
local = {
	/**
	 * Handles adding model to a collection
	 * @description When a new model is added to a collection, a new view
	 *              is created for it and rendered if necessary
	 * @param {module:Pipedrive.Model} model Model that was added to a collection
	 * @void
	 */
	handleCollectionAdd: function(model) {
		const viewOptions = _.assignIn({ model }, this.viewOptions, {
			isLastItem: local.isLastItem.call(this, model)
		});

		// first items of the collection are rendered instantly together
		if (viewOptions.nonBlockingLoading && local.isPartOfTheFirstItems.call(this, model)) {
			viewOptions.nonBlockingLoading = false;
		}

		const view = new this.options.childView(viewOptions);

		if (this.options.callViewRender) {
			view.render();
		}

		this.addView(`${this.viewOptions.tagName}[data-cid=${model.cid}]`, view);

		if (this.callbacks && _.isFunction(this.callbacks.onModelAdd)) {
			this.callbacks.onModelAdd(model);
		}
	},

	/**
	 * Handles removing model to a collection
	 * @description When a new model is removed from a collection,
	 *              appropriate view is destroyed and removed from sub
	 *              views list
	 * @param {module:Pipedrive.Model} model Model that was removed from a
	 *                                       collection
	 * @void
	 */
	handleCollectionRemove: function(model) {
		const selector = `${this.viewOptions.tagName}[data-cid=${model.cid}]`;

		this.removeView(selector);

		if (this.callbacks && _.isFunction(this.callbacks.onModelRemove)) {
			this.callbacks.onModelRemove(model);
		}

		// Re-render everything to add additional items if there are any
		if (this.options.limit) {
			this.render();
		}
	},

	/**
	 * Handles view after sorting. Meaning re-renders the list
	 * @void
	 */
	handleCollectionSort: function() {
		if (this.callbacks && _.isFunction(this.callbacks.onCollectionSort)) {
			this.callbacks.onCollectionSort();
		}

		logger.log('Collection sort');
		this.render();
	},

	/**
	 * Handles view after full reset, as collection reset doesn't trigger 'add' event!
	 * @void
	 */
	handleCollectionReset: function() {
		logger.log('Collection reset');
		this.initChildViews();
		this.render();
	},

	/**
	 * Render placeholder view while loading
	 * @void
	 */
	loadPlaceholderView: function() {
		// Placeholder already rendered
		if (this.getView(`${this.viewOptions.tagName}[data-cid=placeholder]`)) {
			return;
		}

		logger.log('Rendering placeholder');
		const viewOptions = _.assignIn({}, this.viewOptions, { className: 'placeholder' });
		const view = new this.options.placeholderView(viewOptions).render();

		this.addView(`${this.viewOptions.tagName}[data-cid=placeholder]`, view);
	},

	/**
	 * Remove placeholder view after collection reset
	 * @void
	 */
	removePlaceholderView: function() {
		logger.log('Removing placeholder');
		this.removeView(`${this.viewOptions.tagName}[data-cid=placeholder]`);
	},

	/**
	 * Combines all extra actions that need to be done based on
	 * CollectionView’s constructor options
	 * @void
	 */
	handleInitOptions: function() {
		// Initiate first pull (or skip if prepopulated collection)
		if (this.options.callCollectionPull && this.collection.url) {
			this.pull(this.collection, {});
		}

		// Bind outside beforeRender listener
		if (_.isFunction(this.options.beforeRender)) {
			this.beforeRender = this.options.beforeRender;
		}

		// Bind outside afterRender listener
		if (_.isFunction(this.options.afterRender)) {
			this.afterRender = this.options.afterRender;
		}
	},

	/**
	 * Belongs to the group which are displayed first.
	 * Example: used for optimized loading of collectionview
	 * @param  {object}  model Collection model
	 * @return {Boolean}       Belongs/not belong to the first item group
	 */
	isPartOfTheFirstItems: function(model) {
		const firstItemsLimit = 20;

		return this.collection.indexOf(model) < firstItemsLimit;
	},

	/**
	 * Is last model of the collection
	 * @param  {object}  model Collection model
	 * @return {Boolean}
	 */
	isLastItem: function(model) {
		return this.collection.indexOf(model) === this.collection.length - 1;
	}
};

module.exports = CollectionView;
